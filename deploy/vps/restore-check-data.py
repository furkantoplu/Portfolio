#!/usr/bin/env python3
"""Private, isolated restore QA. Never prints database rows, passwords or file names."""
import hashlib
import io
import json
import re
import subprocess
import sys
import tarfile
from pathlib import Path, PurePosixPath

IDENT = r'(?:[A-Za-z_][A-Za-z0-9_]*|"[A-Za-z_][A-Za-z0-9_]*")'
COPY = re.compile(rf'^COPY public\.({IDENT}) \((({IDENT})(, {IDENT})*)\) FROM stdin;$')


class CheckError(ValueError):
    """Only fixed developer-written reasons, never interpolated private data."""


def fingerprint(lines):
    hashes = sorted(hashlib.sha256(line).digest() for line in lines)
    return {"count": len(hashes), "hash": hashlib.sha256(b"".join(hashes)).hexdigest()}


def parse_copy(stream):
    result, current, rows = {}, None, []
    for line in stream:
        if current is not None:
            if line == b"\\.\n":
                table, columns = current
                result[table] = {"columns": columns, **fingerprint(rows)}
                current, rows = None, []
            else:
                rows.append(line)
            continue
        if line.startswith(b"COPY "):
            match = COPY.fullmatch(line.decode("utf-8").rstrip("\n"))
            if not match:
                raise CheckError("Unsupported COPY header")
            table = match[1].strip('"')
            columns = [part.strip('"') for part in match[2].split(", ")]
            if table in result:
                raise CheckError("Duplicate COPY table")
            current = (table, columns)
    if current is not None or not result:
        raise CheckError("Incomplete or empty COPY stream")
    return result


def query(container, sql):
    # Fixed isolated role/db, never the live Compose database.
    return subprocess.check_output([
        "docker", "exec", container, "psql", "-X", "-q", "-A", "-t",
        "-v", "ON_ERROR_STOP=1", "-U", "restore_check", "-d", "restore_check",
        "-c", sql,
    ], stderr=subprocess.PIPE)


def verify_database(container, expected):
    actual_tables = json.loads(query(container,
        "SELECT coalesce(json_agg(tablename ORDER BY tablename),'[]'::json) "
        "FROM pg_tables WHERE schemaname='public'"))
    if set(actual_tables) != set(expected):
        raise CheckError("Restored table set mismatch")
    for table, item in expected.items():
        if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", table):
            raise CheckError("Unsafe table identifier")
        for column in item["columns"]:
            if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", column):
                raise CheckError("Unsafe column identifier")
        columns = ", ".join('"' + name + '"' for name in item["columns"])
        data = query(container,
            'SET timezone=\'UTC\'; SET extra_float_digits=3; '
            f'COPY public."{table}" ({columns}) TO STDOUT')
        if fingerprint(io.BytesIO(data)) != {key: item[key] for key in ("count", "hash")}:
            raise CheckError("Restored table fingerprint mismatch")
    return len(expected)


def restore_uploads(archive, destination):
    root = destination.resolve(strict=True)
    if destination.is_symlink() or any(destination.iterdir()):
        raise CheckError("Extraction target must be empty and not a symlink")
    count, total = 0, 0
    with tarfile.open(archive, "r:gz") as bundle:
        for item in bundle:
            path = PurePosixPath(item.name)
            if path.is_absolute() or ".." in path.parts or "\\" in item.name:
                raise CheckError("Unsafe archive path")
            target = root.joinpath(*path.parts)
            if not target.is_relative_to(root):
                raise CheckError("Archive path escaped target")
            if item.isdir():
                target.mkdir(mode=0o700, parents=True, exist_ok=True)
                continue
            if not item.isfile() or target == root:
                raise CheckError("Links/devices/unsupported archive members rejected")
            total += item.size
            count += 1
            if total > 512 * 1024 * 1024 or count > 100000:
                raise CheckError("Restore-check upload budget exceeded")
            target.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
            source_hash, copied_hash = hashlib.sha256(), hashlib.sha256()
            with bundle.extractfile(item) as source, target.open("xb") as output:
                while chunk := source.read(1024 * 1024):
                    source_hash.update(chunk)
                    output.write(chunk)
            target.chmod(0o600)
            with target.open("rb") as copied:
                while chunk := copied.read(1024 * 1024):
                    copied_hash.update(chunk)
            if target.stat().st_size != item.size or source_hash.digest() != copied_hash.digest():
                raise CheckError("Extracted upload bytes mismatch")
    return count, total


def verify_files(container, root):
    files = json.loads(query(container,
        "SELECT coalesce(json_agg(json_build_object('disk',filename_disk,'size',filesize,"
        "'storage',storage)),'[]'::json) FROM directus_files"))
    for item in files:
        name = item["disk"]
        if (item["storage"] != "local" or not isinstance(name, str)
                or not name or PurePosixPath(name).name != name or "\\" in name
                or name in (".", "..")):
            raise CheckError("Unsupported/missing file storage metadata")
        path = root / name
        if not path.is_file() or path.is_symlink() or path.stat().st_size != int(item["size"]):
            raise CheckError("Restored database photo/file mismatch")
    return len(files)


def main():
    if sys.argv[1:] == ["inventory"]:
        json.dump(parse_copy(sys.stdin.buffer), sys.stdout, sort_keys=True)
        return
    if len(sys.argv) != 6 or sys.argv[1] != "verify":
        raise CheckError("Unsupported command")
    container, inventory, archive, destination = sys.argv[2:]
    if not re.fullmatch(r"[a-f0-9]{64}", container):
        raise CheckError("Container ID required")
    inspect = json.loads(subprocess.check_output(["docker", "inspect", container], stderr=subprocess.PIPE))[0]
    if (inspect["HostConfig"]["NetworkMode"] != "none" or inspect["HostConfig"]["PortBindings"]
            or not inspect["HostConfig"]["ReadonlyRootfs"]
            or not inspect["Config"]["Labels"].get("com.furkantoplu.restore-check")):
        raise CheckError("Isolated labeled container required")
    for mount in inspect["Mounts"]:
        if mount["Type"] == "tmpfs":
            continue
        if (mount["Type"] != "bind" or mount["RW"]
                or mount["Destination"] != "/run/secrets/restore-password"
                or not re.fullmatch(r"/run/furkantoplu-restore-check\.[A-Za-z0-9]+/password", mount["Source"])):
            raise CheckError("Unexpected persistent/production mount")
    expected = json.loads(Path(inventory).read_text())
    tables = verify_database(container, expected)
    uploads, size = restore_uploads(archive, Path(destination))
    referenced = verify_files(container, Path(destination))
    print(f"PASS restored table fingerprints: {tables}; upload files: {uploads}; "
          f"upload bytes: {size}; matching database file records: {referenced}")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        # Raw SQL/COPY/exception details may include private rows. Keep output generic.
        reason = str(error) if isinstance(error, CheckError) else type(error).__name__
        print(f"Restore data verification failed: {reason}; no private row details printed.", file=sys.stderr)
        sys.exit(1)

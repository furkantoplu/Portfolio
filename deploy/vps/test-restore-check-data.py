#!/usr/bin/env python3
import importlib.util
import io
import tarfile
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("restore_check", Path(__file__).with_name("restore-check-data.py"))
qa = importlib.util.module_from_spec(spec)
spec.loader.exec_module(qa)


class RestoreDataTests(unittest.TestCase):
    def test_runner_requires_explicit_sql_output_and_isolation(self):
        script = Path(__file__).with_name("restore-check.sh").read_text()
        self.assertIn("pg_restore --data-only --file=-", script)
        self.assertIn("--network none", script)
        self.assertIn("--single-transaction --no-owner --no-acl", script)
        self.assertIn("[[ $task_tables == 0 ]]", script)
        self.assertNotIn("-v postgres_data", script)

    def test_copy_multiset_and_escaped_rows(self):
        source = b"SET x=y;\nCOPY public.test (id, \"label\") FROM stdin;\n1\talpha\\nline\n2\t\\N\n\\.\nCOPY public.empty (id) FROM stdin;\n\\.\n"
        actual = qa.parse_copy(io.BytesIO(source))
        self.assertEqual(actual["test"]["columns"], ["id", "label"])
        self.assertEqual(actual["test"]["count"], 2)
        self.assertEqual(actual["empty"]["count"], 0)
        self.assertEqual(qa.fingerprint([b"a\n", b"b\n"]), qa.fingerprint([b"b\n", b"a\n"]))
        self.assertNotEqual(qa.fingerprint([b"a\n"]), qa.fingerprint([b"a\n", b"a\n"]))

    def test_copy_rejects_invalid_or_truncated(self):
        for value in [b"", b"COPY public.test (id) FROM stdin;\n1\n",
                      b"COPY private.test (id) FROM stdin;\n\\.\n",
                      b"COPY public.test (id) FROM stdin;\n\\.\nCOPY public.test (id) FROM stdin;\n\\.\n"]:
            with self.assertRaises(ValueError):
                qa.parse_copy(io.BytesIO(value))

    def archive(self, root, name, content=b"image-fixture", kind=None):
        archive = root / "archive.tar.gz"
        with tarfile.open(archive, "w:gz") as bundle:
            entry = tarfile.TarInfo(name)
            if kind:
                entry.type, entry.linkname = kind, "outside"
                bundle.addfile(entry)
            else:
                entry.size = len(content)
                bundle.addfile(entry, io.BytesIO(content))
        return archive

    def test_upload_roundtrip_and_empty_target(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            target = root / "uploads"
            target.mkdir()
            archive = self.archive(root, "./nested/photo.jpg")
            self.assertEqual(qa.restore_uploads(archive, target), (1, 13))
            self.assertEqual((target / "nested/photo.jpg").read_bytes(), b"image-fixture")
            with self.assertRaises(ValueError):
                qa.restore_uploads(archive, target)

    def test_archive_path_and_link_rejection(self):
        for name, kind in [("../escape", None), ("/absolute", None), ("..\\escape", None),
                           ("link", tarfile.SYMTYPE), ("hardlink", tarfile.LNKTYPE),
                           ("device", tarfile.CHRTYPE)]:
            with tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                target = root / "uploads"
                target.mkdir()
                with self.assertRaises(ValueError):
                    qa.restore_uploads(self.archive(root, name, kind=kind), target)
                self.assertFalse((root / "escape").exists())

    def test_database_file_size_and_storage(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "photo.jpg").write_bytes(b"img")
            for row, valid in [({"disk": "photo.jpg", "size": 3, "storage": "local"}, True),
                               ({"disk": "photo.jpg", "size": 4, "storage": "local"}, False),
                               ({"disk": "../photo.jpg", "size": 3, "storage": "local"}, False),
                               ({"disk": "photo.jpg", "size": 3, "storage": "s3"}, False)]:
                with patch.object(qa, "query", return_value=__import__("json").dumps([row]).encode()):
                    if valid:
                        self.assertEqual(qa.verify_files("fixture", root), 1)
                    else:
                        with self.assertRaises(ValueError):
                            qa.verify_files("fixture", root)


if __name__ == "__main__":
    unittest.main()

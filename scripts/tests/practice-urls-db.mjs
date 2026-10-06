import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const result = spawnSync("docker", ["compose", "exec", "-T", "database", "sh", "-c", 'exec psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"'], {
  cwd: new URL("../../", import.meta.url), input: readFileSync(new URL("./practice-urls-db.sql", import.meta.url), "utf8"), encoding: "utf8",
});
if (result.error) throw result.error;
if (result.status !== 0) { process.stderr.write(result.stderr); process.exit(result.status || 1); }
console.log("PASS database: automatic slug, rename, duplicates, reserved old URLs, translation aliases, blog isolation; all test content rolled back");

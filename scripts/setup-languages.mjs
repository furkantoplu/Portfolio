import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { seeds } from "./page-language-seeds.mjs";

const root = resolve(import.meta.dirname, "..");
let sql = readFileSync(resolve(root, "scripts/migrations/001-content-translations.sql"), "utf8");
sql += "\nBEGIN;\n";
for (const [language, pages] of Object.entries(seeds)) {
  for (const [pageKey, content] of Object.entries(pages)) {
    const json = JSON.stringify(content).replaceAll("'", "''");
    sql += `INSERT INTO website_content_translations(collection,parent_id,language,status,content) SELECT 'site_pages',id,'${language}','published','${json}'::jsonb FROM site_pages WHERE page_key='${pageKey}' ON CONFLICT(collection,parent_id,language) DO NOTHING;\n`;
  }
}
sql += "COMMIT;\n";
sql += readFileSync(resolve(root, "scripts/migrations/003-editable-public-pages.sql"), "utf8");
sql += readFileSync(resolve(root, "scripts/migrations/004-practice-title-urls.sql"), "utf8");
sql += readFileSync(resolve(root, "scripts/migrations/005-password-policy-escaping.sql"), "utf8");
sql += readFileSync(resolve(root, "scripts/migrations/006-section-visibility.sql"), "utf8");
sql += readFileSync(resolve(root, "scripts/migrations/007-white-coat-hero.sql"), "utf8");
sql += readFileSync(resolve(root, "scripts/migrations/008-media-cleanup.sql"), "utf8");
sql += readFileSync(resolve(root, "scripts/migrations/009-footer-settings.sql"), "utf8");
sql += readFileSync(resolve(root, "scripts/migrations/010-owner-portrait-defaults.sql"), "utf8");
sql += readFileSync(resolve(root, "scripts/migrations/011-content-delete-cleanup.sql"), "utf8");
const result = spawnSync("docker", ["compose", "exec", "-T", "database", "sh", "-c", 'exec psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"'], { cwd: root, input: sql, encoding: "utf8" });
if (result.error) throw result.error;
process.stdout.write(result.stdout || "");
process.stderr.write(result.stderr || "");
if (result.status !== 0) process.exit(result.status || 1);
console.log("Çeviri tablosu ve başlangıç sayfa çevirileri hazır. Mevcut kayıtlar korunmuştur.");

import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {randomBytes} from 'node:crypto';
import assert from 'node:assert/strict';
// A private schema in a rolled-back transaction: no live CMS rows or triggers.
const schema='codex_delete_'+randomBytes(8).toString('hex');
const setup=`BEGIN;
CREATE SCHEMA ${schema}; SET LOCAL search_path TO ${schema},pg_catalog;
CREATE TABLE practice_areas(id integer PRIMARY KEY);
CREATE TABLE blog_posts(id integer PRIMARY KEY);
CREATE TABLE site_pages(id integer PRIMARY KEY);
CREATE TABLE website_content_translations(id serial PRIMARY KEY,collection text NOT NULL,parent_id integer NOT NULL,language text);
CREATE TABLE website_practice_slug_aliases(slug text,parent_id integer REFERENCES practice_areas(id) ON DELETE CASCADE);
INSERT INTO practice_areas VALUES(1),(2); INSERT INTO blog_posts VALUES(1); INSERT INTO site_pages VALUES(1);
`;
const migration=readFileSync(new URL('../migrations/011-content-delete-cleanup.sql',import.meta.url),'utf8').replace(/^BEGIN;\s*/,'').replace(/COMMIT;\s*$/,'');
const checks=`
INSERT INTO website_content_translations(collection,parent_id,language) VALUES
('practice_areas',1,'en'),('practice_areas',1,'de'),('practice_areas',2,'en'),('blog_posts',1,'en'),('site_pages',1,'de');
INSERT INTO website_practice_slug_aliases VALUES('old-alias',1);
DELETE FROM practice_areas WHERE id=1;
DO $checks$ BEGIN
  IF EXISTS(SELECT 1 FROM website_content_translations WHERE collection='practice_areas' AND parent_id=1) THEN RAISE EXCEPTION 'Deleted parent translations remain'; END IF;
  IF (SELECT count(*) FROM website_content_translations)<>3 THEN RAISE EXCEPTION 'Other translations changed'; END IF;
  IF EXISTS(SELECT 1 FROM website_practice_slug_aliases) THEN RAISE EXCEPTION 'Alias remains'; END IF;
  BEGIN
    INSERT INTO website_content_translations(collection,parent_id,language) VALUES('practice_areas',1,'en');
    RAISE EXCEPTION 'Orphan insert allowed';
  EXCEPTION WHEN foreign_key_violation THEN NULL; END;
  BEGIN
    UPDATE website_content_translations SET parent_id=999 WHERE collection='blog_posts';
    RAISE EXCEPTION 'Orphan update allowed';
  EXCEPTION WHEN foreign_key_violation THEN NULL; END;
END $checks$;
SAVEPOINT deletion; DELETE FROM blog_posts WHERE id=1; ROLLBACK TO deletion;
DO $checks$ BEGIN
  IF NOT EXISTS(SELECT 1 FROM website_content_translations WHERE collection='blog_posts' AND parent_id=1) THEN RAISE EXCEPTION 'Translation rollback not atomic'; END IF;
END $checks$;
DELETE FROM blog_posts WHERE id=1; DELETE FROM site_pages WHERE id=1;
DO $checks$ BEGIN
  IF (SELECT count(*) FROM website_content_translations)<>1 THEN RAISE EXCEPTION 'Cleanup across collections failed'; END IF;
END $checks$;
ROLLBACK;
SELECT 'PASS isolated SQL: delete cascades, cross-collection IDs, aliases, orphan guards, rollback, repeat migration';
`;
const result=spawnSync('docker',['compose','exec','-T','database','sh','-c','exec psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"'],{cwd:new URL('../../',import.meta.url),input:setup+migration+migration+checks,encoding:'utf8'});
assert.equal(result.status,0,result.stderr);console.log(result.stdout);

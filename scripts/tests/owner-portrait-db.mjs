import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
// Temp tables shadow only these two names on this single connection. No real
// CMS rows, uploads, credentials or public profile records are modified.
const setup=`
CREATE TEMP TABLE site_pages(id integer,page_key text,content json);
CREATE TEMP TABLE website_content_translations(collection text,parent_id integer,language text,content jsonb);
INSERT INTO site_pages VALUES
(1,'home','{"about_image":"/about-physiotherapist-v1.png","about_image_alt":"Klinikte duran fizyoterapist portresi","section_visibility":{"about_image":false},"keep":"original"}'),
(2,'about','{"image_path":"/about-physiotherapist-v1.png","image_alt":"Custom alt"}'),
(3,'home','{"about_image":"/site-media/12345678-1234-4234-8234-123456789abc","about_image_alt":"Actual upload"}'),
(4,'about','{"image_path":"/custom-owner.png","keep":"original"}');
INSERT INTO website_content_translations VALUES
('site_pages',1,'en','{"about_image_alt":"Portrait of a physiotherapist in a clinic","hero_title":"Keep title"}'),
('site_pages',2,'de','{"image_alt":"","hero_title":"Keep title"}');
`;
const migration=await readFile(new URL('../migrations/010-owner-portrait-defaults.sql',import.meta.url),'utf8');
const checks=`DO $checks$ BEGIN
  IF (SELECT content->>'about_image' FROM site_pages WHERE id=1)<>'/furkan-toplu-hero-white-coat-v1.png' THEN RAISE EXCEPTION 'Default was not replaced'; END IF;
  IF (SELECT content->'section_visibility'->>'about_image' FROM site_pages WHERE id=1)<>'false' THEN RAISE EXCEPTION 'Visibility changed'; END IF;
  IF (SELECT content->>'image_alt' FROM site_pages WHERE id=2)<>'Custom alt' THEN RAISE EXCEPTION 'Custom alt overwritten'; END IF;
  IF (SELECT content->>'about_image' FROM site_pages WHERE id=3)<>'/site-media/12345678-1234-4234-8234-123456789abc' THEN RAISE EXCEPTION 'Upload overwritten'; END IF;
  IF (SELECT content->>'image_path' FROM site_pages WHERE id=4)<>'/custom-owner.png' THEN RAISE EXCEPTION 'Custom image overwritten'; END IF;
  IF (SELECT content->>'hero_title' FROM website_content_translations WHERE parent_id=1)<>'Keep title' THEN RAISE EXCEPTION 'Translation overwritten'; END IF;
END $checks$;
SELECT 'PASS owner portrait defaults, custom uploads/alts/visibility, repeat migration';
`;
const result=spawnSync('docker',['compose','exec','-T','database','sh','-c','exec psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"'],{input:setup+migration+migration+checks,encoding:'utf8',cwd:new URL('../../',import.meta.url)});
assert.equal(result.status,0,result.stderr);console.log(result.stdout);

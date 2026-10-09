BEGIN;
CREATE TABLE IF NOT EXISTS website_media_assets (
  file_id uuid PRIMARY KEY REFERENCES directus_files(id) ON DELETE CASCADE,
  previously_referenced boolean NOT NULL DEFAULT false,
  cleanup_after timestamptz NOT NULL DEFAULT now() + interval '24 hours',
  retired_at timestamptz
);
ALTER TABLE website_media_assets ADD COLUMN IF NOT EXISTS retired_at timestamptz;

-- Adopt only uploads known to have belonged to website content, including old
-- revision references. No arbitrary file-library wipe and no file deletion in SQL.
WITH sources AS (
  SELECT image_path AS text FROM practice_areas UNION ALL
  SELECT cover_path FROM blog_posts UNION ALL
  SELECT content::text FROM site_pages UNION ALL
  SELECT content::text FROM website_content_translations UNION ALL
  SELECT COALESCE(r.data::text,'') || COALESCE(r.delta::text,'') FROM directus_revisions r
    JOIN directus_activity a ON a.id=r.activity
    WHERE a.collection IN ('practice_areas','blog_posts','site_pages','website_content_translations')
), ids AS (
  SELECT DISTINCT (regexp_matches(text,'/site-media/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})','g'))[1]::uuid AS id FROM sources
)
INSERT INTO website_media_assets(file_id,previously_referenced,cleanup_after)
  SELECT f.id,true,now() FROM ids JOIN directus_files f ON f.id=ids.id
  WHERE f.type IN ('image/jpeg','image/png','image/webp')
  ON CONFLICT(file_id) DO NOTHING;

CREATE OR REPLACE FUNCTION website_guard_media_reference() RETURNS trigger AS $guard$
DECLARE field text; value text; file_key uuid; content_json jsonb; file_keys uuid[] := '{}';
BEGIN
  content_json=to_jsonb(NEW);
  IF TG_TABLE_NAME='site_pages' THEN content_json=content_json->'content'; END IF;
  FOREACH field IN ARRAY ARRAY['image_path','cover_path','hero_image','about_image'] LOOP
    value=content_json->>field;
    IF value LIKE '/site-media/%' THEN
      IF value !~ '^/site-media/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' THEN
        RAISE EXCEPTION 'Invalid site image reference' USING ERRCODE='23514';
      END IF;
      file_key=substring(value FROM 13)::uuid;
      file_keys=array_append(file_keys,file_key);
    END IF;
  END LOOP;
  -- Multiple hero/about references lock in UUID order, avoiding swapped-image deadlocks.
  FOR file_key IN SELECT DISTINCT unnest(file_keys) ORDER BY 1 LOOP
      PERFORM id FROM directus_files WHERE id=file_key AND type IN ('image/jpeg','image/png','image/webp') FOR UPDATE;
      IF NOT FOUND THEN RAISE EXCEPTION 'Site image no longer exists; upload it again' USING ERRCODE='23514'; END IF;
      IF EXISTS(SELECT 1 FROM website_media_assets WHERE file_id=file_key AND retired_at IS NOT NULL) THEN
        RAISE EXCEPTION 'Site image is being permanently deleted; upload it again' USING ERRCODE='23514';
      END IF;
      INSERT INTO website_media_assets(file_id,previously_referenced,cleanup_after) VALUES(file_key,true,now())
        ON CONFLICT(file_id) DO UPDATE SET previously_referenced=true;
  END LOOP;
  RETURN NEW;
END;
$guard$ LANGUAGE plpgsql;
DO $triggers$
DECLARE name text;
BEGIN
  FOREACH name IN ARRAY ARRAY['practice_areas','blog_posts','site_pages'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS website_media_reference_guard ON %I',name);
    EXECUTE format('CREATE TRIGGER website_media_reference_guard BEFORE INSERT OR UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION website_guard_media_reference()',name);
  END LOOP;
END;
$triggers$;
COMMIT;

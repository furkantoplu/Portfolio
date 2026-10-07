BEGIN;
DO $migration$
DECLARE name text;
BEGIN
  FOREACH name IN ARRAY ARRAY['practice_areas', 'blog_posts'] LOOP
    IF to_regclass('public.' || name) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS section_visibility jsonb NOT NULL DEFAULT ''{}''::jsonb', name);
      INSERT INTO directus_fields(collection, field, special, interface, hidden, readonly, note)
        SELECT name, 'section_visibility', 'cast-json', 'input-code', true, false, 'Public bölüm görünürlüğü. Eksik bayraklar açık kabul edilir.'
        WHERE NOT EXISTS(SELECT 1 FROM directus_fields WHERE collection = name AND field = 'section_visibility');
    END IF;
  END LOOP;
END;
$migration$;
COMMIT;

BEGIN;
-- Polymorphic translations cannot use one regular foreign key. Parent row
-- locks serialize translation inserts with parent deletion, like FK checks.
CREATE OR REPLACE FUNCTION website_translation_parent_guard() RETURNS trigger
LANGUAGE plpgsql AS $guard$
DECLARE parent_key integer;
BEGIN
  IF NEW.collection NOT IN ('practice_areas', 'blog_posts', 'site_pages') THEN
    RAISE EXCEPTION 'Invalid translation parent collection' USING ERRCODE='23514';
  END IF;
  EXECUTE format('SELECT id FROM %I WHERE id=$1 FOR KEY SHARE', NEW.collection)
    INTO parent_key USING NEW.parent_id;
  IF parent_key IS NULL THEN
    RAISE EXCEPTION 'Translation parent no longer exists' USING ERRCODE='23503';
  END IF;
  RETURN NEW;
END;
$guard$;

CREATE OR REPLACE FUNCTION website_delete_content_translations() RETURNS trigger
LANGUAGE plpgsql AS $cleanup$
BEGIN
  DELETE FROM website_content_translations WHERE collection=TG_TABLE_NAME AND parent_id=OLD.id;
  RETURN OLD;
END;
$cleanup$;

DROP TRIGGER IF EXISTS website_translation_parent_exists ON website_content_translations;
CREATE TRIGGER website_translation_parent_exists BEFORE INSERT OR UPDATE ON website_content_translations
  FOR EACH ROW EXECUTE FUNCTION website_translation_parent_guard();

DO $triggers$
DECLARE collection_name text;
BEGIN
  FOREACH collection_name IN ARRAY ARRAY['practice_areas', 'blog_posts', 'site_pages'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS website_content_translation_cleanup ON %I',collection_name);
    EXECUTE format('CREATE TRIGGER website_content_translation_cleanup AFTER DELETE ON %I FOR EACH ROW EXECUTE FUNCTION website_delete_content_translations()',collection_name);
  END LOOP;
END;
$triggers$;
COMMIT;

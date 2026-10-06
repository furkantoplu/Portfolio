BEGIN;
DO $setup$
BEGIN
  IF to_regclass('public.practice_areas') IS NOT NULL THEN
    CREATE TABLE IF NOT EXISTS website_practice_slug_aliases (
      language varchar(2) NOT NULL CHECK (language IN ('tr','en','de')),
      slug varchar(220) NOT NULL,
      parent_id integer NOT NULL REFERENCES practice_areas(id) ON DELETE CASCADE,
      PRIMARY KEY (language, slug)
    );
  END IF;
END;
$setup$;

CREATE OR REPLACE FUNCTION website_practice_title_slug(value text) RETURNS text
LANGUAGE sql IMMUTABLE AS $fn$
  SELECT coalesce(nullif(rtrim(left(trim(both '-' from regexp_replace(
    regexp_replace(normalize(replace(lower(translate(btrim(value), 'ıİ', 'ii')), 'ß', 'ss'), NFD), U&'[\0300-\036F]', '', 'g'),
    '[^a-z0-9]+', '-', 'g')), 200), '-'), ''), 'calisma-alani');
$fn$;

CREATE OR REPLACE FUNCTION website_choose_practice_slug(value text, owner_id integer, locale text) RETURNS text
LANGUAGE plpgsql AS $fn$
DECLARE base text := website_practice_title_slug(value); candidate text := base; taken boolean; attempt integer := 0;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended('practice-url:' || locale || ':' || base, 0));
  LOOP
    IF locale = 'tr' THEN
      SELECT EXISTS(SELECT 1 FROM practice_areas WHERE slug = candidate AND id <> owner_id) INTO taken;
    ELSE
      SELECT EXISTS(SELECT 1 FROM website_content_translations WHERE collection = 'practice_areas' AND language = locale AND slug = candidate AND parent_id <> owner_id) INTO taken;
    END IF;
    SELECT taken OR EXISTS(SELECT 1 FROM website_practice_slug_aliases WHERE language = locale AND slug = candidate AND parent_id <> owner_id) INTO taken;
    IF NOT taken THEN RETURN candidate; END IF;
    attempt := attempt + 1;
    candidate := base || '-' || owner_id::text || CASE WHEN attempt > 1 THEN '-' || attempt::text ELSE '' END;
  END LOOP;
END;
$fn$;

CREATE OR REPLACE FUNCTION website_practice_title_url_trigger() RETURNS trigger
LANGUAGE plpgsql AS $fn$
BEGIN
  NEW.slug := website_choose_practice_slug(NEW.title, NEW.id, 'tr');
  IF TG_OP = 'UPDATE' AND OLD.slug IS DISTINCT FROM NEW.slug THEN
    INSERT INTO website_practice_slug_aliases(language, slug, parent_id) VALUES ('tr', OLD.slug, NEW.id) ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$fn$;

CREATE OR REPLACE FUNCTION website_practice_translation_url_trigger() RETURNS trigger
LANGUAGE plpgsql AS $fn$
BEGIN
  IF NEW.collection <> 'practice_areas' THEN RETURN NEW; END IF;
  NEW.slug := website_choose_practice_slug(NEW.content ->> 'title', NEW.parent_id, NEW.language);
  IF TG_OP = 'UPDATE' AND OLD.slug IS NOT NULL AND OLD.slug IS DISTINCT FROM NEW.slug THEN
    INSERT INTO website_practice_slug_aliases(language, slug, parent_id) VALUES (OLD.language, OLD.slug, OLD.parent_id) ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$fn$;

DO $setup$
DECLARE row_record record;
BEGIN
  IF to_regclass('public.practice_areas') IS NOT NULL THEN
    DROP TRIGGER IF EXISTS website_practice_title_url ON practice_areas;
    CREATE TRIGGER website_practice_title_url BEFORE INSERT OR UPDATE OF title, slug ON practice_areas FOR EACH ROW EXECUTE FUNCTION website_practice_title_url_trigger();
    DROP TRIGGER IF EXISTS website_practice_translation_url ON website_content_translations;
    CREATE TRIGGER website_practice_translation_url BEFORE INSERT OR UPDATE OF content, slug ON website_content_translations FOR EACH ROW EXECUTE FUNCTION website_practice_translation_url_trigger();
    FOR row_record IN SELECT id FROM practice_areas ORDER BY id LOOP
      UPDATE practice_areas SET title = title WHERE id = row_record.id;
    END LOOP;
    FOR row_record IN SELECT id FROM website_content_translations WHERE collection = 'practice_areas' ORDER BY id LOOP
      UPDATE website_content_translations SET content = content WHERE id = row_record.id;
    END LOOP;
  END IF;
END;
$setup$;
COMMIT;

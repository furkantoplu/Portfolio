BEGIN;
CREATE TABLE IF NOT EXISTS website_content_translations (
  id bigserial PRIMARY KEY,
  collection varchar(40) NOT NULL CHECK (collection IN ('practice_areas', 'blog_posts', 'site_pages')),
  parent_id integer NOT NULL,
  language varchar(2) NOT NULL CHECK (language IN ('en', 'de')),
  status varchar(12) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'hidden')),
  slug varchar(220),
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (collection, parent_id, language)
);
CREATE UNIQUE INDEX IF NOT EXISTS website_translation_slug_unique ON website_content_translations(collection, language, slug) WHERE slug IS NOT NULL;
COMMIT;

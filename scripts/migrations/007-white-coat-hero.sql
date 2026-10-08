-- Replace only the previous bundled red-shirt portrait. Preserve custom uploads,
-- other home content, visibility and any independently edited alt text.
BEGIN;
DO $portrait$
DECLARE replaced integer[];
BEGIN
  IF to_regclass('public.site_pages') IS NULL THEN RETURN; END IF;
  SELECT array_agg(id) INTO replaced FROM site_pages
    WHERE page_key = 'home' AND content->>'hero_image' IN (
      '/furkan-toplu-hero-3d-v1.png', '/furkan-toplu-hero-3d-v2.png', '/furkan-toplu-hero-3d-v3.png'
    );
  UPDATE site_pages SET content = (
    content::jsonb || jsonb_build_object('hero_image', '/furkan-toplu-hero-white-coat-v1.png') ||
    CASE WHEN COALESCE(content->>'hero_image_alt', '') IN ('', 'Kollarını bağlayarak gülümseyen Fizyoterapist Furkan Toplu')
      THEN jsonb_build_object('hero_image_alt', 'Beyaz önlüğüyle kollarını bağlayan Fizyoterapist Furkan Toplu')
      ELSE '{}'::jsonb END
  )::json WHERE id = ANY(replaced);
  IF to_regclass('public.website_content_translations') IS NOT NULL THEN
    UPDATE website_content_translations SET content = jsonb_set(content, '{hero_image_alt}', to_jsonb(
      CASE language
        WHEN 'en' THEN 'Physiotherapist Furkan Toplu in a white coat with his arms crossed'
        ELSE 'Physiotherapeut Furkan Toplu im weißen Kittel mit verschränkten Armen'
      END::text), true)
    WHERE collection = 'site_pages' AND parent_id = ANY(replaced) AND (
      (language = 'en' AND COALESCE(content->>'hero_image_alt','') IN ('', 'Physiotherapist Furkan Toplu smiling with his arms crossed')) OR
      (language = 'de' AND COALESCE(content->>'hero_image_alt','') IN ('', 'Physiotherapeut Furkan Toplu lächelt mit verschränkten Armen'))
    );
  END IF;
END;
$portrait$;
COMMIT;

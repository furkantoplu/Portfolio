-- Only replace the bundled unrelated model portrait, never uploaded/admin-selected photos.
BEGIN;
DO $owner$
DECLARE affected_home integer[]; affected_about integer[];
BEGIN
  IF to_regclass('public.site_pages') IS NULL THEN RETURN; END IF;
  SELECT array_agg(id) INTO affected_home FROM site_pages WHERE page_key='home' AND content->>'about_image'='/about-physiotherapist-v1.png';
  SELECT array_agg(id) INTO affected_about FROM site_pages WHERE page_key='about' AND content->>'image_path'='/about-physiotherapist-v1.png';
  UPDATE site_pages SET content=(content::jsonb || jsonb_build_object('about_image','/furkan-toplu-hero-white-coat-v1.png') ||
    CASE WHEN COALESCE(content->>'about_image_alt','') IN ('','Klinikte duran fizyoterapist portresi')
      THEN jsonb_build_object('about_image_alt','Fizyoterapist Furkan Toplu''nun portresi') ELSE '{}'::jsonb END)::json
    WHERE id=ANY(affected_home);
  UPDATE site_pages SET content=(content::jsonb || jsonb_build_object('image_path','/furkan-toplu-hero-white-coat-v1.png') ||
    CASE WHEN COALESCE(content->>'image_alt','') IN ('','Klinik ortamında fizyoterapist Furkan Toplu')
      THEN jsonb_build_object('image_alt','Fizyoterapist Furkan Toplu''nun portresi') ELSE '{}'::jsonb END)::json
    WHERE id=ANY(affected_about);
  IF to_regclass('public.website_content_translations') IS NOT NULL THEN
    UPDATE website_content_translations SET content=jsonb_set(content,'{about_image_alt}',to_jsonb(
      CASE language WHEN 'en' THEN 'Portrait of physiotherapist Furkan Toplu' ELSE 'Porträt des Physiotherapeuten Furkan Toplu' END::text),true)
      WHERE collection='site_pages' AND parent_id=ANY(affected_home) AND (
        (language='en' AND COALESCE(content->>'about_image_alt','') IN ('','Portrait of a physiotherapist in a clinic')) OR
        (language='de' AND COALESCE(content->>'about_image_alt','') IN ('','Porträt eines Physiotherapeuten in einer Praxis')));
    UPDATE website_content_translations SET content=jsonb_set(content,'{image_alt}',to_jsonb(
      CASE language WHEN 'en' THEN 'Portrait of physiotherapist Furkan Toplu' ELSE 'Porträt des Physiotherapeuten Furkan Toplu' END::text),true)
      WHERE collection='site_pages' AND parent_id=ANY(affected_about) AND language IN ('en','de') AND COALESCE(content->>'image_alt','')='';
  END IF;
END;
$owner$;
COMMIT;

-- One-time CMS update; not an automatic migration.
-- Reuse the reviewed page intro only where the SEO description is empty.
BEGIN;
LOCK TABLE site_pages, website_content_translations IN SHARE ROW EXCLUSIVE MODE;

DO $update$
DECLARE
  changed integer;
BEGIN
  IF (SELECT count(*) FROM site_pages
      WHERE page_key IN ('home','areas','blog')
        AND nullif(btrim(seo_description),'') IS NULL
        AND length(btrim(content->>'hero_description')) BETWEEN 40 AND 180) <> 3
     OR (SELECT count(*) FROM website_content_translations t
         JOIN site_pages s ON s.id=t.parent_id
         WHERE t.collection='site_pages' AND s.page_key IN ('home','areas')
           AND t.language IN ('en','de') AND t.status='published'
           AND nullif(btrim(t.content->>'seo_description'),'') IS NULL
           AND length(btrim(t.content->>'hero_description')) BETWEEN 40 AND 180) <> 4
  THEN
    RAISE EXCEPTION 'Expected seven empty descriptions with valid intros; review CMS before applying';
  END IF;

  UPDATE site_pages
    SET seo_description=btrim(content->>'hero_description')
    WHERE page_key IN ('home','areas','blog')
      AND nullif(btrim(seo_description),'') IS NULL;
  GET DIAGNOSTICS changed = ROW_COUNT;
  IF changed <> 3 THEN RAISE EXCEPTION 'Unexpected Turkish row count'; END IF;

  UPDATE website_content_translations t
    SET content=t.content || jsonb_build_object('seo_description',btrim(t.content->>'hero_description')),
        updated_at=now()
    FROM site_pages s
    WHERE s.id=t.parent_id AND t.collection='site_pages'
      AND s.page_key IN ('home','areas') AND t.language IN ('en','de')
      AND t.status='published'
      AND nullif(btrim(t.content->>'seo_description'),'') IS NULL;
  GET DIAGNOSTICS changed = ROW_COUNT;
  IF changed <> 4 THEN RAISE EXCEPTION 'Unexpected translated row count'; END IF;
END
$update$;

COMMIT;

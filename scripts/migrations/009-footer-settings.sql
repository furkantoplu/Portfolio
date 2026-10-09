BEGIN;
DO $footer$
BEGIN
  IF to_regclass('public.site_pages') IS NOT NULL THEN
    INSERT INTO site_pages(page_key,content) VALUES('footer','{}'::json)
      ON CONFLICT(page_key) DO NOTHING;
  END IF;
END;
$footer$;
COMMIT;

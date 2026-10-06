-- Isolated verification: all inserted content/aliases are rolled back.
BEGIN;
DO $test$
DECLARE first_id integer; second_id integer; third_id integer; saved_slug text; old_slug text; translated_slug text;
  test_title text := 'URL Testi Postür Analizi ' || txid_current()::text;
BEGIN
  IF website_practice_title_slug('İıI ÇĞÖŞÜ café') <> 'iii-cgosu-cafe' THEN RAISE EXCEPTION 'Title normalization failed'; END IF;
  IF website_practice_title_slug('STRAẞE') <> 'strasse' THEN RAISE EXCEPTION 'German normalization failed'; END IF;
  INSERT INTO practice_areas(title, slug, summary, status) VALUES (test_title, 'must-be-ignored', 'Test only', 'draft') RETURNING id, slug INTO first_id, old_slug;
  IF old_slug <> website_practice_title_slug(test_title) THEN RAISE EXCEPTION 'Automatic initial slug failed'; END IF;
  INSERT INTO practice_areas(title, slug, summary, status) VALUES (test_title, 'must-be-ignored', 'Test only', 'draft') RETURNING id, slug INTO second_id, saved_slug;
  IF saved_slug = old_slug THEN RAISE EXCEPTION 'Duplicate titles must get different URLs'; END IF;
  UPDATE practice_areas SET title = test_title || ' Yeni' WHERE id = first_id RETURNING slug INTO saved_slug;
  IF saved_slug <> website_practice_title_slug(test_title || ' Yeni') THEN RAISE EXCEPTION 'Rename failed'; END IF;
  IF NOT EXISTS(SELECT 1 FROM website_practice_slug_aliases WHERE language = 'tr' AND slug = old_slug AND parent_id = first_id) THEN RAISE EXCEPTION 'Old URL was not retained'; END IF;
  UPDATE practice_areas SET title = test_title || ' Son' WHERE id = first_id;
  IF NOT EXISTS(SELECT 1 FROM website_practice_slug_aliases WHERE language = 'tr' AND slug = saved_slug AND parent_id = first_id) THEN RAISE EXCEPTION 'Second rename alias failed'; END IF;
  INSERT INTO practice_areas(title, slug, summary, status) VALUES (test_title, 'must-be-ignored', 'Test only', 'draft') RETURNING id, slug INTO third_id, saved_slug;
  IF saved_slug = old_slug THEN RAISE EXCEPTION 'Another area must not claim a historical URL'; END IF;
  INSERT INTO website_content_translations(collection, parent_id, language, status, slug, content)
    VALUES ('practice_areas', first_id, 'en', 'draft', 'must-be-ignored', jsonb_build_object('title', test_title || ' English')) RETURNING slug INTO translated_slug;
  IF translated_slug <> website_practice_title_slug(test_title || ' English') THEN RAISE EXCEPTION 'Translation URL failed'; END IF;
  UPDATE website_content_translations SET content = jsonb_build_object('title', test_title || ' Updated English') WHERE collection = 'practice_areas' AND parent_id = first_id AND language = 'en';
  IF NOT EXISTS(SELECT 1 FROM website_practice_slug_aliases WHERE language = 'en' AND slug = translated_slug AND parent_id = first_id) THEN RAISE EXCEPTION 'Translated old URL failed'; END IF;
  INSERT INTO website_content_translations(collection, parent_id, language, status, slug, content)
    VALUES ('blog_posts', first_id, 'en', 'draft', 'manual-blog-url-' || first_id, jsonb_build_object('title', test_title)) RETURNING slug INTO saved_slug;
  IF saved_slug <> 'manual-blog-url-' || first_id THEN RAISE EXCEPTION 'Blog URL must remain unchanged'; END IF;
END;
$test$;
ROLLBACK;

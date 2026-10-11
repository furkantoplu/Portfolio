-- Public contact details confirmed by the owner on 2026-10-11.
-- Preserve all section_visibility flags and refuse to overwrite later manual edits.
BEGIN;
DO $migration$
DECLARE
  contact_data jsonb;
  home_data jsonb;
  translated_data jsonb;
  lang text;
BEGIN
  SELECT content::jsonb INTO STRICT contact_data FROM site_pages WHERE page_key = 'contact' FOR UPDATE;
  IF (contact_data->>'phone_display', contact_data->>'email', contact_data->>'whatsapp_value', contact_data->>'address_title')
     NOT IN (
       ROW('+90 552 111111', 'furkan0220@gmail.com', '055111111', 'Kadıköy / İstanbul'),
       ROW('905111111111', 'merhaba@furkantoplu.com', '905551234567', 'Kadıköy / İstanbul'),
       ROW('+90 552 290 39 02', 'toplu.furkan0220@gmail.com', '+905522903902', 'Uzaktan iletişim')
     ) THEN
    RAISE EXCEPTION 'Contact content has changed; inspect before updating';
  END IF;
  UPDATE site_pages SET content = (content::jsonb || jsonb_build_object(
    'phone_display', '+90 552 290 39 02',
    'phone_value', '+905522903902',
    'whatsapp_value', '+905522903902',
    'email', 'toplu.furkan0220@gmail.com',
    'address_title', 'Uzaktan iletişim',
    'address_note', 'Fiziksel klinik adresi bulunmuyor; iletişim uzaktan yürütülür.'
  ))::json WHERE page_key = 'contact';

  SELECT content::jsonb INTO STRICT home_data FROM site_pages WHERE page_key = 'home' FOR UPDATE;
  IF (home_data->>'location', home_data->>'location_note')
     NOT IN (ROW('İstanbul', 'Yüz yüze görüşme'), ROW('Uzaktan', 'Çevrim içi iletişim')) THEN
    RAISE EXCEPTION 'Home location has changed; inspect before updating';
  END IF;
  UPDATE site_pages SET content = (content::jsonb || jsonb_build_object(
    'location', 'Uzaktan', 'location_note', 'Çevrim içi iletişim'
  ))::json WHERE page_key = 'home';

  FOR lang IN SELECT unnest(ARRAY['en', 'de']) LOOP
    SELECT t.content INTO STRICT translated_data FROM website_content_translations t
      JOIN site_pages p ON p.id = t.parent_id
      WHERE t.collection = 'site_pages' AND p.page_key = 'home' AND t.language = lang AND t.status = 'published' FOR UPDATE;
    IF lang = 'en' AND (translated_data->>'location', translated_data->>'location_note')
       NOT IN (ROW('Istanbul', 'In-person appointments'), ROW('Remote', 'Online contact')) THEN
      RAISE EXCEPTION 'English home location has changed; inspect before updating';
    END IF;
    IF lang = 'de' AND (translated_data->>'location', translated_data->>'location_note')
       NOT IN (ROW('Istanbul', 'Persönliche Termine'), ROW('Aus der Ferne', 'Online-Kontakt')) THEN
      RAISE EXCEPTION 'German home location has changed; inspect before updating';
    END IF;
    UPDATE website_content_translations t SET content = t.content || CASE lang
      WHEN 'en' THEN jsonb_build_object('location', 'Remote', 'location_note', 'Online contact')
      ELSE jsonb_build_object('location', 'Aus der Ferne', 'location_note', 'Online-Kontakt') END
      FROM site_pages p WHERE p.id = t.parent_id AND p.page_key = 'home'
        AND t.collection = 'site_pages' AND t.language = lang AND t.status = 'published';

    SELECT t.content INTO STRICT translated_data FROM website_content_translations t
      JOIN site_pages p ON p.id = t.parent_id
      WHERE t.collection = 'site_pages' AND p.page_key = 'contact' AND t.language = lang AND t.status = 'published' FOR UPDATE;
    IF lang = 'en' AND translated_data->>'address_note'
       NOT IN ('The full address is shared after arranging an appointment.', 'There is no public clinic address; contact is handled remotely.') THEN
      RAISE EXCEPTION 'English contact address has changed; inspect before updating';
    END IF;
    IF lang = 'de' AND translated_data->>'address_note'
       NOT IN ('Die vollständige Adresse erhalten Sie nach der Terminvereinbarung.', 'Es gibt keine öffentlich zugängliche Praxisadresse; der Kontakt erfolgt aus der Ferne.') THEN
      RAISE EXCEPTION 'German contact address has changed; inspect before updating';
    END IF;
    UPDATE website_content_translations t SET content = t.content || CASE lang
      WHEN 'en' THEN jsonb_build_object('address_note', 'There is no public clinic address; contact is handled remotely.')
      ELSE jsonb_build_object('address_note', 'Es gibt keine öffentlich zugängliche Praxisadresse; der Kontakt erfolgt aus der Ferne.') END
      FROM site_pages p WHERE p.id = t.parent_id AND p.page_key = 'contact'
        AND t.collection = 'site_pages' AND t.language = lang AND t.status = 'published';
  END LOOP;
END;
$migration$;
COMMIT;

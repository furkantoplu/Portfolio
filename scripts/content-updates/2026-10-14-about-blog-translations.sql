-- One-time, guarded CMS content update. Run with psql -v ON_ERROR_STOP=1.
-- Keep this out of automatic migrations: future admin edits must win.
BEGIN;

LOCK TABLE site_pages, blog_posts, website_content_translations IN SHARE ROW EXCLUSIVE MODE;

DO $guard$
BEGIN
  IF (SELECT count(*) FROM site_pages WHERE id IN (1, 5) AND page_key IN ('about', 'blog')) <> 2
     OR (SELECT md5(content->>'hero_description') FROM site_pages WHERE id=1 AND page_key='about') <> 'e59514bdc13248fccecbbd1e330b0c3a'
     OR (SELECT md5(content->>'hero_description') FROM website_content_translations WHERE collection='site_pages' AND parent_id=1 AND language='en' AND status='published') <> '8ab7028def6bdd4c2108136aa1ec19af'
     OR (SELECT md5(content->>'hero_description') FROM website_content_translations WHERE collection='site_pages' AND parent_id=1 AND language='de' AND status='published') <> '49678650a91964f31f5ee749ebb189b5'
     OR (SELECT count(*) FROM website_content_translations WHERE collection='site_pages' AND parent_id=5 AND language IN ('en','de') AND status='published') <> 2
     OR (SELECT md5(title || '|' || status || '|' || summary) FROM blog_posts WHERE id=1) <> 'b4889087a11a1a3b0138255cdfddd88a'
     OR (SELECT md5(title || '|' || status || '|' || summary) FROM blog_posts WHERE id=2) <> 'd862a81a8f27101c68db77d00770c1c6'
     OR (SELECT md5(title || '|' || status || '|' || summary) FROM blog_posts WHERE id=3) <> '007b558c2adfe8214e7e5b6c7e019867'
     OR EXISTS (SELECT 1 FROM website_content_translations WHERE collection='blog_posts' AND parent_id IN (1,2,3))
  THEN RAISE EXCEPTION 'CMS content changed since translation review; nothing was written';
  END IF;
END
$guard$;

UPDATE website_content_translations
SET content = content || jsonb_build_object(
  'hero_description', $en$I completed primary and middle school in Kahta, Adıyaman, and high school in Denizli. I am currently continuing my undergraduate studies at Muğla Sıtkı Koçman University.
I created this website to share my professional vision, discuss current developments in physiotherapy, and build a lasting source of motivation as I work towards my goals. I am preparing for my future professional work with an approach to physiotherapy that makes information easier to understand, puts open communication first, and is grounded in scientific evidence.$en$,
  'seo_description', $en$Learn about Furkan Toplu's physiotherapy studies, professional vision and evidence-informed approach to movement.$en$
), updated_at = now()
WHERE collection='site_pages' AND parent_id=1 AND language='en';

UPDATE website_content_translations
SET content = content || jsonb_build_object(
  'hero_description', $de$Meine Grund- und Mittelschulzeit verbrachte ich in Kahta (Adıyaman), das Gymnasium schloss ich in Denizli ab. Derzeit absolviere ich mein Bachelorstudium an der Muğla Sıtkı Koçman Üniversitesi.
Diese Website habe ich ins Leben gerufen, um meine berufliche Vision zu teilen, über aktuelle Entwicklungen in der Physiotherapie zu informieren und mich auf dem Weg zu meinen Zielen dauerhaft zu motivieren. Ich bereite mich auf meine künftige berufliche Tätigkeit mit einem Verständnis von Physiotherapie vor, das Wissen verständlich macht, transparente Kommunikation in den Mittelpunkt stellt und auf wissenschaftlichen Grundlagen beruht.$de$,
  'seo_description', $de$Erfahren Sie mehr über Furkan Toplus Physiotherapiestudium, seine beruflichen Ziele und seinen wissenschaftlich fundierten Blick auf Bewegung.$de$
), updated_at = now()
WHERE collection='site_pages' AND parent_id=1 AND language='de';

UPDATE website_content_translations
SET content = content || jsonb_build_object(
  'hero_description', $en$We explore topics that support healthy movement in everyday life in clear language, without unnecessary jargon.$en$,
  'archive_intro', $en$This section will grow as new articles are published.$en$,
  'seo_description', $en$Clear, practical articles about movement and physiotherapy by Furkan Toplu.$en$
), updated_at = now()
WHERE collection='site_pages' AND parent_id=5 AND language='en';

UPDATE website_content_translations
SET content = content || jsonb_build_object(
  'hero_description', $de$Wir behandeln Themen rund um gesunde Bewegung im Alltag in verständlicher Sprache – ohne unnötige Fachbegriffe.$de$,
  'archive_intro', $de$Dieser Bereich wächst, sobald neue Beiträge veröffentlicht werden.$de$,
  'seo_description', $de$Verständliche Beiträge zu Bewegung und Physiotherapie von Furkan Toplu.$de$
), updated_at = now()
WHERE collection='site_pages' AND parent_id=5 AND language='de';

INSERT INTO website_content_translations (collection, parent_id, language, status, slug, content)
VALUES
('blog_posts', 1, 'en', 'published', 'movement-breaks-desk-work', jsonb_build_object(
  'title', $t$Why are movement breaks important on desk-based days?$t$,
  'category', $t$Everyday life$t$,
  'summary', $t$A short guide to adding small, sustainable movement breaks to your day instead of staying in the same position for long periods.$t$,
  'cover_alt', $t$Furkan Toplu in a clinical setting$t$,
  'cover_caption', $t$Bringing movement into your day in small steps$t$,
  'lead', $t$Our bodies are made to move between different positions throughout the day rather than remain in one position.$t$,
  'body_paragraphs', jsonb_build_array(
    jsonb_build_object('text', $t$When working at a desk, we can remain in the same position without noticing how much time has passed. The aim is not to find a “perfect” sitting posture, but to change position from time to time and create small opportunities to move throughout the day.$t$),
    jsonb_build_object('text', $t$A movement break does not have to be a long workout. Standing up, taking a few steps or changing your working position can be a starting point for breaking up the monotony of the day.$t$)
  ),
  'quote', $t$The best movement break is one you can sustain within your daily routine.$t$,
  'tips_title', $t$How can you plan movement breaks?$t$,
  'tips', jsonb_build_array(
    jsonb_build_object('title', $t$Set a simple reminder$t$, 'text', $t$A simple alarm that reminds you to stand up at intervals during the day can make it easier to remember to move.$t$),
    jsonb_build_object('title', $t$Start small$t$, 'text', $t$Instead of a long workout, a few minutes of walking or a change of position may make the habit easier to maintain.$t$),
    jsonb_build_object('title', $t$Link it to your routine$t$, 'text', $t$Getting water, taking a phone call or going on a lunch break can be natural cues to move.$t$)
  ),
  'closing_title', $t$Everyone's needs are different.$t$,
  'closing_body', $t$If movement causes significant discomfort, a limitation affects your daily life, or a complaint persists, an individual assessment is more appropriate than general suggestions. If you have an existing health condition, follow the guidance of your doctor or another relevant healthcare professional.$t$,
  'seo_title', $t$Movement Breaks at Your Desk | Furkan Toplu$t$,
  'seo_description', $t$A short guide to adding small, sustainable movement breaks to desk-based days.$t$
)),
('blog_posts', 1, 'de', 'published', 'bewegungspausen-schreibtisch', jsonb_build_object(
  'title', $t$Warum sind Bewegungspausen an langen Schreibtischtagen wichtig?$t$,
  'category', $t$Alltag$t$,
  'summary', $t$Ein kurzer Leitfaden, wie sich kleine, alltagstaugliche Bewegungspausen einbauen lassen, statt lange in derselben Position zu bleiben.$t$,
  'cover_alt', $t$Furkan Toplu in einer Praxis$t$,
  'cover_caption', $t$Bewegung in kleinen Schritten in den Alltag integrieren$t$,
  'lead', $t$Unser Körper ist darauf ausgelegt, im Laufe des Tages zwischen verschiedenen Bewegungen und Positionen zu wechseln, statt ständig in derselben Haltung zu bleiben.$t$,
  'body_paragraphs', jsonb_build_array(
    jsonb_build_object('text', $t$Bei der Arbeit am Schreibtisch bleiben wir manchmal in derselben Position, ohne zu bemerken, wie viel Zeit vergangen ist. Es geht nicht darum, die „perfekte“ Sitzhaltung zu finden, sondern die Position gelegentlich zu wechseln und kleine Bewegungsmöglichkeiten in den Tag einzubauen.$t$),
    jsonb_build_object('text', $t$Eine Bewegungspause muss kein langes Training sein. Aufstehen, ein paar Schritte gehen oder die Arbeitsposition verändern kann bereits ein Anfang sein, um den Tag abwechslungsreicher zu gestalten.$t$)
  ),
  'quote', $t$Die beste Bewegungspause ist die, die sich dauerhaft in den Alltag einbauen lässt.$t$,
  'tips_title', $t$Wie lassen sich Bewegungspausen planen?$t$,
  'tips', jsonb_build_array(
    jsonb_build_object('title', $t$Eine einfache Erinnerung einstellen$t$, 'text', $t$Ein schlichter Alarm, der Sie tagsüber in bestimmten Abständen ans Aufstehen erinnert, kann helfen, Bewegung nicht zu vergessen.$t$),
    jsonb_build_object('title', $t$Klein anfangen$t$, 'text', $t$Statt eines langen Trainings können ein paar Minuten Gehen oder ein Positionswechsel die Gewohnheit leichter durchführbar machen.$t$),
    jsonb_build_object('title', $t$Mit dem Tagesablauf verbinden$t$, 'text', $t$Wasser holen, ein Telefonat führen oder in die Mittagspause gehen können natürliche Anlässe für Bewegung sein.$t$)
  ),
  'closing_title', $t$Jeder Mensch hat andere Bedürfnisse.$t$,
  'closing_body', $t$Wenn Bewegung deutliche Beschwerden auslöst, Einschränkungen den Alltag beeinträchtigen oder Beschwerden anhalten, ist statt allgemeiner Tipps eine individuelle Beurteilung sinnvoll. Bei bestehenden Erkrankungen ist die Empfehlung Ihrer Ärztin, Ihres Arztes oder einer anderen zuständigen medizinischen Fachperson maßgeblich.$t$,
  'seo_title', $t$Bewegungspausen am Schreibtisch | Furkan Toplu$t$,
  'seo_description', $t$Ein kurzer Leitfaden für kleine, alltagstaugliche Bewegungspausen bei der Arbeit am Schreibtisch.$t$
)),
('blog_posts', 2, 'en', 'published', 'three-steps-exercise-routine', jsonb_build_object(
  'title', $t$Three small steps to help you stick with exercise$t$,
  'category', $t$Movement insights$t$,
  'summary', $t$Practical ideas for maintaining a movement routine with realistic goals, even on busy days.$t$,
  'seo_title', $t$Building an Exercise Routine | Furkan Toplu$t$,
  'seo_description', $t$Three small steps that can help you maintain a movement routine with realistic goals.$t$
)),
('blog_posts', 2, 'de', 'published', 'drei-schritte-bewegungsroutine', jsonb_build_object(
  'title', $t$Drei kleine Schritte, um beim Training dranzubleiben$t$,
  'category', $t$Wissen rund um Bewegung$t$,
  'summary', $t$Praktische Anregungen, um Bewegungsgewohnheiten auch an vollen Tagen mit realistischen Zielen beizubehalten.$t$,
  'seo_title', $t$Eine Bewegungsroutine aufbauen | Furkan Toplu$t$,
  'seo_description', $t$Drei kleine Schritte, die helfen können, mit realistischen Zielen in Bewegung zu bleiben.$t$
)),
('blog_posts', 3, 'en', 'draft', 'first-physiotherapy-appointment', jsonb_build_object(
  'title', $t$What can you expect at your first physiotherapy appointment?$t$,
  'category', $t$Your care journey$t$,
  'summary', $t$A clear overview of common questions before an initial assessment and the general flow of the appointment.$t$,
  'seo_title', $t$Your First Physiotherapy Appointment | Furkan Toplu$t$,
  'seo_description', $t$What to expect before and during an initial physiotherapy assessment.$t$
)),
('blog_posts', 3, 'de', 'draft', 'erster-physiotherapie-termin', jsonb_build_object(
  'title', $t$Was erwartet Sie beim ersten Physiotherapie-Termin?$t$,
  'category', $t$Wegweiser für Ihren Termin$t$,
  'summary', $t$Ein verständlicher Überblick über häufige Fragen vor der ersten Untersuchung und den allgemeinen Ablauf des Termins.$t$,
  'seo_title', $t$Ihr erster Physiotherapie-Termin | Furkan Toplu$t$,
  'seo_description', $t$Was Sie vor und während einer ersten physiotherapeutischen Untersuchung erwartet.$t$
));

DO $verify$
BEGIN
  IF (SELECT count(*) FROM website_content_translations WHERE collection='blog_posts' AND parent_id IN (1,2,3)) <> 6
     OR (SELECT count(*) FROM website_content_translations WHERE collection='blog_posts' AND parent_id IN (1,2) AND status='published') <> 4
     OR (SELECT count(*) FROM website_content_translations WHERE collection='blog_posts' AND parent_id=3 AND status='draft') <> 2
  THEN RAISE EXCEPTION 'Translation counts/statuses did not match; rolling back';
  END IF;
END
$verify$;

COMMIT;

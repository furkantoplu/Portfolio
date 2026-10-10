SET timezone='UTC';
SELECT jsonb_object_agg(name,jsonb_build_object('count',n,'hash',h)) FROM (
 SELECT 'users' name,count(*) n,md5(coalesce(string_agg(to_jsonb(t)::text,E'\n' ORDER BY to_jsonb(t)::text),'')) h FROM directus_users t
 UNION ALL SELECT 'roles',count(*),md5(coalesce(string_agg(to_jsonb(t)::text,E'\n' ORDER BY to_jsonb(t)::text),'')) FROM directus_roles t
 UNION ALL SELECT 'policies',count(*),md5(coalesce(string_agg(to_jsonb(t)::text,E'\n' ORDER BY to_jsonb(t)::text),'')) FROM directus_policies t
 UNION ALL SELECT 'access',count(*),md5(coalesce(string_agg(to_jsonb(t)::text,E'\n' ORDER BY to_jsonb(t)::text),'')) FROM directus_access t
 UNION ALL SELECT 'permissions',count(*),md5(coalesce(string_agg(to_jsonb(t)::text,E'\n' ORDER BY to_jsonb(t)::text),'')) FROM directus_permissions t
 UNION ALL SELECT 'settings',count(*),md5(coalesce(string_agg(to_jsonb(t)::text,E'\n' ORDER BY to_jsonb(t)::text),'')) FROM directus_settings t
 UNION ALL SELECT 'areas',count(*),md5(coalesce(string_agg(to_jsonb(t)::text,E'\n' ORDER BY to_jsonb(t)::text),'')) FROM practice_areas t
 UNION ALL SELECT 'blog',count(*),md5(coalesce(string_agg(to_jsonb(t)::text,E'\n' ORDER BY to_jsonb(t)::text),'')) FROM blog_posts t
 UNION ALL SELECT 'pages',count(*),md5(coalesce(string_agg(to_jsonb(t)::text,E'\n' ORDER BY to_jsonb(t)::text),'')) FROM site_pages t
 UNION ALL SELECT 'translations',count(*),md5(coalesce(string_agg(to_jsonb(t)::text,E'\n' ORDER BY to_jsonb(t)::text),'')) FROM website_content_translations t
 UNION ALL SELECT 'aliases',count(*),md5(coalesce(string_agg(to_jsonb(t)::text,E'\n' ORDER BY to_jsonb(t)::text),'')) FROM website_practice_slug_aliases t
 UNION ALL SELECT 'media',count(*),md5(coalesce(string_agg(to_jsonb(t)::text,E'\n' ORDER BY to_jsonb(t)::text),'')) FROM website_media_assets t
 UNION ALL SELECT 'imports',count(*),md5(coalesce(string_agg(to_jsonb(t)::text,E'\n' ORDER BY to_jsonb(t)::text),'')) FROM website_content_imports t
 UNION ALL SELECT 'files',count(*),md5(coalesce(string_agg(to_jsonb(t)::text,E'\n' ORDER BY to_jsonb(t)::text),'')) FROM directus_files t
) snapshot;

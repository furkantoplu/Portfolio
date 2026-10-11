BEGIN;
-- Non-secret version: prevents old/password-only JWTs from acquiring privileges after setup/reset.
ALTER TABLE directus_users ADD COLUMN IF NOT EXISTS website_tfa_epoch uuid NOT NULL DEFAULT gen_random_uuid();
CREATE OR REPLACE FUNCTION website_rotate_tfa_epoch() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.tfa_secret IS DISTINCT FROM OLD.tfa_secret
     OR NEW.website_tfa_epoch IS DISTINCT FROM OLD.website_tfa_epoch THEN
    -- A supplied epoch can never roll back to an older token's version.
    NEW.website_tfa_epoch := gen_random_uuid();
    NEW.token := NULL;
    DELETE FROM directus_sessions WHERE "user" = OLD.id;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS website_rotate_tfa_epoch ON directus_users;
CREATE TRIGGER website_rotate_tfa_epoch BEFORE UPDATE OF tfa_secret, website_tfa_epoch
ON directus_users FOR EACH ROW EXECUTE FUNCTION website_rotate_tfa_epoch();
-- Native Studio/login hint too; server-side hook is the actual enforcement boundary.
UPDATE directus_policies SET enforce_tfa = true WHERE admin_access AND NOT enforce_tfa;
COMMIT;

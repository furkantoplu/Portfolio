-- Repair only the known double-escaped default; preserve custom policies.
BEGIN;
UPDATE directus_settings SET auth_password_policy = $fixed$^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,}$$fixed$
WHERE auth_password_policy = $old$^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{10,}$$old$;
COMMIT;

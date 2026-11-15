-- Apply before deploying the remembered-device release. Additive and safe to rerun.
BEGIN;
CREATE TABLE IF NOT EXISTS admin_device_session (
    token_hash varchar(64) PRIMARY KEY,
    username varchar(255) NOT NULL,
    credential_fingerprint varchar(64) NOT NULL,
    expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS admin_device_session_username ON admin_device_session(username);
COMMIT;

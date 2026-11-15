-- Apply before deploying this release. Existing pause state is preserved on reruns.
BEGIN;
CREATE TABLE IF NOT EXISTS store_ordering_settings (
    id bigint PRIMARY KEY,
    enabled boolean NOT NULL DEFAULT true
);
INSERT INTO store_ordering_settings (id, enabled) VALUES (1, true) ON CONFLICT (id) DO NOTHING;
COMMIT;

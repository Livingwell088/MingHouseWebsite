-- Apply to a backed-up PostgreSQL database during release, before starting this branch.
-- Additive and safe to re-run, including after the context-test startup noted in the release guide.
BEGIN;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS request_key varchar(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax numeric(38,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee numeric(38,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total numeric(38,2);
CREATE UNIQUE INDEX IF NOT EXISTS orders_submission_key_unique ON orders(request_key);
ALTER TABLE orders ALTER COLUMN address TYPE varchar(500);
ALTER TABLE orders ALTER COLUMN special_instructions TYPE varchar(2000);
ALTER TABLE cart_item ALTER COLUMN special_instruction TYPE varchar(2000);
CREATE SEQUENCE IF NOT EXISTS mail_outbox_seq START WITH 1 INCREMENT BY 50;
CREATE TABLE IF NOT EXISTS mail_outbox (
    id bigint PRIMARY KEY,
    order_id bigint,
    recipient varchar(255),
    subject varchar(255),
    body text,
    audience varchar(255),
    attempts integer NOT NULL DEFAULT 0,
    next_attempt timestamptz,
    sent_at timestamptz,
    last_error varchar(255)
);
CREATE INDEX IF NOT EXISTS mail_outbox_due ON mail_outbox(next_attempt) WHERE sent_at IS NULL;
COMMIT;

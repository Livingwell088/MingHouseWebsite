-- Archive only inactive lunch copies that have exactly one active counterpart.
-- Retain IDs and foreign keys for historical orders and existing carts.
-- No prices, active availability choices, or legitimate protein variants change.
BEGIN;
ALTER TABLE menu ADD COLUMN IF NOT EXISTS archived boolean NOT NULL DEFAULT false;
UPDATE menu duplicate
SET archived = true
WHERE duplicate.category = 'Lunch Special'
  AND duplicate.available = false
  AND duplicate.archived = false
  AND 1 = (
    SELECT count(*) FROM menu current
    WHERE current.id <> duplicate.id
      AND current.category = duplicate.category
      AND current.number = duplicate.number
      AND current.name = duplicate.name
      AND coalesce(current.size, '') = coalesce(duplicate.size, '')
      AND current.price = duplicate.price
      AND current.available = true
      AND current.archived = false
  );
COMMIT;

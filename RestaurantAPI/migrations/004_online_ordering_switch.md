Online ordering pause switch
===========================

Apply `004_online_ordering_switch.sql` to the backed-up production database before deploying this release. The application validates the schema at startup. This additive migration creates one settings row with ordering enabled; rerunning it does not overwrite an existing pause. No production database changes have been made during development.

The control appears above every admin screen. Pause affects both pickup and delivery. It remains in effect until an administrator turns ordering on again, including across application restarts. The menu and cart stay available; the menu and checkout show a call-the-restaurant notice. Customer pages check status on load, on focus, and every 30 seconds while active. The server checks every new order regardless of what an older page shows.

Accepted orders remain available, and retrying a submission that was already saved still returns that same order while paused. Rejected new submissions leave the cart intact and create no order or email-outbox records. An order already being accepted finishes before the pause request returns; the shared database lock then blocks all subsequent new orders until resumed.

Before production: run the migration in staging, verify schema validation, pause from admin, attempt pickup and delivery from an already-open checkout, confirm the menu remains accessible, restart the backend and confirm the pause persists, then resume ordering. Tests use isolated H2 and disable email delivery.

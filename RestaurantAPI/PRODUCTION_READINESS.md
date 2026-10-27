# Production readiness work

Branch: `codex/production-readiness`. Do not deploy as a complete security fix yet.

## First pass: admin access and response privacy

- Server-enforced admin authentication using Spring Security and BCrypt.
- Protect menu writes, admin order/user/cart lists, status changes, and deletes.
- Require an explicit `X-Admin-Request: true` header for admin mutations.
- Restrict CORS to the restaurant domains and localhost development.
- Remove browser-only admin login and never persist admin credentials in browser storage.
- Exclude customer passwords from JSON responses and `toString()` output.

Before using this branch, configure `RESTAURANT_ADMIN_PASSWORD_HASH` with a BCrypt
hash and optionally `RESTAURANT_ADMIN_USERNAME` (default `admin`). Without a hash,
admin authentication is disabled. Set the property `restaurant.admin.password-hash`
explicitly if your environment does not map the variable. Production must use HTTPS.
The admin logs in again after a browser reload; credentials exist only in memory.
For local frontend testing set `REACT_APP_API_URL=http://localhost:8080` and restart
the dev server. The frontend and backend must be released together.

## Still required before calling this production-ready

1. Server-issued customer/guest identity, ownership checks for individual user,
   cart, and order routes, and hashed customer-password storage/migration.
2. Validate cart items, quantities, availability, and prices against database menu
   records. Recalculate order totals on the server with decimal arithmetic.
3. Transactional order creation/cart updates, idempotent submission, and safe
   handling of simultaneous orders.
4. Durable email outbox with retry, visible staff failure status, and notifications
   dispatched only after the order transaction commits.
5. Move existing database/SMTP secrets out of tracked configuration, rotate exposed
   credentials, and review backups, request limits, and production logging.

The first pass deliberately retains the existing guest flow. Knowing a customer
or cart identifier must not remain sufficient authorization in the final design.
Tests in this branch must use mocks or isolated test databases; do not use the live
restaurant database or send real emails for automated checks.

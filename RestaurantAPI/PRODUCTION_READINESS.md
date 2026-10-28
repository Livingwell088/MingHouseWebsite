# Production readiness review

Work is on `codex/production-readiness`. Review this branch before releasing it. The frontend and backend must be deployed together.

## Implemented

- Server-enforced admin authentication, BCrypt passwords, and protected admin operations. Admin credentials stay in browser memory and clear on reload/logout.
- Signed customer and guest credentials with a 12-hour lifetime. A cart ID or username alone cannot authorize access. Guest-to-account cart transfers require both credentials.
- Ownership checks for customer contact information, carts, order history, and submission lookup. Passwords are excluded from JSON responses.
- BCrypt for new accounts, automatic migration after a successful legacy login, and an optional bulk migration at release.
- Menu prices and availability checked on the server, quantity limits, and decimal arithmetic for tax and final totals. Checkout rejects stale cart contents/prices and reloads them for review.
- Cart edits and order creation use transactions and cart row locks. Submission references prevent duplicate orders from retries or simultaneous requests. Failure to persist the email queue rolls back the order and cart together.
- Restaurant and customer emails are saved to a durable outbox in the order transaction. A worker sends committed messages, retries failures up to eight times, and resumes after a restart. Staff can see failures and retry them in Admin > Orders; the page refreshes every 30 seconds.
- Checkout disables repeated clicks and retains its submission reference after a connection failure. Customers can check whether that submission was saved before trying again.
- Request size limits, basic per-instance signup/login/guest creation rate limits, restricted CORS, bounded SMTP timeouts, and safe error messages/logging.
- Database and SMTP credentials removed from tracked source configuration. Local settings are preserved in ignored `RestaurantAPI/application-local.properties`. Generated backend files are no longer tracked.

## Review locally

The local frontend defaults to `http://localhost:8080`; production defaults to the existing Render API URL. `REACT_APP_API_URL` overrides either. The API requires a signed credential, so old unsigned local carts are replaced with a new guest session.

Automated tests explicitly use H2 and mock email; they do not need production credentials. Use JDK 17 or newer:

```powershell
cd RestaurantAPI
mvn -Drestaurant.build.directory=target-readiness test
cd ../Front
$env:CI='true'
npm test -- --watchAll=false --runInBand
$env:CI='false'
npm run build
```

The separate Maven build directory avoids OneDrive locks on the existing target folder. The React build retains warnings from the existing codebase; framework/toolchain modernization is a separate change.

Verification: 24 backend tests and 7 frontend tests passed, including HTTP guest checkout, simultaneous retries, transaction rollback, ownership rejection, password migration, queued email retries, double-click protection, and lost-response recovery. The frontend production build passed with existing lint/toolchain warnings. A local API preview runs on port 8080 with an in-memory H2 database and email delivery disabled.

## Release steps

1. Take a PostgreSQL backup and verify it restores into a separate database. Rehearse the migration and a guest/account checkout against that restored PostgreSQL database. H2 tests do not establish PostgreSQL migration compatibility.
2. Replace the database password and SMTP app password that existed in tracked configuration and Git history. Removing them from the current tree does not revoke the old values. Update the currently deployed backend's environment at the same time so credential rotation does not interrupt it.
3. Configure Render using the variable names in `.env.example`. Set `SPRING_PROFILES_ACTIVE=production`, a stable random `CUSTOMER_SIGNING_SECRET` of at least 32 characters, and `ADMIN_PASSWORD_HASH` containing a BCrypt hash. Do not store plaintext admin passwords in the environment. The production profile refuses to start without the signing secret and hash.
4. Apply `migrations/001_production_readiness.sql`. It adds nullable fields for existing orders, an idempotency index and outbox storage, and widens instruction fields. Existing orders retain their original amounts and are not emailed again. The normal application uses schema validation rather than automatic schema changes.
5. For bulk password migration, temporarily set `RESTAURANT_SECURITY_MIGRATE_PASSWORDS=true` for one controlled startup, verify the migration count, and remove it. The migration skips guests and already-hashed values and rolls back if a legacy password exceeds BCrypt's 72-byte limit. Resolve such an account through a password reset before retrying. Legacy passwords also upgrade individually on a valid login.
6. Release the backend and frontend together during a short ordering maintenance window. Existing unsigned browser sessions cannot carry over; customers need a fresh guest cart or another login. Set the backend health check to `/health`.
7. Verify admin sign-in/menu editing, guest and account ordering, totals, customer receipt, restaurant ticket, and outbox status using an explicitly labeled test order. Arrange any real test email recipients before sending.
8. Confirm backup retention/restore access and who checks Admin > Orders if the restaurant mailbox or SMTP provider fails. The email worker requires a running backend; sleeping hosting delays notifications until it wakes.

## Known operational limits

- SMTP provides at-least-once delivery: a crash after the provider accepts a message but before its database commit can cause a repeated email. The stable order number identifies that repeat; it does not create another order.
- Rate limits are per application instance and use the direct connection address. At this restaurant's expected volume this is a basic safeguard; shared proxy addresses can share a bucket. A multi-instance or high-volume rollout needs shared rate limiting and a trusted proxy policy.
- Existing historical orders still reference menu/customer records, so later edits can change their displayed labels/contact details. New queued emails retain the exact ticket rendered when the order was placed.
- Credential rotation, the backup restore check, a PostgreSQL migration rehearsal, and production email delivery must be completed during release. They have not been claimed as completed by local tests.

## Unintended test startup on October 28, 2026

An existing `RestaurantApplicationTests.contextLoads` test inherited the local production database configuration before a global test-only configuration was added. Hibernate's existing `ddl-auto=update` setting caused additive schema changes (including the order submission column and outbox table). A subsequent read-only check found the submission column present and **zero outbox rows**. This context test did not place an order or enqueue email. The additive schema was left in place; no destructive rollback was attempted. The migration is re-runnable over it. All test contexts now explicitly use H2, and the email worker is disabled in tests.

Remembered admin devices
=======================

Before deploying this release, apply `003_admin_remembered_devices.sql` to the backed-up production database. The application uses schema validation and will refuse to start without the new table. No production migration has been run as part of local development.

The login checkbox issues a random 256-bit token with a fixed 30-day expiry. Only its SHA-256 digest is stored in the database. The browser keeps the token in local storage and sends it through an explicit request header over HTTPS; the password is never persisted. Browser data clearing removes the remembered login. Use only on trusted personal or restaurant devices.

Log out revokes the current token. Sign out all remembered devices revokes every token for the configured admin, including the current device. Other open pages lose access on their next request. Password or admin username changes also invalidate existing tokens. Ordinary unchecked logins remain memory-only and end on reload. Basic logins already open elsewhere are unaffected by revoking device tokens.

Verification before production: apply the migration to a staging database with `ddl-auto=validate`; remember a device, reload and reopen the browser, verify logout, verify all-device revocation from a second browser, and verify normal unchecked login ends on reload. Automated backend tests use isolated H2 only and email delivery is disabled.

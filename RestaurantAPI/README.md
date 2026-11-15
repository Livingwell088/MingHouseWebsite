# RestaurantAPI


clear  
mvn clean install -DskipTests  
docker build -t ming-house-backend .  
docker run -p 8080:8080 ming-house-backend

## Order email notifications

Orders send separate HTML emails to the restaurant and the customer's checkout
email address after the order has been saved. Restaurant subjects start with
`NEW PICKUP ORDER` or `NEW DELIVERY ORDER`; customer receipts acknowledge receipt
and provide the restaurant phone number for questions.

The existing restaurant recipient remains `Livingwell088@gmail.com`. Override it
with the `RESTAURANT_ORDERS_EMAIL` environment variable (Spring property
`restaurant.orders.email`). Existing SMTP configuration is still required.
Deploy both the frontend and backend for the complete change. No real emails
are sent by `OrderNotificationServiceTest`; its mail service is mocked.

Saved orders queue restaurant and customer messages in the durable email outbox.
The background worker retries delivery failures; staff can inspect delivery status
and retry a message in admin. Email failure does not cancel a saved order.

The admin website also provides an independent repeating order bell. Staff must
enable sound on their receiving device and keep the admin page open and awake.
See `../Front/ADMIN-ORDER-ALERTS.md` for setup and browser limitations.

Before deploying the pending admin release, apply migrations
`003_admin_remembered_devices.sql` and `004_online_ordering_switch.sql` to a
backed-up database. These add remembered-device sessions and the persistent
online-ordering switch without altering existing orders or menu prices.

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

Email failures are logged; they do not cancel a saved order, and there is no
automatic retry. Staff should keep the restaurant inbox monitored. To distinguish
orders, create a mail filter for subjects starting with `NEW PICKUP ORDER` or
`NEW DELIVERY ORDER` and enable notifications on the counter device. Notification
sounds are configured in the mail app/device, not by the website.

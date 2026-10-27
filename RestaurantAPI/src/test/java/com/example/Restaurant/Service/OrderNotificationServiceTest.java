package com.example.Restaurant.Service;

import com.example.Restaurant.model.Orders;
import com.example.Restaurant.model.StoreUser;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class OrderNotificationServiceTest {
    private final EmailService mail = mock(EmailService.class);
    private final OrderNotificationService notifications = new OrderNotificationService(mail, "restaurant@example.com");

    private Orders order(String type) {
        Orders order = new Orders();
        StoreUser user = new StoreUser();
        user.setFirstName("Pat");
        user.setEmail("customer@example.com");
        order.setUser(user);
        order.setOrderName("123");
        order.setOrderType(type);
        order.setOrderTime("6:30 PM");
        order.setOrderPrice(10);
        order.setPhoneNumber("555-0100");
        order.setItems(List.of());
        return order;
    }

    @Test void sendsSeparateRestaurantAndCustomerMessages() {
        notifications.sendOrderEmails(order("Pickup"));
        verify(mail).sendEmail(eq("restaurant@example.com"), eq("NEW PICKUP ORDER #123 - 6:30 PM"), contains("An order has been received"));
        verify(mail).sendEmail(eq("customer@example.com"), eq("Ming House: order #123 received"), contains("Thank you for ordering"));
    }

    @Test void restaurantFailureDoesNotPreventCustomerCopyOrFailSavedOrder() {
        doThrow(new RuntimeException("SMTP unavailable")).when(mail).sendEmail(eq("restaurant@example.com"), anyString(), anyString());
        assertDoesNotThrow(() -> notifications.sendOrderEmails(order("Pickup")));
        verify(mail).sendEmail(eq("customer@example.com"), anyString(), anyString());
    }

    @Test void formatsTotalsAndOnlyChargesDeliveryForDeliveryOrders() {
        String pickup = OrderNotificationService.buildTicket(order("Pickup"));
        String delivery = OrderNotificationService.buildTicket(order("Delivery"));
        assertFalse(pickup.contains("Delivery fee"));
        assertTrue(pickup.contains("$10.70"));
        assertTrue(delivery.contains("$2.00"));
        assertTrue(delivery.contains("$12.84"));
    }

    @Test void escapesCustomerInstructionsAndHandlesLegacyOrdersWithoutEmail() {
        Orders order = order("Pickup");
        order.setSpecialInstructions("<script>bad</script> & no peanuts");
        order.getUser().setEmail(null);
        notifications.sendOrderEmails(order);
        ArgumentCaptor<String> html = ArgumentCaptor.forClass(String.class);
        verify(mail).sendEmail(eq("restaurant@example.com"), anyString(), html.capture());
        assertTrue(html.getValue().contains("&lt;script&gt;bad&lt;/script&gt; &amp; no peanuts"));
        verifyNoMoreInteractions(mail);
    }
}

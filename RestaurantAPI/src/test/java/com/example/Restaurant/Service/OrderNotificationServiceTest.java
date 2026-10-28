package com.example.Restaurant.Service;
import com.example.Restaurant.Repository.MailOutboxRepository;
import com.example.Restaurant.model.*;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
class OrderNotificationServiceTest {
 private final MailOutboxRepository outbox=mock(MailOutboxRepository.class);
 private final OrderNotificationService notifications=new OrderNotificationService(outbox,"restaurant@example.com");
 private Orders order(String type) {
  Orders o=new Orders(); StoreUser u=new StoreUser(); u.setFirstName("Pat"); u.setEmail("customer@example.com"); o.setUser(u);
  o.setOrderName("123"); o.setOrderType(type); o.setOrderTime("6:30 PM"); o.setOrderPrice(10); o.setItems(List.of()); return o;
 }
 @Test void queuesSeparateMessages() {
  notifications.sendOrderEmails(order("Pickup")); var c=ArgumentCaptor.forClass(MailOutbox.class); verify(outbox,times(2)).save(c.capture());
  assertEquals("restaurant@example.com",c.getAllValues().get(0).recipient); assertEquals("customer@example.com",c.getAllValues().get(1).recipient);
  assertTrue(c.getAllValues().get(1).body.contains("Thank you for ordering"));
 }
 @Test void formatsTotals() { assertTrue(OrderNotificationService.buildTicket(order("Pickup")).contains("$10.70")); assertTrue(OrderNotificationService.buildTicket(order("Delivery")).contains("$12.84")); }
 @Test void escapesInstructionsAndHandlesMissingEmail() {
  Orders o=order("Pickup"); o.setSpecialInstructions("<script>bad</script> & no peanuts"); o.getUser().setEmail(null); notifications.sendOrderEmails(o);
  var c=ArgumentCaptor.forClass(MailOutbox.class); verify(outbox).save(c.capture()); assertTrue(c.getValue().body.contains("&lt;script&gt;bad&lt;/script&gt; &amp; no peanuts"));
 }
}

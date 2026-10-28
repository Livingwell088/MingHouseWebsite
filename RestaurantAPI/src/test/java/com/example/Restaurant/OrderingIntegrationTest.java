package com.example.Restaurant;
import com.example.Restaurant.Repository.*;
import com.example.Restaurant.Service.*;
import com.example.Restaurant.model.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
@SpringBootTest(properties={
 "spring.config.import=", "spring.datasource.url=jdbc:h2:mem:readiness;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
 "spring.datasource.driver-class-name=org.h2.Driver", "spring.datasource.username=sa", "spring.datasource.password=",
 "spring.jpa.hibernate.ddl-auto=create-drop", "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect", "restaurant.mail.worker-enabled=false",
 "restaurant.security.signing-secret=isolated-tests-only-secret-of-32-characters", "spring.mail.host=localhost"})
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
class OrderingIntegrationTest {
 @Autowired org.springframework.test.web.servlet.MockMvc mvc;
 @Autowired com.fasterxml.jackson.databind.ObjectMapper json;
 @Autowired CartService carts; @Autowired UserService users; @Autowired OrderServiceImpl orders;
 @Autowired MenuRepository menu; @Autowired OrderRepository orderRepository; @Autowired MailOutboxRepository outbox;
 @Autowired UserRepository userRepository; @Autowired MailDelivery delivery; @Autowired CustomerTokens tokens;
 @MockBean EmailService email;
 @SpyBean OrderNotificationService notifications;
 String owner; Menu dish;
 @BeforeEach void setup() {
  owner=carts.generateCart(); authenticate(owner);
  StoreUser c=new StoreUser(); c.setUsernameId(owner); c.setFirstName("Test"); c.setLastName("Customer"); c.setEmail("test@example.com"); users.updateContact(c);
  dish=new Menu(); dish.setId(UUID.randomUUID().toString()); dish.setName("Egg Roll"); dish.setNumber("1"); dish.setPrice("4.25"); dish.setAvailable(true); menu.saveAndFlush(dish); reset(email);
 }
 void authenticate(String id) { SecurityContextHolder.getContext().setAuthentication(UsernamePasswordAuthenticationToken.authenticated(id,null,List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER")))); }
 @AfterEach void cleanup() { SecurityContextHolder.clearContext(); }
 CartItem add(int q) { CartItem i=new CartItem(); i.setCartId(owner); i.setItem(dish); i.setQuantity(q); i.setOrderPrice(.01); carts.addItemToCart(i); return carts.getCartItems(owner).get(0); }
 Orders request() { Orders i=new Orders(); i.setRequestKey(UUID.randomUUID().toString()); i.setOrderType("Pickup"); i.setPhoneNumber("5085550100"); i.setOrderTime("ASAP"); i.setItems(carts.getCartItems(owner)); i.setOrderPrice(.01); return i; }
 @Test void pricesAndIdempotency() {
  assertEquals(8.50,add(2).getOrderPrice()); Orders i=request(); long before=orderRepository.count(),mails=outbox.count(); Orders saved=orders.placeOrder(i);
  assertEquals(8.50,saved.getOrderPrice()); assertEquals(new BigDecimal("9.10"),saved.getTotal()); assertTrue(carts.getCartItems(owner).isEmpty());
  assertEquals(saved.getId(),orders.placeOrder(i).getId()); assertEquals(before+1,orderRepository.count()); assertEquals(mails+2,outbox.count()); verifyNoInteractions(email);
 }
 @Test void ownership() {
  CartItem line=add(1); String victim=owner; authenticate("someone-else");
  assertEquals(403,assertThrows(ResponseStatusException.class,()->carts.getCartItems(victim)).getStatusCode().value());
  assertThrows(ResponseStatusException.class,()->carts.deleteCartItemById(line.getId().toString()));
  assertThrows(ResponseStatusException.class,()->users.getUserById(victim)); assertThrows(ResponseStatusException.class,()->orders.getOrdersByUser(victim));
 }
 @Test void stalePriceAndUnavailableLeaveCartIntact() {
  add(1); Orders i=request(); long before=orderRepository.count(); dish.setPrice("5.00"); menu.saveAndFlush(dish);
  assertEquals(409,assertThrows(ResponseStatusException.class,()->orders.placeOrder(i)).getStatusCode().value());
  assertEquals(before,orderRepository.count()); assertEquals(1,carts.getCartItems(owner).size());
  dish.setAvailable(false); menu.saveAndFlush(dish); assertThrows(ResponseStatusException.class,()->orders.placeOrder(i)); assertEquals(before,orderRepository.count());
 }
 @Test void invalidQuantity() { assertThrows(ResponseStatusException.class,()->add(-1)); assertTrue(carts.getCartItems(owner).isEmpty()); }
 @Test void removingLastItemAndSettingZeroKeepCartUsable() {
  CartItem line=add(1); carts.deleteCartItemById(line.getId().toString()); assertTrue(carts.getCartItems(owner).isEmpty());
  line=add(1); line.setQuantity(0); carts.updateCartItem(line); assertTrue(carts.getCartItems(owner).isEmpty()); add(1);
 }
 @Test void notificationQueueFailureRollsBackOrderAndCartTogether() {
  add(1); Orders input=request(); long before=orderRepository.count(),mails=outbox.count();
  doThrow(new IllegalStateException("simulated persistence failure")).when(notifications).sendOrderEmails(any());
  assertThrows(IllegalStateException.class,()->orders.placeOrder(input));
  assertEquals(before,orderRepository.count()); assertEquals(mails,outbox.count()); assertEquals(1,carts.getCartItems(owner).size());
 }
 @Test void concurrentRetriesCreateOneOrder() throws Exception {
  add(1); Orders input=request(); long before=orderRepository.count(), mails=outbox.count();
  var pool=java.util.concurrent.Executors.newFixedThreadPool(2); var start=new java.util.concurrent.CountDownLatch(1);
  java.util.concurrent.Callable<Long> submit=()-> { authenticate(owner); try { start.await(); return orders.placeOrder(input).getId(); } finally { SecurityContextHolder.clearContext(); } };
  try {
   var first=pool.submit(submit); var second=pool.submit(submit); start.countDown();
   assertEquals(first.get(10,java.util.concurrent.TimeUnit.SECONDS),second.get(10,java.util.concurrent.TimeUnit.SECONDS));
   assertEquals(before+1,orderRepository.count()); assertEquals(mails+2,outbox.count());
  } finally { pool.shutdownNow(); }
 }
 @Test void signedTokens() { String token=tokens.issue(owner); assertEquals(owner,tokens.verify(token)); assertNull(tokens.verify(token+"bad")); assertNull(new CustomerTokens("different-test-secret-of-32-characters").verify(token)); }
 @Test void guestCheckoutWorksThroughHttpWithIssuedCredential() throws Exception {
  SecurityContextHolder.clearContext();
  var generated=mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/carts/generate")).andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk()).andReturn().getResponse();
  String guest=generated.getContentAsString(), token=generated.getHeader("X-Customer-Token"); assertNotNull(token);
  var add=Map.of("cartId",guest,"item",Map.of("id",dish.getId()),"quantity",2,"orderPrice",.01);
  mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/carts/add").header("X-Customer-Token",token).contentType("application/json").content(json.writeValueAsBytes(add))).andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk());
  mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/carts/getCarts/"+guest)).andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isUnauthorized());
  mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/users/contact").header("X-Customer-Token",token).contentType("application/json").content(json.writeValueAsBytes(Map.of("usernameId",guest,"firstName","Test","lastName","Customer","email","test@example.com")))).andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk());
  var cart=mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/carts/getCarts/"+guest).header("X-Customer-Token",token)).andReturn().getResponse();
  String key=UUID.randomUUID().toString();
  var body=Map.of("requestKey",key,"items",json.readTree(cart.getContentAsString()),"orderType","Pickup","phoneNumber","5085550100","orderTime","ASAP","orderPrice",.01);
  mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/orders/placeOrder").header("X-Customer-Token",token).contentType("application/json").content(json.writeValueAsBytes(body)))
   .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk()).andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.orderPrice").value(8.5)).andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.user.password").doesNotExist());
  mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/orders/submissions/"+key).header("X-Customer-Token",token)).andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk());
 }
 @Test void passwordMigration() {
  String id="test-"+UUID.randomUUID(); userRepository.saveAndFlush(new StoreUser(id,"legacy-password","A","B","a@example.com",false));
  assertEquals("Match",users.validateUser(id,"legacy-password")); assertTrue(userRepository.findById(id).orElseThrow().getPassword().startsWith("$2"));
  assertEquals("Incorrect Password",users.validateUser(id,"wrong")); StoreUser fresh=new StoreUser("new-"+UUID.randomUUID(),"new-password","A","B","a@example.com",false); assertTrue(users.addUser(fresh).getPassword().startsWith("$2"));
 }
 @Test void emailRetryIsDurable() {
  add(1); Orders saved=orders.placeOrder(request()); var mail=outbox.findAll().stream().filter(m -> m.orderId.equals(saved.getId())).findFirst().orElseThrow();
  doThrow(new RuntimeException("test mail unavailable")).when(email).sendEmail(anyString(),anyString(),anyString()); delivery.deliver(mail.id);
  var failed=outbox.findById(mail.id).orElseThrow(); assertEquals(1,failed.attempts); assertNull(failed.sentAt); assertNotNull(failed.lastError);
  failed.nextAttempt=java.time.Instant.now().minusSeconds(1); outbox.saveAndFlush(failed); reset(email); delivery.deliver(mail.id);
  assertNotNull(outbox.findById(mail.id).orElseThrow().sentAt); delivery.deliver(mail.id); verify(email,times(1)).sendEmail(anyString(),anyString(),anyString());
 }
}

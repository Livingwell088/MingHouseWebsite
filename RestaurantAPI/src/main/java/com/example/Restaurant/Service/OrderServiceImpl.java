package com.example.Restaurant.Service;
import com.example.Restaurant.Ownership;
import com.example.Restaurant.Repository.*;
import com.example.Restaurant.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;
import java.math.*;
import java.time.*;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {
    @Autowired private OrderRepository orderRepository;
    @Autowired private CartRepository cartRepository;
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private OrderNotificationService notifications;
    @Autowired private Ownership ownership;
    @Autowired private MenuPricing pricing;
    private ResponseStatusException bad(String message) { return new ResponseStatusException(HttpStatus.BAD_REQUEST, message); }
    public String scopedKey(String key) {
        try { return ownership.current() + ":" + UUID.fromString(key); }
        catch (IllegalArgumentException | NullPointerException e) { throw bad("A valid submission key is required"); }
    }
    public Orders submission(String key) {
        return orderRepository.findByRequestKey(scopedKey(key)).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
    public Orders placeOrder(Orders input) {
        String owner = ownership.current();
        String key = scopedKey(input.getRequestKey());
        // The same cart lock serializes edits and concurrent submissions. Check the
        // key after acquiring it, so a waiting retry sees the committed first order.
        Cart cart = cartRepository.findLockedById(owner).orElseThrow(() -> bad("Cart not found"));
        Optional<Orders> prior = orderRepository.findByRequestKey(key);
        if (prior.isPresent()) return prior.get();
        List<CartItem> items = cartItemRepository.findAllByCartId(owner);
        if (items.isEmpty() || items.size() > 100) throw bad("Your cart must contain 1 to 100 items");
        if (input.getItems() == null || input.getItems().size() != items.size()) throw stale();
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : items) {
            CartItem submitted = input.getItems().stream().filter(i -> Objects.equals(i.getId(), item.getId())).findFirst().orElseThrow(this::stale);
            BigDecimal amount = pricing.line(pricing.menu(item.getItem().getId()), item.getQuantity());
            if (submitted.getQuantity() != item.getQuantity() || !Double.isFinite(submitted.getOrderPrice())
                    || amount.compareTo(BigDecimal.valueOf(submitted.getOrderPrice())) != 0) throw stale();
            item.setOrderPrice(amount.doubleValue());
            item.setOrderPlaced(true);
            subtotal = subtotal.add(amount);
        }
        StoreUser user = userRepository.findById(owner).orElseThrow(() -> bad("Customer not found"));
        if (user.getFirstName() == null || user.getFirstName().isBlank() || user.getLastName() == null || user.getLastName().isBlank()
                || user.getEmail() == null || !user.getEmail().matches("[^\\s@]+@[^\\s@]+\\.[^\\s@]+")) throw bad("Valid customer name and email required");
        if (!Set.of("Pickup", "Delivery").contains(Objects.toString(input.getOrderType(), ""))) throw bad("Choose pickup or delivery");
        if (input.getPhoneNumber() == null || !input.getPhoneNumber().matches("[0-9+() .-]{7,30}")) throw bad("Valid phone number required");
        if (input.getOrderTime() == null || !input.getOrderTime().matches("(?i)(ASAP|[0-9]{1,2}:[0-9]{2} [AP]M)")) throw bad("Choose a requested time");
        if ("Delivery".equals(input.getOrderType()) && (input.getAddress() == null || input.getAddress().isBlank())) throw bad("Delivery address required");
        Orders order = new Orders();
        order.setRequestKey(key); order.setUser(user); order.setItems(new ArrayList<>(items));
        order.setOrderType(input.getOrderType()); order.setPhoneNumber(input.getPhoneNumber());
        order.setAddress(limited(input.getAddress(), 500)); order.setSpecialInstructions(limited(input.getSpecialInstructions(), 2000));
        order.setOrderTime(input.getOrderTime()); order.setOrderStatus("New");
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("America/New_York"));
        order.setDatePlaced(now.toLocalDate().toString()); order.setTimePlaced(now.toLocalTime().withNano(0).toString());
        order.setOrderName(now.toLocalDate() + "-" + UUID.randomUUID().toString().substring(0,8));
        order.setOrderPrice(subtotal.doubleValue());
        BigDecimal delivery = "Delivery".equals(order.getOrderType()) ? new BigDecimal("2.00") : new BigDecimal("0.00");
        BigDecimal tax = subtotal.add(delivery).multiply(new BigDecimal("0.07")).setScale(2, RoundingMode.HALF_UP);
        order.setDeliveryFee(delivery); order.setTax(tax); order.setTotal(subtotal.add(delivery).add(tax));
        cart.getCartItems().clear(); cartRepository.saveAndFlush(cart);
        orderRepository.saveAndFlush(order);
        notifications.sendOrderEmails(order);
        return order;
    }
    private ResponseStatusException stale() { return new ResponseStatusException(HttpStatus.CONFLICT, "Your cart or a menu price changed. Refresh your cart and review it before placing the order."); }
    private String limited(String value, int max) { if (value != null && value.length() > max) throw bad("Text is too long"); return value == null ? "" : value.trim(); }
    public List<Orders> getAllOrders() { return orderRepository.findAll(); }
    public List<Orders> getOrdersByUser(String id) { ownership.require(id); return userRepository.findById(id).map(orderRepository::findAllByUser).orElseGet(ArrayList::new); }
    public void deleteAll() { orderRepository.deleteAll(); }
    public Orders updateOrderStatus(Long id, String status) {
        if (!Set.of("New", "Preparing", "Ready", "Completed", "Cancelled").contains(Objects.toString(status,""))) throw bad("Invalid order status");
        Orders order = orderRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        order.setOrderStatus(status); return orderRepository.saveAndFlush(order);
    }
}

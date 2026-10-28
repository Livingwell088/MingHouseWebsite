package com.example.Restaurant.Service;

import com.example.Restaurant.Ownership;
import com.example.Restaurant.Repository.*;
import com.example.Restaurant.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;

@Service
@Transactional
public class CartServiceImpl implements CartService {
    @Autowired private CartRepository cartRepository;
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private UserRepository users;
    @Autowired private Ownership ownership;
    @Autowired private MenuPricing pricing;

    public List<CartItem> getCartItems(String id) {
        lock(id);
        List<CartItem> items = cartItemRepository.findAllByCartId(id);
        for (CartItem item : items) item.setOrderPrice(pricing.line(item.getItem(), item.getQuantity()).doubleValue());
        return items;
    }
    private Cart lock(String id) {
        ownership.require(id);
        return cartRepository.findLockedById(id).orElseThrow(() -> bad("Cart not found"));
    }
    private ResponseStatusException bad(String message) { return new ResponseStatusException(HttpStatus.BAD_REQUEST, message); }

    public Cart addItemToCart(CartItem input) {
        Cart cart = lock(input.getCartId());
        Menu menu = pricing.menu(input.getItem() == null ? null : input.getItem().getId());
        pricing.line(menu, input.getQuantity());
        String note = pricing.note(input.getSpecialInstruction());
        List<CartItem> active = cartItemRepository.findAllByCartId(cart.getCart_Id());
        CartItem line = active.stream().filter(i -> i.getItem().getId().equals(menu.getId()) && Objects.equals(note, i.getSpecialInstruction()))
                .findFirst().orElseGet(CartItem::new);
        int quantity = line.getId() == null ? input.getQuantity() : line.getQuantity() + input.getQuantity();
        line.setOrderPrice(pricing.line(menu, quantity).doubleValue());
        line.setQuantity(quantity);
        line.setItem(menu);
        line.setCartId(cart.getCart_Id());
        line.setOrderName(menu.getName());
        line.setSpecialInstruction(note);
        line.setOrderPlaced(false);
        cartItemRepository.saveAndFlush(line);
        cart.setCartItems(cartItemRepository.findAllByCartId(cart.getCart_Id()));
        return cartRepository.saveAndFlush(cart);
    }
    private CartItem editable(Long id, String cartId) {
        if (id == null) throw bad("Cart item required");
        CartItem line = cartItemRepository.findById(id).orElseThrow(() -> bad("Cart item not found"));
        if (line.isOrderPlaced() || !Objects.equals(cartId, line.getCartId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cart item does not belong to this cart");
        return line;
    }
    public Cart updateCartItem(CartItem input) {
        Cart cart = lock(input.getCartId());
        CartItem line = editable(input.getId(), cart.getCart_Id());
        if (input.getQuantity() == 0) {
            cart.getCartItems().remove(line);
            cartItemRepository.delete(line);
        } else {
            Menu menu = pricing.menu(input.getItem() == null ? null : input.getItem().getId());
            line.setItem(menu);
            line.setQuantity(input.getQuantity());
            line.setOrderPrice(pricing.line(menu, input.getQuantity()).doubleValue());
            line.setSpecialInstruction(pricing.note(input.getSpecialInstruction()));
            line.setOrderName(menu.getName());
        }
        return cartRepository.saveAndFlush(cart);
    }
    public void deleteCartItem(CartItem input) {
        Cart cart = lock(input.getCartId());
        if (input.getItem() == null) throw bad("Menu item required");
        CartItem line = cartItemRepository.findAllByCartId(cart.getCart_Id()).stream()
                .filter(i -> i.getItem().getId().equals(input.getItem().getId())
                        && Objects.equals(pricing.note(input.getSpecialInstruction()), pricing.note(i.getSpecialInstruction())))
                .findFirst().orElseThrow(() -> bad("Cart item not found"));
        decrease(cart, line);
    }
    private void decrease(Cart cart, CartItem line) {
        if (line.getQuantity() <= 1) {
            cart.getCartItems().remove(line);
            cartItemRepository.delete(line);
        } else {
            line.setQuantity(line.getQuantity() - 1);
            line.setOrderPrice(pricing.line(line.getItem(), line.getQuantity()).doubleValue());
        }
        cartRepository.saveAndFlush(cart);
    }
    public void deleteCartItemById(String id) {
        CartItem line = cartItemRepository.findById(Long.valueOf(id)).orElseThrow(() -> bad("Cart item not found"));
        Cart cart = lock(line.getCartId());
        editable(line.getId(), cart.getCart_Id());
        decrease(cart, line);
    }
    public void deleteCartItemsInCart(String id) {
        Cart cart = lock(id);
        List<CartItem> active = cartItemRepository.findAllByCartId(id);
        cart.getCartItems().clear();
        cartRepository.saveAndFlush(cart);
        cartItemRepository.deleteAll(active);
    }
    public Optional<Cart> getCartById(String id) { ownership.require(id); var cart=cartRepository.findById(id); cart.ifPresent(c -> c.getCartItems().size()); return cart; }
    public Cart saveOrUpdate(Cart cart) { throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED); }
    public boolean existByItem(Menu menu, String note) { return false; }
    public void deleteCart(String id) { deleteCartItemsInCart(id); }
    public List<Cart> getAll() { var carts=cartRepository.findAll(); carts.forEach(c -> c.getCartItems().size()); return carts; }
    public List<CartItem> getAllItems() { return cartItemRepository.findAll(); }
    public void deleteAll() { cartRepository.deleteAll(); }

    public String generateCart() {
        String id = "Guest-" + UUID.randomUUID();
        StoreUser guest = new StoreUser(id, "", "", "", "", true);
        users.saveAndFlush(guest);
        Cart cart = new Cart();
        cart.setCart_Id(id);
        cartRepository.saveAndFlush(cart);
        return id;
    }
    public String cartLogin(String source, String target) {
        ownership.require(target);
        if (Objects.equals(source, target)) return "";
        ownership.requireGuestSource(source);
        List<String> ordered = new ArrayList<>(List.of(source, target));
        Collections.sort(ordered);
        Map<String, Cart> locked = new HashMap<>();
        for (String id : ordered) cartRepository.findLockedById(id).ifPresent(c -> locked.put(id, c));
        Cart from = locked.get(source);
        if (from == null) return "";
        Cart to = locked.get(target);
        if (to == null) {
            to = new Cart(); to.setCart_Id(target); to = cartRepository.saveAndFlush(to);
        }
        List<CartItem> items = new ArrayList<>(cartItemRepository.findAllByCartId(source));
        from.getCartItems().clear();
        cartRepository.saveAndFlush(from);
        for (CartItem item : items) item.setCartId(target);
        cartItemRepository.flush();
        to.setCartItems(cartItemRepository.findAllByCartId(target));
        cartRepository.saveAndFlush(to);
        return "";
    }
}

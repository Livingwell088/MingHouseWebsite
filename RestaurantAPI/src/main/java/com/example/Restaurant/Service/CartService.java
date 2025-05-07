package com.example.Restaurant.Service;

import com.example.Restaurant.model.Cart;
import com.example.Restaurant.model.CartItem;
import com.example.Restaurant.model.Menu;

import java.util.List;
import java.util.Optional;

public interface CartService {


    public List<CartItem> getCartItems(String sessionId);

    public Cart addItemToCart(CartItem item);

    public Cart saveOrUpdate(Cart cart);

    Cart updateCartItem(CartItem item);

    Optional<Cart> getCartById(String id);

    void deleteCartItem(CartItem item);

    void deleteAll();

    boolean existByItem(Menu menu, String instructions);

    String generateCart();

    public String cartLogin(String cartId, String username);

    public List<Cart> getAll();


    public void deleteCartItemsInCart(String cartId);

    public void deleteCartItemById(String cartItemId);

    public void deleteCart(String cartId);

    public List<CartItem> getAllItems();
}

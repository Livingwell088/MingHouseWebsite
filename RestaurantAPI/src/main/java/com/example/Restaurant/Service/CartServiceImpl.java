package com.example.Restaurant.Service;

//import com.example.Restaurant.Repository.CartRepository;
import com.example.Restaurant.Repository.CartItemRepository;
import com.example.Restaurant.Repository.CartRepository;
import com.example.Restaurant.model.Cart;
import com.example.Restaurant.model.CartItem;
import com.example.Restaurant.model.Menu;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class CartServiceImpl implements CartService{


    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Override
    public List<CartItem> getCartItems(String sessionId) {

        Optional<Cart> cart = cartRepository.findById(sessionId);

        if (cart.isPresent()){
            return cart.get().getCartItems();
        }
        else{
            return new ArrayList<>();
        }
    }

    @Override
    public Cart addItemToCart(CartItem item) {

        Optional<Cart> cart = cartRepository.findById(item.getCartId());

        if (cart.isPresent()){
//            System.out.println("Found");
        }
        else{
            Cart current = new Cart();
            current.setCart_Id(item.getCartId());
            cartRepository.saveAndFlush(current);
//            System.out.println("Make One!");
        }

        cart = cartRepository.findById(item.getCartId());


        Long exist = cartItemRepository.findAllByItemAndSpecialInstruction(item.getCartId(), item.getItem(), item.getSpecialInstruction());

        if (exist != null){
//            System.out.println("Found Duplicate: " + cartItemRepository.findById(exist));

            CartItem currentItem = cartItemRepository.findById(exist).get();
            currentItem.setQuantity(currentItem.getQuantity() + item.getQuantity());
            currentItem.setOrderPrice(Double.parseDouble(currentItem.getItem().getPrice()) * currentItem.getQuantity());

            cartItemRepository.saveAndFlush(currentItem);
        }
        else{
            cartItemRepository.saveAndFlush(item);
        }


        List<CartItem> items = cartItemRepository.findAllByCartId(item.getCartId());

//        System.out.println("Cart:" + cart.get().toString());
//        System.out.println("Cart Items: " + items);


        Cart newCart = cart.get();
        newCart.setCartItems(items);


        cartRepository.saveAndFlush(newCart);


//
//        Cart current;
//        if (cart.isPresent()){
//            current = cart.get();
//
//            List<CartItem> items = current.getCartItems();
//
//            items.add(item);
//            current.setCartItems(items);
//
//        }
//        else{
//            current = new Cart();
//            current.setCart_Id(item.getCartId());
//
//            List<CartItem> items = new ArrayList<>();
//            items.add(item);
//
//            current.setCartItems(items);
//        }
//        System.out.println(current.toString());
//
//        cartRepository.saveAndFlush(current);
        return new Cart();
    }

    @Override
    public Cart saveOrUpdate(Cart cart){

        return cart;
    }

    public Optional<Cart> getCartById(String id) {
        return cartRepository.findById(id);
    }

    @Override
    public Cart updateCartItem(CartItem item) {

        System.out.println(item.toString());


//        cartItemRepository.saveAndFlush(item);
//        List<CartItem> items = cartItemRepository.findAllByCartId(item.getCartId());
//
//
//        Optional<Cart> cart = cartRepository.findById(item.getCartId());
//        cart = cartRepository.findById(item.getCartId());
//
//        Cart newCart = cart.get();
//        newCart.setCartItems(items);
//
//
//
//        cartRepository.saveAndFlush(newCart);
//        return new Cart();

//        deleteCartItemById(String.valueOf(item.getId()));

        CartItem currentItem = cartItemRepository.findById(item.getId()).get();

        String cartId = item.getCartId();
        Cart cart = getCartById(cartId).orElseThrow(() -> new EntityNotFoundException(
                String.format("Carts with id %d not found.", cartId)));

        Long currentId = cartItemRepository.findAllByItemAndSpecialInstruction(cartId, currentItem.getItem(), item.getSpecialInstruction());
        CartItem current = cartItemRepository.getById(currentId);
        cart.getCartItems().remove(current);
        cartItemRepository.deleteById(currentId);


        if (item.getQuantity() > 0){
            addItemToCart(item);
        }

        return new Cart();



    }


    public void deleteCartItem(CartItem item) throws RuntimeException {

//        System.out.println("Deleting");
//        System.out.println(item.toString());

        String cartId = item.getCartId();
        Cart cart = getCartById(cartId).orElseThrow(() -> new EntityNotFoundException(
                String.format("Carts with id %d not found.", cartId)));

        Long currentId = cartItemRepository.findAllByItemAndSpecialInstruction(cartId, item.getItem(), item.getSpecialInstruction());
        CartItem current = cartItemRepository.getById(currentId);

        if (current.getQuantity() == 1){
            cart.getCartItems().remove(current);
            cartItemRepository.deleteById(currentId);

        }
        else{
            current.setQuantity(current.getQuantity() - 1);
            current.setOrderPrice(current.getQuantity() * Double.parseDouble(current.getItem().getPrice()));

            cartItemRepository.flush();
        }


        cartRepository.flush();
    }

    public void deleteAll() {
        cartRepository.deleteAll();
        cartRepository.flush();
    }

    public boolean existByItem(Menu menu, String instructions){

//        return cartRepository.existsByItemAndSpecialInstruction(menu, instructions);
        return true;
    }

    @Override
    public String generateCart() {

        Random rand = new Random();
        return "Guest" + String.valueOf(rand.nextInt());
    }


    public String cartLogin(String cartId, String username){

        if (cartRepository.findById(cartId).isEmpty()){
            return "No Cart Found";
        }
        else{
            Cart currentCart = cartRepository.findById(cartId).get();

            Optional<Cart> userCart = cartRepository.findById(username);

//            System.out.println(currentCart.toString());
            if (userCart.isEmpty()){
//                System.out.println("New User Cart");


                Cart newCart = new Cart();
                newCart.setCart_Id(username);
                List<CartItem> cartItems = currentCart.getCartItems();

                for (CartItem item: cartItems){
                    item.setCartId(username);
                    cartItemRepository.saveAndFlush(item);
                }
                currentCart.setCartItems(cartItemRepository.findAllByCartId(cartId));
                cartRepository.saveAndFlush(currentCart);


                newCart.setCartItems(cartItemRepository.findAllByCartId(username));
                cartRepository.saveAndFlush(newCart);


                List<CartItem> deletingItems = cartItemRepository.findAllByCartId(cartId);
                cartItemRepository.deleteAll(deletingItems);
                cartRepository.deleteById(cartId);

            }
            else{
                Cart newCart = userCart.get();

                List<CartItem> cartItems = currentCart.getCartItems();

                currentCart.getCartItems().removeIf(cartItem -> cartItem.getCartId().equals(cartId));

                cartItems = cartItemRepository.findAllByCartId(cartId);
//                System.out.println(cartItems);
                for (CartItem item: cartItems){

                    Long exist = cartItemRepository.findAllByItemAndSpecialInstruction(username, item.getItem(), item.getSpecialInstruction());

                    if (exist != null){
//                        System.out.println("Found Duplicate: " + cartItemRepository.findById(exist));

                        CartItem currentItem = cartItemRepository.findById(exist).get();
                        currentItem.setQuantity(currentItem.getQuantity() + item.getQuantity());
                        currentItem.setOrderPrice(Double.parseDouble(currentItem.getItem().getPrice()) * currentItem.getQuantity());

                        cartItemRepository.saveAndFlush(currentItem);

                    }
                    else{
                        item.setCartId(username);
                        cartItemRepository.saveAndFlush(item);
                    }
                }
//                System.out.println("Test: " + cartItems);
                deleteCartItemsInCart(cartId);


                newCart.setCartItems(cartItemRepository.findAllByCartId(username));
                cartRepository.saveAndFlush(newCart);
            }
        }

        return "";
    }


    public List<Cart> getAll(){

        return cartRepository.findAll();
    }


    public void deleteCartItemsInCart(String cartId){

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        cart.getCartItems().removeIf(cartItem -> cartItem.getCartId().equals(cartId));
        cartRepository.save(cart);

        List<CartItem> items = cartItemRepository.findAllByCartId(cartId);
        cartItemRepository.deleteAll(items);

        cartRepository.delete(cart);
    }

    @Override
    public void deleteCartItemById(String cartItemId) {
//        cartItemRepository.deleteById(Long.parseLong(cartItemId));

        CartItem item = cartItemRepository.findById(Long.parseLong(cartItemId)).get();

        String cartId = item.getCartId();
        Cart cart = getCartById(cartId).orElseThrow(() -> new EntityNotFoundException(
                String.format("Carts with id %d not found.", cartId)));

        Long currentId = cartItemRepository.findAllByItemAndSpecialInstruction(cartId, item.getItem(), item.getSpecialInstruction());
        CartItem current = cartItemRepository.getById(currentId);

        if (current.getQuantity() == 1){
            cart.getCartItems().remove(current);
            cartItemRepository.deleteById(currentId);

        }
        else{
            current.setQuantity(current.getQuantity() - 1);
            current.setOrderPrice(current.getQuantity() * Double.parseDouble(current.getItem().getPrice()));

            cartItemRepository.flush();
        }


        cartRepository.flush();




    }

    public void deleteCart(String cartId){
        cartRepository.deleteById(cartId);
    }

    public List<CartItem> getAllItems(){
        return cartItemRepository.findAll();
    }


}

package com.example.Restaurant.Controller;

import com.example.Restaurant.Service.CartService;
import com.example.Restaurant.model.Cart;
import com.example.Restaurant.model.CartItem;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping(path = "/carts")
@CrossOrigin(origins = "http://localhost:3000")
//@SessionAttributes("cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping(path = "/getCarts/{sessionId}")
    public List<CartItem> getAllCarts(@PathVariable String sessionId){

        return cartService.getCartItems(sessionId);
    }

    @GetMapping(path = "/getAllItems")
    public List<CartItem> getAllItems() {
        return cartService.getAllItems();
    }

    @GetMapping(path = "getAllCart")
    public List<Cart> getAll(){
        return cartService.getAll();
    }

    @PostMapping(path = "/add")
//    @ResponseStatus(HttpStatus.CREATED)
    public String addCart(@RequestBody CartItem item) {
        return cartService.addItemToCart(item).getCart_Id();
    }


    @PutMapping(path = "/{cartId}")
    public void editCart(@PathVariable String cartId, @RequestBody CartItem item) {

        cartService.updateCartItem(item);
    }

    @PostMapping(path = "cartLogin/{username}")
    public String cartLogIn(@PathVariable String username, @RequestBody String cartId){

        System.out.println("Cart Login");
        System.out.println(username);
        System.out.println(cartId);

        cartService.cartLogin(cartId, username);

        return "";
    }



    @GetMapping(path = "/{id}")
    public Cart getCart(@PathVariable String id) {
        return cartService.getCartById(id).orElseThrow(() -> new EntityNotFoundException(
                String.format("Error: Project with id %d not found.", id)));
    }


    @PostMapping(path ="/delete")
    public void deleteCarts(@RequestBody CartItem item) {
        cartService.deleteCartItem(item);
    }

    @PostMapping(path = "/deleteById/{cartItemId}")
    public void deleteCartItemById(@PathVariable String cartItemId){
        cartService.deleteCartItemById(cartItemId);
    }

    @PostMapping(path = "/deleteCart/{cartId}")
    public void deleteCart(@PathVariable String cartId){

        cartService.deleteCartItemsInCart(cartId);
//        cartService.deleteCart(cartId);
    }

    @DeleteMapping()
    public void deleteAll() {
        cartService.deleteAll();
    }

    @GetMapping(path = "/generate")
    public String generateCart() {
        String generated = cartService.generateCart();
        System.out.println(generated);
        return generated;
    }

//    @GetMapping(path = "/{id}")
//    public Carts getOrder(@PathVariable String id) {
//        return cartService.getById(id).orElseThrow(() -> new EntityNotFoundException(
//                String.format("Error: Project with id %d not found.", id)));
//    }

}

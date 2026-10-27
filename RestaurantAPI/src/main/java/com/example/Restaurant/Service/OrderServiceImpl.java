package com.example.Restaurant.Service;

import com.example.Restaurant.Repository.CartItemRepository;
import com.example.Restaurant.Repository.CartRepository;
import com.example.Restaurant.Repository.OrderRepository;
import com.example.Restaurant.Repository.UserRepository;
import com.example.Restaurant.model.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class OrderServiceImpl implements OrderService{

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderNotificationService orderNotificationService;

    @Override
    public Orders placeOrder(Orders orders) {

//        Clear the cart
//        Add items to order
//        make items placed

        String userId = orders.getUser().getUsernameId();
        Cart currentCart = cartRepository.findById(userId).get();
        currentCart.setCartItems(new ArrayList<>());
        cartRepository.saveAndFlush(currentCart);

        List<CartItem> orderItems = orders.getItems();

        for (CartItem item : orderItems){
            item.setOrderPlaced(true);
//            count += 1;
            cartItemRepository.saveAndFlush(item);
        }

        System.out.println(orders);

        String orderName = orders.getOrderName();
        int number = orderRepository.findAllByDatePlaced(orders.getDatePlaced()).size();

        orderName += "-" + String.valueOf(number);

        orders.setOrderName(orderName);

        System.out.println(orders);

        orderRepository.saveAndFlush(orders);

        orderNotificationService.sendOrderEmails(orders);
        return orders;
    }

    @Override
    public List<Orders> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<Orders> getOrdersByUser(String userId) {

        if (userRepository.findById(userId).isEmpty()){
            return new ArrayList<>();
        }
        else{
            StoreUser currentUser = userRepository.findById(userId).get();
            return orderRepository.findAllByUser(currentUser);
        }

    }

    @Override
    public void deleteAll() {
        orderRepository.deleteAll();
    }

    @Override
    public Orders updateOrderStatus(Long id, String status) {

        Orders current = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Order Not Found with ID: " + id
                ));

        current.setOrderStatus(status);

        return orderRepository.saveAndFlush(current);
    }


    //    @Override
    public List<Orders> getOrdersByUser(StoreUser user) {

        return orderRepository.findAllByUser(user);
    }


}

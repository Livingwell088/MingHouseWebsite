package com.example.Restaurant.Controller;

import com.example.Restaurant.Service.CartService;
import com.example.Restaurant.Service.EmailService;
import com.example.Restaurant.Service.OrderService;
import com.example.Restaurant.model.Cart;
import com.example.Restaurant.model.Orders;
import com.example.Restaurant.model.StoreUser;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/orders")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = {
        "https://minghousema.com",
        "https://www.minghousema.com"
})

public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping(path = "/getAllOrders")
    public List<Orders> getAllOrders(){
        return orderService.getAllOrders();
    }

    @PostMapping(path = "/placeOrder")
    public Orders placeOrder(@RequestBody Orders orders){




        return orderService.placeOrder(orders);
//        return 0L;
    }

    @Autowired private com.example.Restaurant.Repository.OrderRepository submissions;
    @Autowired private com.example.Restaurant.Ownership ownership;
    @GetMapping("/submissions/{key}")
    public Orders submission(@PathVariable String key) { try { return submissions.findByRequestKey(ownership.current() + ":" + java.util.UUID.fromString(key)).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)); } catch (IllegalArgumentException e) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST); } }

    @PostMapping(path = "/deleteAll")
    public void deleteAll(){
        orderService.deleteAll();
    }

    @GetMapping(path = "/getOrder/{userId}")
    public List<Orders> getOrderByUser(@PathVariable String userId){

        return orderService.getOrdersByUser(userId);
    }

    @PutMapping("/{id}/status")
    public Orders updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        return orderService.updateOrderStatus(id, body.get("status"));
    }

}

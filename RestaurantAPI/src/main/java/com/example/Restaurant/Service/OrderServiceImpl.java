package com.example.Restaurant.Service;

import com.example.Restaurant.Repository.CartItemRepository;
import com.example.Restaurant.Repository.CartRepository;
import com.example.Restaurant.Repository.OrderRepository;
import com.example.Restaurant.Repository.UserRepository;
import com.example.Restaurant.model.*;
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
    private EmailService emailService;

    @Override
    public Orders placeOrder(Orders orders) {

//        Clear the cart
//        Add items to order
//        make items placed
        int count = 0;

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

        String email = "";

        if (orders.getOrderType().equals("Delivery")){
            email = "<html> <body>" +

                    "<h3>Order Confirmation</h3>" +
                    "<p>Thank You for Your Order</p>" +
                    "<h4>Summary</h4>" +

                    "<div style= 'border: 1px solid, textAlign: left, padding: 0 3% 0 3%' >" +
                    "<table style=\"width: 80%\">" +
                    "<tbody>" +
                    "<tr>" +
                    "    <td><strong>Order Number:</strong>" +  orders.getPhoneNumber() + "</td>" +
                    "    <td><strong>Order for " + orders.getOrderType() + "</strong></td>" +
                    "</tr>" +

                    "<tr>" +
                    "    <td><strong>Date of Order:</strong>" + orders.getDatePlaced() + "</td>" +
                    "    <td><strong>Address: </strong>" + orders.getAddress() + "</td>" +
                    "</tr>" +

                    "<tr>" +
                    "    <td><strong>Time for Delivery:</strong> " + orders.getOrderTime() + "</td>" +
                    "</tr>" +

                    "</tbody>" +
                    "</table>" +
                    "</div>" 



                    + "<table style= 'width: 100%' >" +
                    "<thead>" +
                    "<tr>" +
                    "    <th style='width: 70%'>Item</th>" +
                    "    <th style='width: 10%; textAlign: center'>Quantity</th>" +
                    "    <th class=\"tablePrice\" style='width: 20%'>Price</th>" +
                    "</tr>" +
                    
                    "</thead>" +
                    "<tbody>";

            for (CartItem item : orderItems){
                count += item.getQuantity();

                if (!item.getSpecialInstruction().equals("")){
                    email +=  //"<>" +
                    "<tr>" +
                            "    <td>" + item.getItem().getName() + " " + item.getItem().getSize() + "</td>" +
                            "    <td style='textAlign: center'>" + item.getQuantity() + "</td>" +
                            "    <td class=\"tablePrice\">$" + item.getOrderPrice() + "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "    <td></td>" +
                            "    <td>&nbsp;&nbsp;&nbsp;&nbsp;" + item.getSpecialInstruction() + "</td>" +
                            "    <td></td>" +
                            "</tr>";// +
//                            "</>";
                }
                else{
                    email += "<tr>" +
                    "    <td><Image src=\"/images/\" + item.item.number + \".png\" style='width: 10%' /> " + item.getItem().getName() + " " + item.getItem().getSize() + "</td>" +
                            "    <td style='textAlign: center'>" + item.getQuantity() + "</td>" +
                            "    <td class='tablePrice'>$" + item.getOrderPrice() + "</td>" +

                            "</tr>";
                }
            }
            email +="</tbody></table>";
            
            email += "<br /><table style='width: 100%; textAlign: right'>" +
                    "<tbody>" +
                    "<tr>" +
                    "    <td style='width: 70%'>" +
                    "    Subtotal (" + count + " Items):" +
                    "    </td>" +
                    "    <td style='width: 10%'>" +
                    "    $" + orders.getOrderPrice() +
                    "    </td>" +
                    "</tr>" +
                    
                    "<tr>" +
                    "    <td style='width: 70%'>" +
                    "    Delivery Fee:" +
                    "    </td>" +
                    "    <td style='width: 10%'>" +
                    "    $2.00" +
                    "    </td>" +
                    "</tr>" +
                    
                    "<tr>" +
                    "    <td style='width: 70%'>" +
                    "    Tax:" +
                    "    </td>" +
                    
                    "    <td style='width: 10%'>$" + ((orders.getOrderPrice() + 2) * 0.07) + "</td>" +
                    "</tr>" +
                    
                    "<tr style='borderTop: 1px solid'>" +
                    "<td style='width: 70%'>" +
                    "Order Total:" +
                    "</td>" +
                    
                    "<td style='width: 10%'>$" + ((orders.getOrderPrice() + 2) * 1.07) + "</td>" +
                    "</tr>" +
                    
                    "</tbody>" +
                    "</table>"
                    
                    
                    + "</body> </html>";
        }
        else{
            email = "<html> <body>" +

                    "<h3>Order Confirmation</h3>" +
                    "<p>Thank You for Your Order</p>" +
                    "<h4>Summary</h4>" +

                    "<div style= 'border: 1px solid, textAlign: left, padding: 0 3% 0 3%' >" +
                    "<table style=\"width: 80%\">" +
                    "<tbody>" +
                    "<tr>" +
                    "    <td><strong>Order Number:</strong>" +  orders.getPhoneNumber() + "</td>" +
                    "    <td><strong>Order for " + orders.getOrderType() + "</strong></td>" +
                    "</tr>" +

                    "<tr>" +
                    "    <td><strong>Date of Order:</strong>" + orders.getDatePlaced() + "</td>" +
                    "</tr>" +

                    "<tr>" +
                    "    <td><strong>Time for Pickup:</strong> " + orders.getOrderTime() + "</td>" +
                    "</tr>" +

                    "</tbody>" +
                    "</table>" +
                    "</div>" +

                    "<table style= 'width: 100%' >" +
                    "<thead>" +
                    "<tr>" +
                    "    <th style='width: 70%'>Item</th>" +
                    "    <th style='width: 10%; textAlign: center'>Quantity</th>" +
                    "    <th class=\"tablePrice\" style='width: 20%'>Price</th>" +
                    "</tr>" +

                    "</thead>" +
                    "<tbody>";

            for (CartItem item : orderItems){
                count += item.getQuantity();

                if (!item.getSpecialInstruction().equals("")){
                    email +=  //"<>" +
                            "<tr>" +
                            "    <td>" + item.getItem().getName() + " " + item.getItem().getSize() + "</td>" +
                            "    <td style='textAlign: center'>" + item.getQuantity() + "</td>" +
                            "    <td class=\"tablePrice\">$" + item.getOrderPrice() + "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "    <td></td>" +
                            "    <td>&nbsp;&nbsp;&nbsp;&nbsp;" + item.getSpecialInstruction() + "</td>" +
                            "    <td></td>" +
                            "</tr>"; //+"</>";
                }
                else{
                    email += "<tr>" +
                            "    <td><Image src=\"/images/\" + item.item.number + \".png\" style='width: 10%' /> " + item.getItem().getName() + " " + item.getItem().getSize() + "</td>" +
                            "    <td style='textAlign: center'>" + item.getQuantity() + "</td>" +
                            "    <td class='tablePrice'>$" + item.getOrderPrice() + "</td>" +

                            "</tr>";
                }
            }

            email +="</tbody></table>";

            email += "<br /><table style='width: 100%; textAlign: right'>" +
                    "<tbody>" +
                    "<tr>" +
                    "    <td style='width: 70%'>" +
                    "    Subtotal (" + count + " Items):" +
                    "    </td>" +
                    "    <td style='width: 10%'>" +
                    "    $" + orders.getOrderPrice() +
                    "    </td>" +
                    "</tr>" +

                    "<tr>" +
                    "    <td style='width: 70%'>" +
                    "    Delivery Fee:" +
                    "    </td>" +
                    "    <td style='width: 10%'>" +
                    "    $2.00" +
                    "    </td>" +
                    "</tr>" +

                    "<tr>" +
                    "    <td style='width: 70%'>" +
                    "    Tax:" +
                    "    </td>" +

                    "    <td style='width: 10%'>$" + ((orders.getOrderPrice()) * 0.07) + "</td>" +
                    "</tr>" +

                    "<tr style='borderTop: 1px solid'>" +
                    "<td style='width: 70%'>" +
                    "Order Total:" +
                    "</td>" +

                    "<td style='width: 10%'>$" + ((orders.getOrderPrice()) * 1.07) + "</td>" +
                    "</tr>" +

                    "</tbody>" +
                    "</table>"


                    + "</body> </html>";


        }


        emailService.sendEmail("Livingwell088@gmail.com", "Testing", email);
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


//    @Override
    public List<Orders> getOrdersByUser(StoreUser user) {

        return orderRepository.findAllByUser(user);
    }


}

package com.example.Restaurant.model;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;

@Entity
public class CartItem {

//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @EqualsAndHashCode.Include
//    private Long id;

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    @EqualsAndHashCode.Include
    private Long id;

    private String orderName;
    private double orderPrice;
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "menu_id")
    private Menu item;


    private String cartId;

    private String specialInstruction;

    private boolean orderPlaced;


    public CartItem(Long id, String orderName, double orderPrice, int quantity, Menu item, String specialInstruction) {
        this.id = id;
        this.orderName = orderName;
        this.orderPrice = orderPrice;
        this.quantity = quantity;
        this.item = item;
        this.specialInstruction = specialInstruction;
        this.orderPlaced = false;
    }

    public CartItem() {
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderName() {
        return orderName;
    }

    public void setOrderName(String orderName) {
        this.orderName = orderName;
    }

    public double getOrderPrice() {
        return orderPrice;
    }

    public void setOrderPrice(double orderPrice) {
        this.orderPrice = orderPrice;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Menu getItem() {
        return item;
    }

    public void setItem(Menu item) {
        this.item = item;
    }

    public String getCartId() {
        return cartId;
    }

    public void setCartId(String cartId) {
        this.cartId = cartId;
    }

    public String getSpecialInstruction() {
        return specialInstruction;
    }

    public void setSpecialInstruction(String specialInstruction) {
        this.specialInstruction = specialInstruction;
    }

    public boolean isOrderPlaced() {
        return orderPlaced;
    }

    public void setOrderPlaced(boolean orderPlaced) {
        this.orderPlaced = orderPlaced;
    }

    @Override
    public String toString() {
        return "CartItem{" +
                "id=" + id +
                ", orderName='" + orderName + '\'' +
                ", orderPrice=" + orderPrice +
                ", quantity=" + quantity +
                ", item=" + item +
                ", cartId='" + cartId + '\'' +
                ", specialInstruction='" + specialInstruction + '\'' +
                ", orderPlaced=" + orderPlaced +
                '}';
    }
}





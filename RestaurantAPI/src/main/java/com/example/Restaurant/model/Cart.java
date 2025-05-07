package com.example.Restaurant.model;

import jakarta.persistence.*;
import org.hibernate.annotations.Index;

import java.util.ArrayList;
import java.util.List;


@Entity
public class Cart {


    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String cart_Id;

    @OneToMany //(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems = new ArrayList<>();

    public String getCart_Id() {
        return cart_Id;
    }

    public void setCart_Id(String id) {
        this.cart_Id = id;
    }

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }


    @Override
    public String toString() {
        return "Cart{" +
                "cart_Id='" + cart_Id + '\'' +
                ", cartItems=" + cartItems +
                '}';
    }
}



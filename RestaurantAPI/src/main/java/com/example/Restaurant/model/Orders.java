package com.example.Restaurant.model;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;


@Entity
public class Orders {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    @EqualsAndHashCode.Include
    private Long id;

    private String orderName;

    private double orderPrice;

    private String orderType;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private StoreUser user;

    private String address;

    private String phoneNumber;

    private String specialInstructions;

    private String orderTime;

    private String datePlaced;

    private String timePlaced;

    @OneToMany
    private List<CartItem> items;

    public Orders() {
    }

    public Orders(Long id, String orderName, double orderPrice, String orderType, StoreUser user, String address, String phoneNumber, String specialInstructions, String orderTime, String datePlaced, String timePlaced, List<CartItem> items) {
        this.id = id;
        this.orderName = orderName;
        this.orderPrice = orderPrice;
        this.orderType = orderType;
        this.user = user;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.specialInstructions = specialInstructions;
        this.orderTime = orderTime;
        this.datePlaced = datePlaced;
        this.timePlaced = timePlaced;
        this.items = items;
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

    public String getOrderType() {
        return orderType;
    }

    public void setOrderType(String orderType) {
        this.orderType = orderType;
    }

    public StoreUser getUser() {
        return user;
    }

    public void setUser(StoreUser user) {
        this.user = user;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }

    public String getOrderTime() {
        return orderTime;
    }

    public void setOrderTime(String orderTime) {
        this.orderTime = orderTime;
    }

    public String getDatePlaced() {
        return datePlaced;
    }

    public void setDatePlaced(String datePlaced) {
        this.datePlaced = datePlaced;
    }

    public String getTimePlaced() {
        return timePlaced;
    }

    public void setTimePlaced(String timePlaced) {
        this.timePlaced = timePlaced;
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }


    @Override
    public String toString() {
        return "Orders{" +
                "id=" + id +
                ", orderName='" + orderName + '\'' +
                ", orderPrice=" + orderPrice +
                ", orderType='" + orderType + '\'' +
                ", user=" + user +
                ", address='" + address + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", specialInstructions='" + specialInstructions + '\'' +
                ", orderTime='" + orderTime + '\'' +
                ", datePlaced='" + datePlaced + '\'' +
                ", timePlaced='" + timePlaced + '\'' +
                ", items=" + items +
                '}';
    }
}



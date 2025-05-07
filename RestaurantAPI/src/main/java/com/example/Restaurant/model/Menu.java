package com.example.Restaurant.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Menu {

    @Id
    private String id;

    private String number, name, size, category, price, spicy;

    public Menu() {
    }

    public Menu(String id, String number, String name, String size, String category, String price, String spicy) {
        this.id = id;
        this.number = number;
        this.name = name;
        this.size = size;
        this.category = category;
        this.price = price;
        this.spicy = spicy;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getSpicy() {
        return spicy;
    }

    public void setSpicy(String spicy) {
        this.spicy = spicy;
    }

    @Override
    public String toString() {
        return "Menu{" +
                "id=" + id +
                ", number='" + number + '\'' +
                ", name='" + name + '\'' +
                ", size='" + size + '\'' +
                ", category='" + category + '\'' +
                ", price='" + price + '\'' +
                ", spicy='" + spicy + '\'' +
                '}';
    }
}


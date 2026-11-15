package com.example.Restaurant.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

@Entity
public class StoreOrderingSettings {
    @Id public Long id = 1L;
    @Column(nullable = false) public boolean enabled = true;
}

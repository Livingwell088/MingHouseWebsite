package com.example.Restaurant.model;
import jakarta.persistence.*;
import java.time.Instant;
@Entity
public class MailOutbox {
    @Id @GeneratedValue(strategy=GenerationType.AUTO) public Long id;
    public Long orderId;
    public String recipient;
    public String subject;
    @Column(columnDefinition="text") public String body;
    public String audience;
    public int attempts;
    public Instant nextAttempt = Instant.now();
    public Instant sentAt;
    public String lastError;
}

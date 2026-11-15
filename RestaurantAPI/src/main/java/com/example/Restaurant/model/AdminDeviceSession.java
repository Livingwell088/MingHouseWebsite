package com.example.Restaurant.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.time.Instant;

@Entity
public class AdminDeviceSession {
    // Only the SHA-256 digest is stored. The browser receives the random token once.
    @Id @Column(length = 64) public String tokenHash;
    @Column(nullable = false) public String username;
    @Column(nullable = false, length = 64) public String credentialFingerprint;
    @Column(nullable = false) public Instant expiresAt;
}

package com.example.Restaurant.Repository;

import com.example.Restaurant.model.AdminDeviceSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.Instant;

public interface AdminDeviceSessionRepository extends JpaRepository<AdminDeviceSession, String> {
    void deleteAllByUsername(String username);
    void deleteByUsernameAndExpiresAtBefore(String username, Instant now);
}

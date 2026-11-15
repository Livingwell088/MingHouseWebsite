package com.example.Restaurant.Repository;

import com.example.Restaurant.model.StoreOrderingSettings;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface StoreOrderingSettingsRepository extends JpaRepository<StoreOrderingSettings, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select settings from StoreOrderingSettings settings where settings.id = 1")
    Optional<StoreOrderingSettings> lockedSettings();
}

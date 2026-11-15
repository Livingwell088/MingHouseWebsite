package com.example.Restaurant.Service;

import com.example.Restaurant.Repository.StoreOrderingSettingsRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class StoreOrderingService {
    public static final String PAUSED_MESSAGE = "Online ordering is temporarily paused. Please call (508) 756-6888 to place an order.";
    public record Status(boolean enabled, String message) {}
    public static class OrderingPaused extends RuntimeException {}
    private final StoreOrderingSettingsRepository settings;
    public StoreOrderingService(StoreOrderingSettingsRepository settings) {this.settings = settings;}

    @Transactional(readOnly = true)
    public Status status() {
        var current = settings.findById(1L).orElseThrow(this::unavailable);
        return new Status(current.enabled, current.enabled ? "" : PAUSED_MESSAGE);
    }
    public Status update(boolean enabled) {
        var current = settings.lockedSettings().orElseThrow(this::unavailable);
        current.enabled = enabled;
        settings.saveAndFlush(current);
        return new Status(enabled, enabled ? "" : PAUSED_MESSAGE);
    }
    // Held until the order transaction commits. Pause waits for accepted orders to
    // finish, and no new order can be accepted after the pause response returns.
    public void requireEnabled() {
        if (!settings.lockedSettings().orElseThrow(this::unavailable).enabled) throw new OrderingPaused();
    }
    private ResponseStatusException unavailable() {return new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Ordering status unavailable");}
}

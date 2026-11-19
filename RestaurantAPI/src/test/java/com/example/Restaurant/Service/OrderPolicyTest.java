package com.example.Restaurant.Service;

import com.example.Restaurant.model.Menu;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.time.*;
import static org.junit.jupiter.api.Assertions.*;

class OrderPolicyTest {
    final OrderPolicy policy = new OrderPolicy();
    Menu lunch() {Menu item = new Menu(); item.setCategory("Lunch Special"); return item;}
    ZonedDateTime eastern(String instant) {return Instant.parse(instant).atZone(ZoneId.of("America/New_York"));}
    @Test void cutoffUsesEasternTimeInSummerAndWinter() {
        assertDoesNotThrow(()->policy.requireLunchAvailable(lunch(), "ASAP", eastern("2026-11-19T20:59:59Z")));
        assertThrows(ResponseStatusException.class,()->policy.requireLunchAvailable(lunch(), "ASAP", eastern("2026-11-19T21:00:00Z")));
        assertDoesNotThrow(()->policy.requireLunchAvailable(lunch(), "ASAP", eastern("2026-07-19T19:59:59Z")));
        assertThrows(ResponseStatusException.class,()->policy.requireLunchAvailable(lunch(), "ASAP", eastern("2026-07-19T20:00:00Z")));
        assertDoesNotThrow(()->policy.requireLunchAvailable(lunch(), "12:00 PM", eastern("2026-11-19T17:00:00Z")));
        assertThrows(ResponseStatusException.class,()->policy.requireLunchAvailable(lunch(), "5:00 PM", eastern("2026-11-19T17:00:00Z")));
        Menu dinner = new Menu(); dinner.setCategory("All Day Special");
        assertDoesNotThrow(()->policy.requireLunchAvailable(dinner, "ASAP", eastern("2026-11-19T23:00:00Z")));
    }
    @Test void deliveryBoundaryDoesNotApplyToPickup() {
        assertThrows(ResponseStatusException.class,()->policy.requireDeliveryMinimum("Delivery", new BigDecimal("14.99")));
        assertDoesNotThrow(()->policy.requireDeliveryMinimum("Delivery", new BigDecimal("15.00")));
        assertDoesNotThrow(()->policy.requireDeliveryMinimum("Pickup", new BigDecimal("4.25")));
    }
}

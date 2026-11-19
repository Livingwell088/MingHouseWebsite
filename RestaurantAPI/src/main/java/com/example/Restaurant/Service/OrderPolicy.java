package com.example.Restaurant.Service;

import com.example.Restaurant.model.Menu;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class OrderPolicy {
    public ZonedDateTime now() { return ZonedDateTime.now(ZoneId.of("America/New_York")); }

    public void requireLunchAvailable(Menu item, String requestedTime, ZonedDateTime now) {
        if (!"Lunch Special".equalsIgnoreCase(java.util.Objects.toString(item.getCategory(), "").trim())) return;
        boolean closed = !now.toLocalTime().isBefore(LocalTime.of(16, 0));
        if (requestedTime != null && !requestedTime.equalsIgnoreCase("ASAP")) {
            try {
                LocalTime requested = LocalTime.parse(requestedTime.toUpperCase(Locale.US), DateTimeFormatter.ofPattern("h:mm a", Locale.US));
                closed |= !requested.isBefore(LocalTime.of(16, 0));
            } catch (java.time.format.DateTimeParseException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a valid requested time");
            }
        }
        if (closed) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
            "Lunch specials are only available before 4:00 PM Eastern. Remove lunch specials or choose a time before 4:00 PM.");
    }

    public void requireDeliveryMinimum(String type, BigDecimal subtotal) {
        if ("Delivery".equals(type) && subtotal.compareTo(new BigDecimal("15.00")) < 0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Delivery requires a $15.00 item subtotal before tax and delivery fees. Add more items or choose pickup.");
    }
}

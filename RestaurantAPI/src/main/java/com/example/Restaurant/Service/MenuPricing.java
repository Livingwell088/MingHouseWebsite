package com.example.Restaurant.Service;

import com.example.Restaurant.Repository.MenuRepository;
import com.example.Restaurant.model.Menu;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;
import java.util.Set;

@Service
public class MenuPricing {
    @Autowired private MenuRepository menus;
    public Menu menu(String id) {
        if (id == null) throw bad("Menu item required");
        Menu item = menus.findById(id).orElseThrow(() -> bad("Menu item unavailable"));
        if (Boolean.FALSE.equals(item.getAvailable())) throw bad("Menu item unavailable");
        return item;
    }
    public BigDecimal unit(Menu menu) {
        try {
            BigDecimal price = new BigDecimal(menu.getPrice()).setScale(2, RoundingMode.UNNECESSARY);
            if (price.signum() < 0 || price.compareTo(new BigDecimal("10000")) > 0) throw new IllegalArgumentException();
            return price;
        } catch (RuntimeException invalid) { throw bad("Invalid menu price"); }
    }
    public BigDecimal line(Menu menu, int quantity) {
        return line(menu, quantity, null);
    }
    private static final String CHOICE_PREFIX = "Rice/noodle choice: ";
    private static final Map<String, String> SUBSTITUTIONS = Map.ofEntries(
            Map.entry("Pork Fried Rice", "0.00"), Map.entry("Plain Fried Rice", "0.00"),
            Map.entry("Vegetable Fried Rice", "0.00"), Map.entry("Chicken Fried Rice", "1.00"),
            Map.entry("Beef Fried Rice", "1.75"), Map.entry("Shrimp Fried Rice", "1.75"),
            Map.entry("House Special Fried Rice", "1.75"), Map.entry("Plain Lo Mein", "2.00"),
            Map.entry("Vegetable Lo Mein", "2.00"), Map.entry("Pork Lo Mein", "2.75"),
            Map.entry("Chicken Lo Mein", "2.75"), Map.entry("Beef Lo Mein", "2.75"),
            Map.entry("Shrimp Lo Mein", "2.75"));
    public BigDecimal line(Menu menu, int quantity, String instructions) {
        if (quantity < 1 || quantity > 99) throw bad("Quantity must be between 1 and 99");
        String normalized = note(instructions);
        BigDecimal extra = BigDecimal.ZERO;
        if (normalized.startsWith(CHOICE_PREFIX)) {
            if (!Set.of("Lunch Special", "All Day Special", "Special Combination Plates")
                    .contains(java.util.Objects.toString(menu.getCategory(), ""))) throw bad("Substitutions are only available on combo plates");
            String choice = normalized.substring(CHOICE_PREFIX.length()).split("\\R", 2)[0];
            String price = SUBSTITUTIONS.get(choice);
            if (price == null) throw bad("Choose a valid rice or noodle substitution");
            extra = new BigDecimal(price);
        }
        return unit(menu).add(extra).multiply(BigDecimal.valueOf(quantity));
    }
    public String note(String value) {
        if (value != null && value.length() > 2000) throw bad("Instructions are too long");
        return value == null ? "" : value.trim();
    }
    private ResponseStatusException bad(String message) { return new ResponseStatusException(HttpStatus.BAD_REQUEST, message); }
}

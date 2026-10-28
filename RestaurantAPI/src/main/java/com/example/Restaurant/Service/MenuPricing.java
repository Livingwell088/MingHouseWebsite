package com.example.Restaurant.Service;

import com.example.Restaurant.Repository.MenuRepository;
import com.example.Restaurant.model.Menu;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.math.RoundingMode;

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
        if (quantity < 1 || quantity > 99) throw bad("Quantity must be between 1 and 99");
        return unit(menu).multiply(BigDecimal.valueOf(quantity));
    }
    public String note(String value) {
        if (value != null && value.length() > 2000) throw bad("Instructions are too long");
        return value == null ? "" : value.trim();
    }
    private ResponseStatusException bad(String message) { return new ResponseStatusException(HttpStatus.BAD_REQUEST, message); }
}

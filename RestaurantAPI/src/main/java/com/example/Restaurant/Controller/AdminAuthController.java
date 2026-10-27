package com.example.Restaurant.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class AdminAuthController {
    @GetMapping("/admin/session")
    public Map<String, Boolean> session() {
        return Map.of("authenticated", true);
    }
}

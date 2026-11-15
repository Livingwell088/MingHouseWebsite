package com.example.Restaurant.Controller;

import com.example.Restaurant.Service.StoreOrderingService;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.security.Principal;

@RestController
public class StoreOrderingController {
    private final StoreOrderingService ordering;
    public StoreOrderingController(StoreOrderingService ordering) {this.ordering = ordering;}
    public record Update(Boolean enabled) {}

    @GetMapping({"/store/ordering", "/admin/ordering"})
    public ResponseEntity<StoreOrderingService.Status> status() {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(ordering.status());
    }
    @PutMapping("/admin/ordering")
    public ResponseEntity<StoreOrderingService.Status> update(@RequestBody Update update, Principal admin) {
        if (update.enabled() == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        var status = ordering.update(update.enabled());
        org.slf4j.LoggerFactory.getLogger(getClass()).info("Admin {} set online ordering to {}", admin.getName(), status.enabled());
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(status);
    }
}

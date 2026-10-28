package com.example.Restaurant.Controller;

import com.example.Restaurant.Repository.MailOutboxRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/admin/notifications")
public class MailOutboxController {
    private final MailOutboxRepository repository;
    public MailOutboxController(MailOutboxRepository repository) { this.repository=repository; }
    public record Status(Long id, Long orderId, String audience, int attempts, Instant sentAt, String status, String error) {}
    @GetMapping public List<Status> status() {
        return repository.findAll().stream().map(m -> new Status(m.id,m.orderId,m.audience,m.attempts,m.sentAt,
                m.sentAt != null ? "Sent" : m.attempts >= 8 ? "Failed" : m.attempts == 0 ? "Queued" : "Retrying",m.lastError)).toList();
    }
    @PostMapping("/{id}/retry") @Transactional public void retry(@PathVariable Long id) {
        var mail=repository.lock(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (mail.sentAt != null) throw new ResponseStatusException(HttpStatus.CONFLICT,"This email was already sent");
        mail.attempts=0; mail.lastError=null; mail.nextAttempt=Instant.now();
    }
}

package com.example.Restaurant.Service;
import com.example.Restaurant.Repository.MailOutboxRepository;
import com.example.Restaurant.model.MailOutbox;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
@Service
public class MailDelivery {
    private final MailOutboxRepository repository;
    private final EmailService email;
    public MailDelivery(MailOutboxRepository repository, EmailService email) { this.repository=repository; this.email=email; }
    @Transactional public void deliver(Long id) {
        MailOutbox mail=repository.lock(id).orElseThrow();
        if (mail.sentAt != null || mail.attempts >= 8 || mail.nextAttempt.isAfter(Instant.now())) return;
        mail.attempts++;
        try { email.sendEmail(mail.recipient,mail.subject,mail.body); mail.sentAt=Instant.now(); mail.lastError=null; }
        catch (RuntimeException e) {
            mail.lastError="Email delivery failed; check mail-provider settings and retry.";
            mail.nextAttempt=Instant.now().plusSeconds(Math.min(3600,30L << (mail.attempts-1)));
            org.slf4j.LoggerFactory.getLogger(MailDelivery.class).warn("Order {} {} email attempt {} failed",mail.orderId,mail.audience,mail.attempts);
        }
    }
}

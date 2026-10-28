package com.example.Restaurant.Service;
import com.example.Restaurant.Repository.MailOutboxRepository;
import org.springframework.stereotype.Component;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import java.time.Instant;
@Component
@ConditionalOnProperty(name="restaurant.mail.worker-enabled",havingValue="true",matchIfMissing=true)
public class MailWorker {
    private final MailOutboxRepository repository; private final MailDelivery delivery;
    public MailWorker(MailOutboxRepository repository,MailDelivery delivery) { this.repository=repository; this.delivery=delivery; }
    @Scheduled(fixedDelayString="${restaurant.mail.poll-ms:15000}") public void poll() {
        for (var mail:repository.findTop20BySentAtIsNullAndAttemptsLessThanAndNextAttemptLessThanEqualOrderById(8,Instant.now())) {
            try { delivery.deliver(mail.id); } catch (RuntimeException e) { org.slf4j.LoggerFactory.getLogger(MailWorker.class).warn("Outbox attempt deferred for message {}",mail.id); }
        }
    }
}

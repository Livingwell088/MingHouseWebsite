package com.example.Restaurant.Repository;
import com.example.Restaurant.model.MailOutbox;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.time.Instant;
import java.util.*;
public interface MailOutboxRepository extends JpaRepository<MailOutbox,Long> {
    List<MailOutbox> findTop20BySentAtIsNullAndAttemptsLessThanAndNextAttemptLessThanEqualOrderById(int attempts, Instant now);
    @Lock(LockModeType.PESSIMISTIC_WRITE) @Query("select m from MailOutbox m where m.id = :id")
    Optional<MailOutbox> lock(@Param("id") Long id);
}

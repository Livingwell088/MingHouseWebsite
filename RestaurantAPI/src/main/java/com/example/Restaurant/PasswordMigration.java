package com.example.Restaurant;
import com.example.Restaurant.Repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/** Opt-in release migration. Never logs a username or password. */
@Component
@ConditionalOnProperty(name="restaurant.security.migrate-passwords",havingValue="true")
public class PasswordMigration implements ApplicationRunner {
    private final UserRepository users;
    private final BCryptPasswordEncoder encoder;
    public PasswordMigration(UserRepository users,BCryptPasswordEncoder encoder) { this.users=users; this.encoder=encoder; }
    @Override @Transactional public void run(ApplicationArguments args) {
        int count=0;
        for (var user:users.findAll()) {
            String password=user.getPassword();
            if (!user.isGuest() && password!=null && !password.isEmpty() && !password.matches("^\\$2[aby]\\$.*")) {
                if (password.getBytes(java.nio.charset.StandardCharsets.UTF_8).length>72)
                    throw new IllegalStateException("A legacy password exceeds BCrypt's byte limit; reset that account before migration");
                user.setPassword(encoder.encode(password)); count++;
            }
        }
        users.flush();
        org.slf4j.LoggerFactory.getLogger(PasswordMigration.class).info("Legacy password migration completed: {} accounts",count);
    }
}

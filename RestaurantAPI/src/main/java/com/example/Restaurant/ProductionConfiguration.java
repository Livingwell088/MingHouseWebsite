package com.example.Restaurant;
import org.springframework.context.annotation.*;
import org.springframework.beans.factory.annotation.Value;
/** A production startup must never fall back to ephemeral customer credentials. */
@Configuration @Profile("production")
public class ProductionConfiguration {
    public ProductionConfiguration(@Value("${restaurant.security.signing-secret:}") String secret,
            @Value("${restaurant.admin.password-hash:}") String hash) {
        if (secret.length()<32 || !hash.matches("^\\$2[aby]\\$.*"))
            throw new IllegalStateException("Production requires a stable customer signing secret and a BCrypt admin password hash");
    }
}

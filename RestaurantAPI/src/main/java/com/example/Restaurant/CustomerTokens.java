package com.example.Restaurant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

/** Signed, expiring credentials. A customer/cart ID alone is never a credential. */
@Service
public class CustomerTokens {
    private final byte[] key;
    public CustomerTokens(@Value("${restaurant.security.signing-secret:}") String configured) {
        if (!configured.isBlank() && configured.length() < 32) throw new IllegalStateException("Signing secret must have at least 32 characters");
        key = configured.isBlank() ? new byte[32] : configured.getBytes(StandardCharsets.UTF_8);
        if (configured.isBlank()) new SecureRandom().nextBytes(key);
    }
    public String issue(String user) {
        String payload = Base64.getUrlEncoder().withoutPadding().encodeToString(user.getBytes(StandardCharsets.UTF_8))
                + "." + Instant.now().plusSeconds(43200).getEpochSecond() + "." + UUID.randomUUID();
        return payload + "." + sign(payload);
    }
    public String verify(String token) {
        if (token == null || token.length() > 2048) return null;
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 4) return null;
            String payload = parts[0] + "." + parts[1] + "." + parts[2];
            if (!MessageDigest.isEqual(sign(payload).getBytes(StandardCharsets.US_ASCII), parts[3].getBytes(StandardCharsets.US_ASCII))) return null;
            if (Long.parseLong(parts[1]) <= Instant.now().getEpochSecond()) return null;
            return new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
        } catch (RuntimeException invalid) { return null; }
    }
    private String sign(String payload) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key, "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception error) { throw new IllegalStateException("Unable to sign credential", error); }
    }
}

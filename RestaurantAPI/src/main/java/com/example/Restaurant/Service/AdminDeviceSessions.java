package com.example.Restaurant.Service;

import com.example.Restaurant.Repository.AdminDeviceSessionRepository;
import com.example.Restaurant.model.AdminDeviceSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;

@Service
@Transactional
public class AdminDeviceSessions {
    private final AdminDeviceSessionRepository sessions;
    private final String username;
    private final String passwordHash;
    private final SecureRandom random = new SecureRandom();
    public record IssuedDevice(String token, Instant expiresAt) {}

    public AdminDeviceSessions(AdminDeviceSessionRepository sessions,
            @Value("${restaurant.admin.username:admin}") String username,
            @Value("${restaurant.admin.password-hash:}") String passwordHash) {
        this.sessions = sessions;
        this.username = username;
        this.passwordHash = passwordHash;
    }

    public IssuedDevice issue(String authenticatedUsername) {
        if (passwordHash.isBlank() || !username.equals(authenticatedUsername)) throw new IllegalArgumentException("Invalid admin");
        sessions.deleteByUsernameAndExpiresAtBefore(username, Instant.now());
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        var session = new AdminDeviceSession();
        session.tokenHash = digest(token);
        session.username = username;
        session.credentialFingerprint = digest(passwordHash);
        session.expiresAt = Instant.now().plus(Duration.ofDays(30));
        sessions.saveAndFlush(session);
        return new IssuedDevice(token, session.expiresAt);
    }

    @Transactional(readOnly = true)
    public String verify(String token) {
        if (passwordHash.isBlank() || token == null || !token.matches("[A-Za-z0-9_-]{43}")) return null;
        return sessions.findById(digest(token))
                .filter(s -> username.equals(s.username) && s.expiresAt.isAfter(Instant.now())
                        && digest(passwordHash).equals(s.credentialFingerprint))
                .map(s -> s.username).orElse(null);
    }

    public void revoke(String token, String authenticatedUsername) {
        if (token == null || token.length() != 43) return;
        sessions.findById(digest(token)).filter(s -> s.username.equals(authenticatedUsername)).ifPresent(sessions::delete);
    }

    public void revokeAll(String authenticatedUsername) {
        sessions.deleteAllByUsername(authenticatedUsername);
    }

    private static String digest(String value) {
        try {return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));}
        catch (java.security.NoSuchAlgorithmException impossible) {throw new IllegalStateException(impossible);}
    }
}

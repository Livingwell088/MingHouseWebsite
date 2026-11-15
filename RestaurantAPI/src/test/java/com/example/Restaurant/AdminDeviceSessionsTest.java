package com.example.Restaurant;

import com.example.Restaurant.Repository.AdminDeviceSessionRepository;
import com.example.Restaurant.Service.AdminDeviceSessions;
import com.example.Restaurant.Service.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import java.time.Duration;
import java.time.Instant;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties={"spring.datasource.url=jdbc:h2:mem:admin-device-tests;MODE=PostgreSQL;DB_CLOSE_DELAY=-1"})
@AutoConfigureMockMvc
class AdminDeviceSessionsTest {
    private static final String HASH = new BCryptPasswordEncoder().encode("device-tests-only");
    @DynamicPropertySource static void admin(DynamicPropertyRegistry registry) {
        registry.add("restaurant.admin.password-hash", () -> HASH);
    }
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired AdminDeviceSessionRepository sessions;
    @Autowired AdminDeviceSessions devices;
    @MockBean EmailService email;
    @BeforeEach void reset() {sessions.deleteAll();}

    private String remember() throws Exception {
        String body = mvc.perform(post("/admin/devices").with(httpBasic("admin", "device-tests-only"))
                .header("X-Admin-Request", "true"))
                .andExpect(status().isOk()).andExpect(header().string("Cache-Control", "no-store"))
                .andReturn().getResponse().getContentAsString();
        var result = json.readTree(body);
        long days = Duration.between(Instant.now(), Instant.parse(result.get("expiresAt").asText())).toDays();
        assertTrue(days >= 29 && days <= 30);
        return result.get("token").asText();
    }

    @Test void rememberedTokenWorksAfterServiceRecreationAndOnlyDigestIsStored() throws Exception {
        String token = remember();
        assertEquals(43, token.length());
        var record = sessions.findAll().get(0);
        assertEquals(64, record.tokenHash.length()); assertNotEquals(token, record.tokenHash);
        assertEquals("admin", new AdminDeviceSessions(sessions, "admin", HASH).verify(token));
        mvc.perform(get("/admin/session").header("X-Admin-Token", token))
                .andExpect(status().isOk()).andExpect(jsonPath("$.authenticated").value(true));
        mvc.perform(get("/orders/getAllOrders").header("X-Admin-Token", token)).andExpect(status().isOk());
    }

    @Test void expiredForgedAndPasswordRotatedTokensAreRejected() throws Exception {
        String token = remember();
        assertNull(new AdminDeviceSessions(sessions, "admin", "changed-password-hash").verify(token));
        assertNull(new AdminDeviceSessions(sessions, "admin", "").verify(token));
        assertNull(new AdminDeviceSessions(sessions, "different-admin", HASH).verify(token));
        mvc.perform(get("/admin/session").header("X-Admin-Token", "A".repeat(43))).andExpect(status().isUnauthorized());
        var record = sessions.findAll().get(0); record.expiresAt = Instant.now().minusSeconds(1); sessions.saveAndFlush(record);
        mvc.perform(get("/admin/session").header("X-Admin-Token", token)).andExpect(status().isUnauthorized());
    }

    @Test void logoutRevokesOnlyCurrentDevice() throws Exception {
        String first = remember(), second = remember();
        mvc.perform(post("/admin/devices/logout").header("X-Admin-Token", first).header("X-Admin-Request", "true")).andExpect(status().isOk());
        mvc.perform(get("/admin/session").header("X-Admin-Token", first)).andExpect(status().isUnauthorized());
        mvc.perform(get("/admin/session").header("X-Admin-Token", second)).andExpect(status().isOk());
    }

    @Test void signOutAllInvalidatesEveryRememberedDevice() throws Exception {
        String first = remember(), second = remember();
        mvc.perform(post("/admin/devices/revoke-all").header("X-Admin-Token", first).header("X-Admin-Request", "true")).andExpect(status().isOk());
        for (String token : new String[]{first, second}) mvc.perform(get("/admin/session").header("X-Admin-Token", token)).andExpect(status().isUnauthorized());
        assertEquals(0, sessions.count());
    }

    @Test void tokensCannotMintMoreTokensAndMutationsStillRequireExplicitHeader() throws Exception {
        String token = remember();
        mvc.perform(post("/admin/devices")).andExpect(status().isUnauthorized());
        mvc.perform(post("/admin/devices").header("X-Admin-Token", token).header("X-Admin-Request", "true")).andExpect(status().isForbidden());
        mvc.perform(post("/admin/devices/revoke-all").header("X-Admin-Token", token)).andExpect(status().isForbidden());
        assertEquals("admin", devices.verify(token));
    }
}

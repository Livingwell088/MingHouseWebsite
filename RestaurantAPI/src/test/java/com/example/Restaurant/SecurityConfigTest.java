package com.example.Restaurant;

import com.example.Restaurant.Controller.*;
import com.example.Restaurant.Service.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@WebMvcTest({AdminAuthController.class, OrderController.class, UserController.class, MenuController.class, CartController.class})
@Import({SecurityConfig.class, WebConfig.class})
class SecurityConfigTest {
    @Autowired MockMvc mvc;
    @MockBean OrderService orders;
    @MockBean UserService users;
    @MockBean MenuService menu;
    @MockBean CartService cart;

    @DynamicPropertySource
    static void credentials(DynamicPropertyRegistry registry) {
        registry.add("restaurant.admin.password-hash", () -> new BCryptPasswordEncoder().encode("test-only-secret"));
    }

    @Test void menuRemainsPublic() throws Exception {
        mvc.perform(get("/menu/getMenu")).andExpect(status().isOk());
    }

    @Test void adminIsDisabledWithoutConfiguredHash() {
        assertThrows(UsernameNotFoundException.class,
                () -> new SecurityConfig().adminUsers("admin", "").loadUserByUsername("admin"));
    }

    @Test void anonymousMenuChangesAreRejectedBeforeReachingService() throws Exception {
        mvc.perform(put("/menu/edit").contentType("application/json").content("{}"))
                .andExpect(status().isUnauthorized());
        mvc.perform(post("/menu/add").contentType("application/json").content("{}"))
                .andExpect(status().isUnauthorized());
        verifyNoInteractions(menu);
    }

    @Test void privateListsCannotBeReadAnonymously() throws Exception {
        for (String path : new String[]{"/orders/getAllOrders", "/users/getAllUsers", "/carts/getAllItems", "/carts/getAllCart", "/admin/session"}) {
            mvc.perform(get(path)).andExpect(status().isUnauthorized());
        }
        verifyNoInteractions(orders, users, cart);
    }

    @Test void oldPasswordAndBrowserFlagCannotAuthenticate() throws Exception {
        mvc.perform(get("/admin/session").with(httpBasic("admin", "your-temp-password")))
                .andExpect(status().isUnauthorized());
        mvc.perform(get("/admin/session").header("adminLoggedIn", "true"))
                .andExpect(status().isUnauthorized());
    }

    @Test void correctCredentialsAuthenticate() throws Exception {
        mvc.perform(get("/admin/session").with(httpBasic("admin", "test-only-secret")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.authenticated").value(true));
        mvc.perform(get("/orders/getAllOrders").with(httpBasic("admin", "test-only-secret")))
                .andExpect(status().isOk());
    }

    @Test void destructiveRequestsRequireAuthAndExplicitAdminHeader() throws Exception {
        mvc.perform(post("/users/deleteAll")).andExpect(status().isUnauthorized());
        mvc.perform(post("/users/deleteAll").with(httpBasic("admin", "test-only-secret")))
                .andExpect(status().isForbidden());
        verifyNoInteractions(users);
        mvc.perform(post("/users/deleteAll").with(httpBasic("admin", "test-only-secret"))
                        .header("X-Admin-Request", "true")).andExpect(status().isOk());
        verify(users).deleteAllUsers();
    }

    @Test void disallowedOriginCannotPreflightAdminRequests() throws Exception {
        mvc.perform(options("/menu/edit").header("Origin", "https://untrusted.example")
                        .header("Access-Control-Request-Method", "PUT"))
                .andExpect(status().isForbidden());
    }
}

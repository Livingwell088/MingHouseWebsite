package com.example.Restaurant;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

@Configuration
public class SecurityConfig {
    @Bean
    BCryptPasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    UserDetailsService adminUsers(@Value("${restaurant.admin.username:admin}") String username,
                                 @Value("${restaurant.admin.password-hash:}") String hash) {
        // No hardcoded password and no fallback account when configuration is absent.
        return requested -> {
            if (hash.isBlank() || !requested.equals(username)) {
                throw new UsernameNotFoundException("Invalid credentials");
            }
            return User.withUsername(username).password(hash).roles("ADMIN").build();
        };
    }

    @Bean
    SecurityFilterChain apiSecurity(HttpSecurity http, UserDetailsService users,
                                   BCryptPasswordEncoder encoder) throws Exception {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(users);
        provider.setPasswordEncoder(encoder);
        http.authenticationProvider(provider)
                .cors(cors -> {})
                // This API uses explicit Authorization headers, never cookie authentication.
                // The custom header below also blocks browser-form CSRF with cached Basic auth.
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .requestCache(cache -> cache.disable())
                .formLogin(form -> form.disable())
                .logout(logout -> logout.disable())
                .httpBasic(basic -> basic.authenticationEntryPoint((request, response, exception) ->
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED)))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/admin/**", "/users/getAllUsers", "/users/delete/**", "/users/deleteAll",
                                "/orders/getAllOrders", "/orders/deleteAll", "/carts/getAllItems", "/carts/getAllCart")
                            .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/orders/*/status").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/menu/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/menu/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/**").hasRole("ADMIN")
                        // Existing guest flows are retained for this first pass. Ownership
                        // checks for individual cart/user/order routes are a separate phase.
                        .anyRequest().permitAll());
        http.addFilterAfter(new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(jakarta.servlet.http.HttpServletRequest request,
                                            jakarta.servlet.http.HttpServletResponse response,
                                            jakarta.servlet.FilterChain chain)
                    throws java.io.IOException, jakarta.servlet.ServletException {
                String method = request.getMethod();
                boolean mutation = !java.util.Set.of("GET", "HEAD", "OPTIONS").contains(method);
                var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
                if (mutation && auth != null && auth.getAuthorities().stream()
                        .anyMatch(role -> role.getAuthority().equals("ROLE_ADMIN"))
                        && !"true".equals(request.getHeader("X-Admin-Request"))) {
                    response.sendError(HttpServletResponse.SC_FORBIDDEN);
                    return;
                }
                chain.doFilter(request, response);
            }
        }, BasicAuthenticationFilter.class);
        return http.build();
    }
}

//package com.example.securingweb;
//
//
//import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.core.session.SessionRegistry;
//import org.springframework.security.core.session.SessionRegistryImpl;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.session.HttpSessionEventPublisher;
//
//@Configuration
//@EnableWebSecurity
//public class WebSecurityConfig {
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
////, "/menuPage", "/cartPage"
//        http.authorizeHttpRequests((requests) ->
//                requests.requestMatchers("/", "/home", "/login", "/menupage")
//                        .permitAll()
//                        .anyRequest().authenticated())
//                .sessionManagement((session) ->
//                        session.sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
//                                .maximumSessions(1)
//                                .expiredUrl("/home?expired")
//                                .maxSessionsPreventsLogin(true));
//
//
//
//        return http.build();
//    }
//
//
//    @Bean
//    public SessionRegistry sessionRegistry() {
//        return new SessionRegistryImpl();
//    }
//
//    @Bean
//    public ServletListenerRegistrationBean<HttpSessionEventPublisher> httpSessionEventPublisher() {
//
//        return new ServletListenerRegistrationBean<>(new HttpSessionEventPublisher());
//    }
//
//
//
//
////    protected void configure(HttpSecurity http) throws Exception {
////        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.ALWAYS);
////    }
//}

package com.example.Restaurant;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class Ownership {
    @org.springframework.beans.factory.annotation.Autowired private CustomerTokens tokens;
    public String current() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_CUSTOMER")))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Customer sign-in required");
        return auth.getName();
    }
    public boolean admin() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
    public void require(String owner) {
        if (admin()) return;
        if (owner == null || !current().equals(owner)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
    }
    public void requireGuestSource(String owner) {
        if (admin()) return;
        var attributes = (org.springframework.web.context.request.ServletRequestAttributes)
                org.springframework.web.context.request.RequestContextHolder.getRequestAttributes();
        String token = attributes == null ? null : attributes.getRequest().getHeader("X-Guest-Token");
        if (owner == null || !owner.startsWith("Guest-") || !owner.equals(tokens.verify(token)))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Guest cart credential required");
    }
}

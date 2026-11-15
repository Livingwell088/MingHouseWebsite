package com.example.Restaurant.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import com.example.Restaurant.Service.AdminDeviceSessions;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.security.Principal;
import java.util.Map;

@RestController
public class AdminAuthController {
    private final AdminDeviceSessions devices;
    public AdminAuthController(AdminDeviceSessions devices) {this.devices = devices;}

    @GetMapping("/admin/session")
    public ResponseEntity<Map<String, Boolean>> session() {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(Map.of("authenticated", true));
    }

    @PostMapping("/admin/devices")
    public ResponseEntity<AdminDeviceSessions.IssuedDevice> remember(Principal principal,
            @RequestHeader(value="Authorization", defaultValue="") String authorization) {
        // Remembering another device requires the password, not an existing device token.
        if (!authorization.regionMatches(true, 0, "Basic ", 0, 6)) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(devices.issue(principal.getName()));
    }

    @PostMapping("/admin/devices/logout")
    public void logout(Principal principal, @RequestHeader(value="X-Admin-Token", required=false) String token) {
        devices.revoke(token, principal.getName());
    }

    @PostMapping("/admin/devices/revoke-all")
    public void revokeAll(Principal principal) {
        devices.revokeAll(principal.getName());
    }
}

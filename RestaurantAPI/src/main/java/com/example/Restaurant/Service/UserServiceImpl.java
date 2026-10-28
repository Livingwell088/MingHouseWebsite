package com.example.Restaurant.Service;

import com.example.Restaurant.Ownership;
import com.example.Restaurant.Repository.UserRepository;
import com.example.Restaurant.model.StoreUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired private UserRepository userRepository;
    @Autowired private BCryptPasswordEncoder encoder;
    @Autowired private Ownership ownership;

    @Transactional
    public StoreUser addUser(StoreUser user) {
        if (user.getUsernameId() == null || !user.getUsernameId().matches("[A-Za-z0-9_@.\\-]{3,100}"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid username");
        if (user.isGuest()) {
            ownership.require(user.getUsernameId());
            StoreUser existing = userRepository.findById(user.getUsernameId()).orElseThrow();
            if (!existing.isGuest()) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            return updateContact(user);
        }
        if (user.getUsernameId().startsWith("Guest-")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reserved username");
        if (userRepository.existsById(user.getUsernameId())) throw new ResponseStatusException(HttpStatus.CONFLICT, "Username unavailable");
        String password = user.getPassword();
        if (password == null || password.length() < 8 || password.getBytes(StandardCharsets.UTF_8).length > 72)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be 8–72 bytes");
        user.setPassword(encoder.encode(password));
        user.setFirstName(limited(user.getFirstName(), 100));
        user.setLastName(limited(user.getLastName(), 100));
        user.setEmail(limited(user.getEmail(), 254));
        StoreUser saved = userRepository.saveAndFlush(user);
        com.example.Restaurant.model.Cart cart = new com.example.Restaurant.model.Cart();
        cart.setCart_Id(saved.getUsernameId());
        carts.saveAndFlush(cart);
        return saved;
    }

    @Transactional
    public StoreUser updateContact(StoreUser contact) {
        ownership.require(contact.getUsernameId());
        StoreUser current = userRepository.findById(contact.getUsernameId()).orElseThrow();
        current.setFirstName(limited(contact.getFirstName(), 100));
        current.setLastName(limited(contact.getLastName(), 100));
        current.setEmail(limited(contact.getEmail(), 254));
        return userRepository.saveAndFlush(current);
    }

    @Transactional
    public String validateUser(String id, String password) {
        var found = id == null ? java.util.Optional.<StoreUser>empty() : userRepository.findById(id);
        if (found.isEmpty() || found.get().isGuest() || password == null || password.getBytes(StandardCharsets.UTF_8).length > 72) return "Incorrect Password";
        StoreUser user = found.get();
        String stored = user.getPassword();
        if (stored == null || stored.isEmpty()) return "Incorrect Password";
        boolean hashed = stored.matches("^\\$2[aby]\\$.*");
        boolean matches = hashed ? encoder.matches(password, stored) : MessageDigest.isEqual(password.getBytes(StandardCharsets.UTF_8), stored.getBytes(StandardCharsets.UTF_8));
        if (!matches) return "Incorrect Password";
        if (!hashed) { user.setPassword(encoder.encode(password)); userRepository.saveAndFlush(user); }
        return "Match";
    }
    private String limited(String value, int length) {
        if (value != null && value.length() > length) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Contact field too long");
        return value == null ? "" : value.trim();
    }
    public List<StoreUser> getAllUsers() { return userRepository.findAll(); }
    public StoreUser getUserById(String id) { ownership.require(id); return userRepository.findById(id).orElseGet(StoreUser::new); }
    public void deleteUserById(String id) { userRepository.deleteById(id); }
    public void deleteAllUsers() { userRepository.deleteAll(); }
    @Autowired private com.example.Restaurant.Repository.CartRepository carts;
}

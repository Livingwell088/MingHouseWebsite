package com.example.Restaurant.Controller;


import com.example.Restaurant.Service.UserService;
import com.example.Restaurant.model.StoreUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.example.Restaurant.Ownership;
import com.example.Restaurant.CustomerTokens;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping(path = "/users")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = {
        "https://minghousema.com",
        "https://www.minghousema.com"
})

public class UserController {

    @Autowired
    private UserService userService;
    @Autowired private Ownership ownership;
    @Autowired private CustomerTokens tokens;


    @GetMapping(path = "/getAllUsers")
    public List<StoreUser> getAllUsers() {

        return userService.getAllUsers();
    }

    @GetMapping(path = "/getUser/{userId}")
    public StoreUser getUserById(@PathVariable String userId){
        ownership.require(userId);
        return userService.getUserById(userId);
    }


    @PostMapping(path = "/add")
    public String addUser(@RequestBody StoreUser storeUser) {
        return userService.addUser(storeUser).getUsernameId();
    }

    @PostMapping(path = "/validate")
    public String validate(@RequestBody StoreUser storeUser, HttpServletResponse response){

        String result = userService.validateUser(storeUser.getUsernameId(), storeUser.getPassword());
        if ("Match".equals(result)) response.setHeader("X-Customer-Token", tokens.issue(storeUser.getUsernameId()));
        return result;
    }

    @GetMapping("/me")
    public StoreUser me() { return userService.getUserById(ownership.current()); }

    @PutMapping("/contact")
    public StoreUser updateContact(@RequestBody StoreUser contact) {
        ownership.require(contact.getUsernameId());
        return userService.updateContact(contact);
    }

    @PostMapping(path = "/delete/{userId}")
    public void deleteUser(@PathVariable String  userId){
        userService.deleteUserById(userId);
    }

    @PostMapping(path = "/deleteAll")
    public void deleteAllUsers(){
        userService.deleteAllUsers();
    }


}

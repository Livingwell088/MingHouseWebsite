package com.example.Restaurant.Controller;


import com.example.Restaurant.Service.UserService;
import com.example.Restaurant.model.StoreUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;


    @GetMapping(path = "/getAllUsers")
    public List<StoreUser> getAllUsers() {

        return userService.getAllUsers();
    }

    @GetMapping(path = "/getUser/{userId}")
    public StoreUser getUserById(@PathVariable String userId){
        return userService.getUserById(userId);
    }


    @PostMapping(path = "/add")
    public String addUser(@RequestBody StoreUser storeUser) {
        return userService.addUser(storeUser).getUsernameId();
    }

    @PostMapping(path = "/validate")
    public String validate(@RequestBody StoreUser storeUser){

        System.out.println(storeUser);
//        System.out.println(pass);

        return userService.validateUser(storeUser.getUsernameId(), storeUser.getPassword());
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

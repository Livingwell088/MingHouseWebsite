package com.example.Restaurant.Service;


import com.example.Restaurant.model.StoreUser;

import java.util.List;

public interface UserService {

    public StoreUser addUser(StoreUser storeUser);

    public List<StoreUser> getAllUsers();

    public String validateUser(String user, String pass);

    public StoreUser getUserById(String id);

    public void deleteUserById(String id);

    public void deleteAllUsers();
}

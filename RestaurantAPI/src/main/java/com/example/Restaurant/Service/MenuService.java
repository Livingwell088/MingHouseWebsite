package com.example.Restaurant.Service;

import com.example.Restaurant.model.Menu;

import java.util.List;

public interface MenuService {

    public Menu saveMenu(Menu menu);
    public List<Menu> getAllMenu();

    public void deleteMenu();

    List<Menu> findAllMenuByNumber(String menuNumber);

}

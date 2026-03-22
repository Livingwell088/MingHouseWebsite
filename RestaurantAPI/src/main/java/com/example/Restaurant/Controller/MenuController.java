package com.example.Restaurant.Controller;


import com.example.Restaurant.Repository.MenuRepository;
import com.example.Restaurant.Service.MenuService;
import com.example.Restaurant.Service.MenuServiceImpl;
import com.example.Restaurant.model.Menu;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(path = "/menu")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = {
        "https://minghousema.com",
        "https://www.minghousema.com"
})

public class MenuController {

//    public MenuRepository menuRepository;

    @GetMapping("/test")
    public String test() {
        return "NEW CODE DEPLOYED";
    }

    @Autowired
    private MenuService menuService;

    @PostMapping(path = "/add")
    public String add(@RequestBody Menu menu){
        menuService.saveMenu(menu);

        return "New Menu Item Added!";
    }



    @GetMapping(path = "/getMenu")
    public List<Menu> getAllMenu(){

        return menuService.getAllMenu();
    }


    @GetMapping(path = "numbers/{menuNumber}")
    public List<Menu> getMenuByNumber(@PathVariable String menuNumber) {
        return menuService.findAllMenuByNumber(menuNumber);
    }
}

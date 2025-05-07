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
@CrossOrigin(origins = "http://localhost:3000")
public class MenuController {

//    public MenuRepository menuRepository;

    @Autowired
    private MenuService menuService;

    @PostMapping(path = "/add")
    public String add(@RequestBody Menu menu){
        menuService.saveMenu(menu);

        return "New Menu Item Added!";
    }

    @GetMapping(path = "/getMenu")
    public List<Menu> getAllMenu(){
//        menuService.deleteMenu();

        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader("C:/Users/nickl/OneDrive/Desktop/Personal Projects/Rest/RestaurantAPI/src/main/java/com/example/Restaurant/data/menu1.csv"));
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        List<String> lines = new ArrayList<>();
        String line = null;
        while (true) {
            try {
                if (!((line = reader.readLine()) != null)) break;
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
//            System.out.println(line);
            String[] split = line.split(";");
            Menu current = new Menu(split[0], split[1], split[2], split[3], split[4], split[5], split[6] );
            add(current);
        }

//        System.out.println(lines.get(0));
        return menuService.getAllMenu();
    }


    @GetMapping(path = "numbers/{menuNumber}")
    public List<Menu> getMenuByNumber(@PathVariable String menuNumber) {
        return menuService.findAllMenuByNumber(menuNumber);
    }
}

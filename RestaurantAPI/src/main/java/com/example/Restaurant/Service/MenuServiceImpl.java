package com.example.Restaurant.Service;

import com.example.Restaurant.Repository.MenuRepository;
import com.example.Restaurant.model.Menu;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuServiceImpl implements MenuService{

    @Autowired
    private MenuRepository menuRepository;

    @Override
    public Menu saveMenu(Menu menu) {
        return menuRepository.save(menu);
    }

    @Override
    public List<Menu> getAllMenu() {
        return menuRepository.findAll();
    }

    public void deleteMenu() {
        menuRepository.deleteAll();
    }

    public List<Menu> findAllMenuByNumber(String menuNumber) {
        return menuRepository.findAllMenuByNumber(menuNumber);
    }
}

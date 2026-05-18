package com.example.Restaurant.Service;

import com.example.Restaurant.Repository.MenuRepository;
import com.example.Restaurant.model.Menu;
import jakarta.persistence.EntityNotFoundException;
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

    @Override
    public Menu updateMenuItem(Menu updatedItem) {

        Menu currentItem = menuRepository.findById(updatedItem.getId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Menu item not found with id: " + updatedItem.getId()
                ));

        currentItem.setNumber(updatedItem.getNumber());
        currentItem.setName(updatedItem.getName());
        currentItem.setSize(updatedItem.getSize());
        currentItem.setCategory(updatedItem.getCategory());
        currentItem.setPrice(updatedItem.getPrice());
        currentItem.setSpicy(updatedItem.getSpicy());
        currentItem.setAvailable(updatedItem.getAvailable());

        return menuRepository.saveAndFlush(currentItem);
    }
}

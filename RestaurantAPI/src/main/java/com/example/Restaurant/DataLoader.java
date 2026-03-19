package com.example.Restaurant;


import com.example.Restaurant.Repository.MenuRepository;
import com.example.Restaurant.model.Menu;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner startMenu(MenuRepository menuRepository) {
        return args -> {

            if (menuRepository.count() == 0){

                String currentDirectory = System.getProperty("user.dir");
                System.out.println("Current directory: " + currentDirectory);

                BufferedReader reader = null;
                try {
//            reader = new BufferedReader(new FileReader("C:/Users/nickl/OneDrive/Desktop/Personal Projects/Rest/RestaurantAPI/src/main/java/com/example/Restaurant/data/menu1.csv"));
                    reader = new BufferedReader(new FileReader("./src/main/java/com/example/Restaurant/data/menu1.csv"));
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

                    menuRepository.save(current);

                }
            }

        };
    }
}

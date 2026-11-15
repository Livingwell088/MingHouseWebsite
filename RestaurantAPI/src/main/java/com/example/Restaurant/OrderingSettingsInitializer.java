package com.example.Restaurant;

import com.example.Restaurant.Repository.StoreOrderingSettingsRepository;
import com.example.Restaurant.model.StoreOrderingSettings;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class OrderingSettingsInitializer implements ApplicationRunner {
    private final StoreOrderingSettingsRepository settings;
    public OrderingSettingsInitializer(StoreOrderingSettingsRepository settings) {this.settings = settings;}
    public void run(ApplicationArguments args) {
        // Production migration creates this singleton. This also initializes local H2 previews.
        if (!settings.existsById(1L)) settings.saveAndFlush(new StoreOrderingSettings());
    }
}

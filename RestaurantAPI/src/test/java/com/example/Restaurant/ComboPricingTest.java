package com.example.Restaurant;
import com.example.Restaurant.Service.MenuPricing;
import com.example.Restaurant.model.Menu;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;
class ComboPricingTest {
    @Test void allSubstitutionPricesAreCalculatedPerPlate() {
        var pricing=new MenuPricing();
        var menu=new Menu("test","C1","Combo","","Special Combination Plates","10.00","0");
        var extras=Map.ofEntries(Map.entry("Plain Fried Rice","0.00"),Map.entry("Vegetable Fried Rice","0.00"),Map.entry("Chicken Fried Rice","1.00"),Map.entry("Beef Fried Rice","1.75"),Map.entry("Shrimp Fried Rice","1.75"),Map.entry("House Special Fried Rice","1.75"),Map.entry("Plain Lo Mein","2.00"),Map.entry("Vegetable Lo Mein","2.00"),Map.entry("Pork Lo Mein","2.75"),Map.entry("Chicken Lo Mein","2.75"),Map.entry("Beef Lo Mein","2.75"),Map.entry("Shrimp Lo Mein","2.75"));
        for(String category:new String[]{"Lunch Special","All Day Special","Special Combination Plates"}) {
            menu.setCategory(category);
            for(var choice:extras.entrySet()) assertEquals(new BigDecimal("10.00").add(new BigDecimal(choice.getValue())).multiply(new BigDecimal("3")),pricing.line(menu,3,"Rice/noodle choice: "+choice.getKey()+"\nLunch side: Can of soda — Sprite\nNo onions"));
        }
        assertEquals(new BigDecimal("20.00"),pricing.line(menu,2,"No onions"));
    }
    @Test void rejectsUnknownChoicesAndSubstitutionsOnOtherDishes() {
        var pricing=new MenuPricing();
        var menu=new Menu("test","C1","Combo","","Special Combination Plates","10.00","0");
        assertThrows(ResponseStatusException.class,()->pricing.line(menu,1,"Rice/noodle choice: Beef Lo Mein (+$0.00)"));
        menu.setCategory("Appetizer");
        assertThrows(ResponseStatusException.class,()->pricing.line(menu,1,"Rice/noodle choice: Plain Fried Rice"));
    }
}

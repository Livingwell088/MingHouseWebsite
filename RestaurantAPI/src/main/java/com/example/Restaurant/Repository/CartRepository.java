package com.example.Restaurant.Repository;

import com.example.Restaurant.model.Cart;
import com.example.Restaurant.model.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CartRepository extends JpaRepository<Cart, String> {


//    boolean existsByItemAndSpecialInstruction(Menu item, String specialInstruction);
//
//    @Query("SELECT o.id FROM Cart o WHERE o.item = :item AND o.specialInstruction = :instruction")
//    Long findAllByItemAndSpecialInstruction(@Param("item") Menu item, @Param("instruction") String instruction);
}

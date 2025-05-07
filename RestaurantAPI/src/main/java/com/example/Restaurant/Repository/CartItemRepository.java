package com.example.Restaurant.Repository;
import com.example.Restaurant.model.CartItem;
import com.example.Restaurant.model.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    @Query("SELECT c FROM CartItem c WHERE c.cartId = :cartId AND c.orderPlaced = false ")
    List<CartItem> findAllByCartId(@Param("cartId") String cartId);



    boolean existsByItemAndSpecialInstruction(Menu item, String specialInstruction);

    @Query("SELECT o.id FROM CartItem o WHERE o.cartId = :cartId AND o.item = :item AND o.specialInstruction = :instruction AND o.orderPlaced = false ")
    Long findAllByItemAndSpecialInstruction(@Param("cartId") String cartId, @Param("item") Menu item, @Param("instruction") String instruction);


}
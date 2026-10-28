package com.example.Restaurant.Repository;

import com.example.Restaurant.model.Cart;
import com.example.Restaurant.model.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CartRepository extends JpaRepository<Cart, String> {
    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from Cart c where c.cart_Id = :id")
    java.util.Optional<Cart> findLockedById(@Param("id") String id);


//    boolean existsByItemAndSpecialInstruction(Menu item, String specialInstruction);
//
//    @Query("SELECT o.id FROM Cart o WHERE o.item = :item AND o.specialInstruction = :instruction")
//    Long findAllByItemAndSpecialInstruction(@Param("item") Menu item, @Param("instruction") String instruction);
}

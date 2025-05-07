package com.example.Restaurant.Repository;

import com.example.Restaurant.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Orders, Long> {

    @Query("SELECT o FROM Orders o WHERE o.user = :user ")
    List<Orders> findAllByUser(@Param("user") StoreUser user);

    @Query("SELECT o FROM Orders o WHERE o.datePlaced = :datePlaced ")
    List<Orders> findAllByDatePlaced(@Param("datePlaced") String datePlaced);




}

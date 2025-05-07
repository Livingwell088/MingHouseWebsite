package com.example.Restaurant.Repository;

import com.example.Restaurant.model.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


//@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {

    @Query("SELECT m FROM Menu m WHERE m.number = :menuNumber")
    List<Menu> findAllMenuByNumber(@Param("menuNumber") String menuNumber);
}

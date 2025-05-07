package com.example.Restaurant.Repository;

import com.example.Restaurant.model.StoreUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<StoreUser, String> {


    @Query("SELECT u FROM StoreUser u WHERE u.email = :email")
    List<StoreUser> findAllByEmail(@Param("email") String email);
}

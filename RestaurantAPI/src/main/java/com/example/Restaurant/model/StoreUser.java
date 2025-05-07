package com.example.Restaurant.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class StoreUser {


//    @Id
//    @GeneratedValue(strategy= GenerationType.AUTO)
//    @EqualsAndHashCode.Include
//    private Long id;

    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String usernameId;
    private String password;

    private String firstName;

    private String lastName;

    private String email;

    private boolean guest;




    public StoreUser() {

    }
    public StoreUser(String usernameId, String password) {
        this.usernameId = usernameId;
        this.password = password;
    }


    public StoreUser(String usernameId, String password, String firstName, String lastName, String email, boolean guest) {
        this.usernameId = usernameId;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.guest = guest;
    }

    public String getUsernameId() {
        return usernameId;
    }

    public void setUsernameId(String usernameId) {
        this.usernameId = usernameId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isGuest() {
        return guest;
    }

    public void setGuest(boolean guest) {
        this.guest = guest;
    }

    @Override
    public String toString() {
        return "StoreUser{" +
                "usernameId='" + usernameId + '\'' +
                ", password='" + password + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", guest=" + guest +
                '}';
    }
}

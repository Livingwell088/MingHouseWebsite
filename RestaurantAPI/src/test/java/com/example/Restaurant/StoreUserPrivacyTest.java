package com.example.Restaurant;

import com.example.Restaurant.model.StoreUser;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class StoreUserPrivacyTest {
    @Test void passwordCanBeSubmittedButNeverReturnedOrLogged() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        StoreUser user = mapper.readValue("{\"usernameId\":\"sample\",\"password\":\"private-value\"}", StoreUser.class);
        assertEquals("private-value", user.getPassword());
        assertFalse(mapper.writeValueAsString(user).contains("password"));
        assertFalse(user.toString().contains("private-value"));
    }
}

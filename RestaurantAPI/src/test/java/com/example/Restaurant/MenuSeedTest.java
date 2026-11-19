package com.example.Restaurant;

import org.junit.jupiter.api.Test;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

class MenuSeedTest {
    @Test void lunchSeedContainsNoRepeatedOptions() throws Exception {
        Set<String> options=new HashSet<>();
        try (var reader=new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/data/menu1.csv"), StandardCharsets.UTF_8))) {
            for (String line; (line=reader.readLine())!=null;) {
                String[] fields=line.split(";", -1);
                if (fields[4].equals("Lunch Special"))
                    assertTrue(options.add(String.join("|",fields[1],fields[2],fields[3],fields[4])), "Duplicate lunch option: "+line);
            }
        }
        assertFalse(options.isEmpty());
    }
}

package com.fatecipiranga.idata;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class IdataApplication {
    private static final Logger LOGGER = LoggerFactory.getLogger(IdataApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(IdataApplication.class, args);
        String mongoUri = System.getenv("SPRING_DATA_MONGODB_URI");
        if (mongoUri != null) {
            LOGGER.info("MongoDB URI: {}", mongoUri);
        }
    }
}
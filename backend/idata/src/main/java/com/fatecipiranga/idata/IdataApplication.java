package com.fatecipiranga.idata;

import java.util.HashMap;
import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
public class IdataApplication {

	@RequestMapping("/")
	String home() {
		return "Hello World!";
	}

    @GetMapping("/data")
    public ResponseEntity<Object> getData() {
        Map<String, String> data = new HashMap<>();
        data.put("key1", "value1");
        data.put("key2", "value2");
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
        
	public static void main(String[] args) {
		SpringApplication.run(IdataApplication.class, args);
	}

}
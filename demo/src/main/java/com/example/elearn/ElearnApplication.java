//elearnapplication.java

package com.example.elearn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class ElearnApplication {

    public static void main(String[] args) {
        SpringApplication.run(ElearnApplication.class, args);
    }
}

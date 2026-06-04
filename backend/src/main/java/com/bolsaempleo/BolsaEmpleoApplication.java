package com.bolsaempleo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class BolsaEmpleoApplication {
    public static void main(String[] args) {
        SpringApplication.run(BolsaEmpleoApplication.class, args);
    }
}

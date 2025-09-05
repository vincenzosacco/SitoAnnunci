package org.example.springboot_back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication
public class SpringBootBackApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootBackApplication.class, args);
    }

}
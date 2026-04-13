package com.example.taskmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Application entry point for the Spring Boot backend.
 * Running this class starts the embedded web server and initializes Spring.
 */
@SpringBootApplication
public class TaskManagerApplication {

    /**
     * Bootstraps the Task Manager API application.
     */
    public static void main(String[] args) {
        SpringApplication.run(TaskManagerApplication.class, args);
    }
}

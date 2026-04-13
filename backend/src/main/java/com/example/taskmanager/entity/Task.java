package com.example.taskmanager.entity;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * MongoDB document representing a task in the application.
 */
@Document(collection = "tasks")
public class Task {

    // MongoDB primary key.
    @Id
    private String id;

    // Human-readable task title. Required on create.
    @NotBlank(message = "Title is required")
    private String title;

    // Optional detail text for the task.
    private String description;

    // Current task state (e.g., TODO, IN_PROGRESS, DONE).
    private String status;

    public Task() {
        // Required by Spring Data / Jackson.
    }

    public Task(String title, String description, String status) {
        this.title = title;
        this.description = description;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

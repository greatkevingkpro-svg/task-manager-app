package com.example.taskmanager.repository;

import com.example.taskmanager.entity.Task;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data repository for Task documents.
 * Basic CRUD methods are inherited from MongoRepository.
 */
public interface TaskRepository extends MongoRepository<Task, String> {
}

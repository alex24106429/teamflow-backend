package com.scrumchat.service;

import com.scrumchat.model.Task;
import com.scrumchat.model.UserStory;
import com.scrumchat.repository.TaskRepository;
import com.scrumchat.repository.UserStoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserStoryRepository userStoryRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository, UserStoryRepository userStoryRepository) {
        this.taskRepository = taskRepository;
        this.userStoryRepository = userStoryRepository;
    }

    public Task createTask(Task task, UUID userStoryId) {
        UserStory userStory = userStoryRepository.findById(userStoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "UserStory not found"));
        task.setUserStory(userStory);
        return taskRepository.save(task);
    }

    public Optional<Task> getTaskById(UUID id) {
        return taskRepository.findById(id);
    }

    public List<Task> getAllTasksByUserStoryId(UUID userStoryId) {
        UserStory userStory = userStoryRepository.findById(userStoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "UserStory not found"));
        return userStory.getTasks(); // Assuming UserStory entity has a getTasks() method
    }

    public Task updateTask(UUID id, Task updatedTask) {
        return taskRepository.findById(id)
                .map(existingTask -> {
                    existingTask.setName(updatedTask.getName());
                    existingTask.setDescription(updatedTask.getDescription());
                    existingTask.setStatus(updatedTask.getStatus());
                    return taskRepository.save(existingTask);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
    }

    public void deleteTask(UUID id) {
        taskRepository.deleteById(id);
    }
}
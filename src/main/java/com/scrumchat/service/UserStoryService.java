package com.scrumchat.service;

import com.scrumchat.model.Epic;
import com.scrumchat.model.UserStory;
import com.scrumchat.repository.EpicRepository;
import com.scrumchat.repository.UserStoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserStoryService {

    private final UserStoryRepository userStoryRepository;
    private final EpicRepository epicRepository;

    @Autowired
    public UserStoryService(UserStoryRepository userStoryRepository, EpicRepository epicRepository) {
        this.userStoryRepository = userStoryRepository;
        this.epicRepository = epicRepository;
    }

    public UserStory createUserStory(UserStory userStory, UUID epicId) {
        Epic epic = epicRepository.findById(epicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Epic not found"));
        userStory.setEpic(epic);
        return userStoryRepository.save(userStory);
    }

    public Optional<UserStory> getUserStoryById(UUID id) {
        return userStoryRepository.findById(id);
    }

    public List<UserStory> getAllUserStoriesByEpicId(UUID epicId) {
        Epic epic = epicRepository.findById(epicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Epic not found"));
        return epic.getUserStories(); // Assuming Epic entity has a getUserStories() method
    }

    public UserStory updateUserStory(UUID id, UserStory updatedUserStory) {
        return userStoryRepository.findById(id)
                .map(existingUserStory -> {
                    existingUserStory.setName(updatedUserStory.getName());
                    existingUserStory.setDescription(updatedUserStory.getDescription());
                    existingUserStory.setStatus(updatedUserStory.getStatus());
                    return userStoryRepository.save(existingUserStory);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "UserStory not found"));
    }

    public void deleteUserStory(UUID id) {
        userStoryRepository.deleteById(id);
    }
}
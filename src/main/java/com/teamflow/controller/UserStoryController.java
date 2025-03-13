package com.teamflow.controller;

import com.teamflow.model.UserStory;
import com.teamflow.service.UserStoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/user-stories")
public class UserStoryController {

    private final UserStoryService userStoryService;

    @Autowired
    public UserStoryController(UserStoryService userStoryService) {
        this.userStoryService = userStoryService;
    }

    @PostMapping
    public ResponseEntity<UserStory> createUserStory(@RequestBody UserStory userStory, @RequestParam UUID epicId) {
        UserStory createdUserStory = userStoryService.createUserStory(userStory, epicId);
        return new ResponseEntity<>(createdUserStory, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserStory> getUserStoryById(@PathVariable UUID id) {
        return userStoryService.getUserStoryById(id)
                .map(story -> new ResponseEntity<>(story, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<UserStory>> getAllUserStoriesByEpicId(@RequestParam UUID epicId) {
        List<UserStory> userStories = userStoryService.getAllUserStoriesByEpicId(epicId);
        return new ResponseEntity<>(userStories, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserStory> updateUserStory(@PathVariable UUID id, @RequestBody UserStory updatedUserStory) {
        UserStory userStory = userStoryService.updateUserStory(id, updatedUserStory);
        return new ResponseEntity<>(userStory, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserStory(@PathVariable UUID id) {
        userStoryService.deleteUserStory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
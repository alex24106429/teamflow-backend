package com.teamflow.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class MessageDto {
    private UUID id;
    private String content;
    private UserDto sender;
    private UUID sprintId;
    private UUID epicId;
    private UUID userStoryId;
    private UUID taskId;
    private LocalDateTime createdAt;
    private String contextType; // "SPRINT", "EPIC", "USER_STORY", "TASK"

    // Constructors
    public MessageDto() {}

    public MessageDto(UUID id, String content, UserDto sender, UUID sprintId, LocalDateTime createdAt) {
        this.id = id;
        this.content = content;
        this.sender = sender;
        this.sprintId = sprintId;
        this.createdAt = createdAt;
        this.contextType = "SPRINT";
    }

    public MessageDto(UUID id, String content, UserDto sender, UUID contextId, String contextType, LocalDateTime createdAt) {
        this.id = id;
        this.content = content;
        this.sender = sender;
        this.createdAt = createdAt;
        this.contextType = contextType;
        
        switch (contextType) {
            case "SPRINT":
                this.sprintId = contextId;
                break;
            case "EPIC":
                this.epicId = contextId;
                break;
            case "USER_STORY":
                this.userStoryId = contextId;
                break;
            case "TASK":
                this.taskId = contextId;
                break;
            default:
                throw new IllegalArgumentException("Invalid context type: " + contextType);
        }
    }

    // Getters and setters
    public UUID getId() { return id; }
    public String getContent() { return content; }
    public UserDto getSender() { return sender; }
    public UUID getSprintId() { return sprintId; }
    public UUID getEpicId() { return epicId; }
    public UUID getUserStoryId() { return userStoryId; }
    public UUID getTaskId() { return taskId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getContextType() { return contextType; }

    public void setId(UUID id) { this.id = id; }
    public void setContent(String content) { this.content = content; }
    public void setSender(UserDto sender) { this.sender = sender; }
    public void setSprintId(UUID sprintId) { this.sprintId = sprintId; }
    public void setEpicId(UUID epicId) { this.epicId = epicId; }
    public void setUserStoryId(UUID userStoryId) { this.userStoryId = userStoryId; }
    public void setTaskId(UUID taskId) { this.taskId = taskId; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setContextType(String contextType) { this.contextType = contextType; }
}
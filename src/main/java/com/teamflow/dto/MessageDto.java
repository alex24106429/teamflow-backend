package com.teamflow.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class MessageDto {
    private UUID id;
    private String content;
    private UserDto sender;
    private UUID sprintId;
    private LocalDateTime createdAt;

    // Constructors
    public MessageDto() {}

    public MessageDto(UUID id, String content, UserDto sender, UUID sprintId, LocalDateTime createdAt) {
        this.id = id;
        this.content = content;
        this.sender = sender;
        this.sprintId = sprintId;
        this.createdAt = createdAt;
    }

    // Getters and setters
    public UUID getId() { return id; }
    public String getContent() { return content; }
    public UserDto getSender() { return sender; }
    public UUID getSprintId() { return sprintId; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(UUID id) { this.id = id; }
    public void setContent(String content) { this.content = content; }
    public void setSender(UserDto sender) { this.sender = sender; }
    public void setSprintId(UUID sprintId) { this.sprintId = sprintId; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
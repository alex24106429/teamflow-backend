package com.teamflow.dto;

import com.teamflow.model.Epic;
import java.util.List;
import java.util.UUID;

public class TeamDto {
    private UUID id;
    private String name;
    private UUID currentSprintId;
    private List<Epic> epics;
    private List<UserDto> members;

    public TeamDto() {}

    public TeamDto(UUID id, String name, UUID currentSprintId, List<Epic> epics, List<UserDto> members) {
        this.id = id;
        this.name = name;
        this.currentSprintId = currentSprintId;
        this.epics = epics;
        this.members = members;
    }

    // Getters and setters
    public UUID getId() { return id; }
    public String getName() { return name; }
    public UUID getCurrentSprintId() { return currentSprintId; }
    public List<Epic> getEpics() { return epics; }
    public List<UserDto> getMembers() { return members; }

    public void setId(UUID id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setCurrentSprintId(UUID currentSprintId) { this.currentSprintId = currentSprintId; }
    public void setEpics(List<Epic> epics) { this.epics = epics; }
    public void setMembers(List<UserDto> members) { this.members = members; }
}
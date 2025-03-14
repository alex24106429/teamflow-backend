package com.teamflow.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class CreateSprintDto {
    private UUID teamId;
    private String name;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    public CreateSprintDto() {}

    public UUID getTeamId() { return teamId; }
    public void setTeamId(UUID teamId) { this.teamId = teamId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }
    
    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }
}
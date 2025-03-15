package com.teamflow.dto;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.UUID;

public class CreateSprintDto {
    private UUID teamId;
    private String name;
    private String startDate;
    private String endDate;

    public CreateSprintDto() {}

    public UUID getTeamId() { return teamId; }
    public void setTeamId(UUID teamId) { this.teamId = teamId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
    
    // Helper methods to get parsed LocalDateTime values
    public LocalDateTime getParsedStartDate() {
        if (startDate == null || startDate.isEmpty()) {
            return null;
        }
        ZonedDateTime zonedDateTime = ZonedDateTime.parse(startDate);
        return zonedDateTime.toLocalDateTime();
    }
    
    public LocalDateTime getParsedEndDate() {
        if (endDate == null || endDate.isEmpty()) {
            return null;
        }
        ZonedDateTime zonedDateTime = ZonedDateTime.parse(endDate);
        return zonedDateTime.toLocalDateTime();
    }
}
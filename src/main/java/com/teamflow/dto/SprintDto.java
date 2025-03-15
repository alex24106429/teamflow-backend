package com.teamflow.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class SprintDto {
    private UUID id;
    private String name;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String archivePath;
    private boolean active;
    private TeamDto team;
    private UUID teamId;

    public SprintDto() {}

    public SprintDto(UUID id, String name, LocalDateTime startDate, LocalDateTime endDate, 
                    String archivePath, boolean active, TeamDto team) {
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.archivePath = archivePath;
        this.active = active;
        this.team = team;
        this.teamId = team != null ? team.getId() : null;
    }

    // Getters and setters
    public UUID getId() { return id; }
    public String getName() { return name; }
    public LocalDateTime getStartDate() { return startDate; }
    public LocalDateTime getEndDate() { return endDate; }
    public String getArchivePath() { return archivePath; }
    public boolean isActive() { return active; }
    public TeamDto getTeam() { return team; }
    public UUID getTeamId() { return teamId; }

    public void setId(UUID id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }
    public void setArchivePath(String archivePath) { this.archivePath = archivePath; }
    public void setActive(boolean active) { this.active = active; }
    public void setTeam(TeamDto team) { 
        this.team = team;
        this.teamId = team != null ? team.getId() : null;
    }
    public void setTeamId(UUID teamId) { this.teamId = teamId; }
}
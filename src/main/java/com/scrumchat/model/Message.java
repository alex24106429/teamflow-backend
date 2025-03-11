package com.scrumchat.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "message") // Added table name annotation
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Corrected ID generation
    private UUID id; // Corrected ID type

    private String content;

    @ManyToOne
    @JoinColumn(name = "sender_id", referencedColumnName = "id") // Corrected join column name
    private User sender;

    @ManyToOne
    @JoinColumn(name = "team_id", referencedColumnName = "id") // Added team relationship with correct join column
    private Team team; // Changed from Sprint to Team

    @ManyToOne
    @JoinColumn(name = "sprint_id", referencedColumnName = "id")
    private Sprint sprint;

    private LocalDateTime createdAt; // Added createdAt field

    // Getters and setters
    public UUID getId() { return id; }
    public String getContent() { return content; }
    public User getSender() { return sender; }
    public Team getTeam() { return team; } // Changed from getSprint to getTeam
    public Sprint getSprint() { return sprint; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(UUID id) { this.id = id; }
    public void setContent(String content) { this.content = content; }
    public void setSender(User sender) { this.sender = sender; }
    public void setTeam(Team team) { this.team = team; } // Changed from setSprint to setTeam
    public void setSprint(Sprint sprint) { this.sprint = sprint; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

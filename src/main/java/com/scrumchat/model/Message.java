package com.scrumchat.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "message")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String content;

    @ManyToOne
    @JoinColumn(name = "sender_id", referencedColumnName = "id")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "team_id", referencedColumnName = "id")
    private Team team;

    @ManyToOne
    @JoinColumn(name = "sprint_id", referencedColumnName = "id")
    private Sprint sprint;

    private LocalDateTime createdAt;

    // Getters and setters
    public UUID getId() { return id; }
    public String getContent() { return content; }
    public User getSender() { return sender; }
    public Team getTeam() { return team; }
    public Sprint getSprint() { return sprint; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(UUID id) { this.id = id; }
    public void setContent(String content) { this.content = content; }
    public void setSender(User sender) { this.sender = sender; }
    public void setTeam(Team team) { this.team = team; }
    public void setSprint(Sprint sprint) { this.sprint = sprint; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

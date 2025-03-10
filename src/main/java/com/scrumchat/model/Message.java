package com.scrumchat.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    private String content;
    
    @ManyToOne
    private User sender;
    
    @ManyToOne
    private Team team;

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }
    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }
}

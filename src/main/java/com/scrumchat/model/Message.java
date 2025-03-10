package com.scrumchat.model;

import jakarta.persistence.*;

@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String content;
    
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "sprint_id", referencedColumnName = "id")
    private Sprint sprint;

    // Getters and setters
    public Long getId() { return id; }
    public String getContent() { return content; }
    public User getSender() { return sender; }
    public Sprint getSprint() { return sprint; }
    
    public void setId(Long id) { this.id = id; }
    public void setContent(String content) { this.content = content; }
    public void setSender(User sender) { this.sender = sender; }
    public void setSprint(Sprint sprint) { this.sprint = sprint; }
}

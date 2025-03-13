package com.scrumchat.model;

import com.scrumchat.converter.MessageContentConverter;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "message")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Convert(converter = MessageContentConverter.class)
    private MessageContent content;

    @ManyToOne
    @JoinColumn(name = "sender_id", referencedColumnName = "id")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "sprint_id", referencedColumnName = "id")
    private Sprint sprint;

    @ManyToOne
    @JoinColumn(name = "epic_id", referencedColumnName = "id")
    private Epic epic;

    @ManyToOne
    @JoinColumn(name = "user_story_id", referencedColumnName = "id")
    private UserStory userStory;

    @ManyToOne
    @JoinColumn(name = "task_id", referencedColumnName = "id")
    private Task task;

    @CreatedDate
    private LocalDateTime createdAt;

    // Getters and setters
    public UUID getId() { return id; }
    public MessageContent getContent() { return content; }
    public User getSender() { return sender; }
    public Sprint getSprint() { return sprint; }
    public Epic getEpic() { return epic; }
    public UserStory getUserStory() { return userStory; }
    public Task getTask() { return task; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(UUID id) { this.id = id; }
    public void setContent(MessageContent content) { this.content = content; }
    public void setSender(User sender) { this.sender = sender; }
    public void setSprint(Sprint sprint) { this.sprint = sprint; }
    public void setEpic(Epic epic) { this.epic = epic; }
    public void setUserStory(UserStory userStory) { this.userStory = userStory; }
    public void setTask(Task task) { this.task = task; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

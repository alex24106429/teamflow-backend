package com.scrumchat.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Table(name = "team")
@Data
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    @Column(name = "current_sprint_id")
    private UUID currentSprintId;

    // Add constructor that accepts a UUID
    public Team(UUID id) {
        this.id = id;
    }

    // Add default constructor (required by JPA)
    public Team() {
    }
}
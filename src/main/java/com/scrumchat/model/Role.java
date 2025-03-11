package com.scrumchat.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "role") // Added table name annotation
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Corrected ID generation
    private UUID id; // Corrected ID type

    @Enumerated(EnumType.STRING)
    private RoleName name;

    public enum RoleName {
        ROLE_USER, ROLE_ADMIN, ROLE_SCRUM_MASTER
    }

    public UUID getId() { return id; }
    public RoleName getName() { return name; }
    public void setName(RoleName name) { this.name = name; }
    public void setId(UUID id) { this.id = id; }
}
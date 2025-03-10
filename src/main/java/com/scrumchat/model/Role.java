package com.scrumchat.model;

import jakarta.persistence.*;

@Entity
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    private RoleName name;

    public enum RoleName {
        ROLE_USER, ROLE_ADMIN, ROLE_SCRUM_MASTER
    }

    public RoleName getName() { return name; }
    public void setName(RoleName name) { this.name = name; }
}
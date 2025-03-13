package com.teamflow.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "epics")
public class Epic {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    @JsonBackReference // Added JsonBackReference
    private Team team;

    @JsonManagedReference // Added JsonManagedReference
    @OneToMany(mappedBy = "epic", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserStory> userStories;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public List<UserStory> getUserStories() {
        return userStories;
    }

    public void setUserStories(List<UserStory> userStories) {
        this.userStories = userStories;
    }
}
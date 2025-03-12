package com.scrumchat.dto;

import java.util.List;
import java.util.UUID;

public class UserDto {
    private UUID id;
    private String username;
    private boolean enabled;
    private List<String> roles;

    public UserDto() {}

    public UserDto(UUID id, String username, boolean enabled, List<String> roles) {
        this.id = id;
        this.username = username;
        this.enabled = enabled;
        this.roles = roles;
    }

    // Getters and setters
    public UUID getId() { return id; }
    public String getUsername() { return username; }
    public boolean isEnabled() { return enabled; }
    public List<String> getRoles() { return roles; }

    public void setId(UUID id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public void setRoles(List<String> roles) { this.roles = roles; }
}
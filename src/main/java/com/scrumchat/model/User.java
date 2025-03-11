package com.scrumchat.model;

import jakarta.persistence.*;
import java.util.Collection;
import java.util.UUID;

@Entity
@Table(name = "users") // Corrected table name
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Corrected ID generation
    private UUID id; // Corrected ID type
    private String username;
    private String password;
    private boolean enabled = true; // Added missing field
    private boolean accountNonExpired = true; // Added missing field
    private boolean credentialsNonExpired = true; // Added missing field
    private boolean accountNonLocked = true; // Added missing field

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Collection<Role> roles;

    // Getters and setters
    public UUID getId() { return id; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public Collection<Role> getRoles() { return roles; }
    public boolean isEnabled() { return enabled; }
    public boolean isAccountNonExpired() { return accountNonExpired; }
    public boolean isCredentialsNonExpired() { return credentialsNonExpired; }
    public boolean isAccountNonLocked() { return accountNonLocked; }


    public void setId(UUID id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setPassword(String password) { this.password = password; }
    public void setRoles(Collection<Role> roles) { this.roles = roles; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public void setAccountNonExpired(boolean accountNonExpired) { this.accountNonExpired = accountNonExpired; }
    public void setCredentialsNonExpired(boolean credentialsNonExpired) { this.credentialsNonExpired = credentialsNonExpired; }
    public void setAccountNonLocked(boolean accountNonLocked) { this.accountNonLocked = accountNonLocked; }
}

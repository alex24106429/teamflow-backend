package com.scrumchat.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import java.util.UUID;
import java.util.Set;
import java.util.HashSet;

@Entity
@Data
public class Role implements GrantedAuthority {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;
	
	private String authority;
	
	@ManyToMany(mappedBy = "authorities")
	private Set<User> users = new HashSet<>();

	@Override
	public String getAuthority() {
		return authority;
	}
}
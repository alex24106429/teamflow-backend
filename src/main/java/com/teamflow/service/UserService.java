package com.teamflow.service;

import com.teamflow.model.User;
import com.teamflow.model.Role;
import com.teamflow.model.Role.RoleName;
import com.teamflow.repository.UserRepository;
import com.teamflow.repository.RoleRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Set;
import java.util.HashSet;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return org.springframework.security.core.userdetails.User.builder()
            .username(user.getUsername())
            .password(user.getPassword())
            .roles(user.getRoles().stream()
                .map(role -> role.getName().name().replace("ROLE_", ""))
                .toArray(String[]::new))
            .build();
    }

    public User createUser(String username, String password) {
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password));
        
        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Default role not found: ROLE_USER"));
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        newUser.setRoles(roles);
        
        return userRepository.save(newUser);
    }
}
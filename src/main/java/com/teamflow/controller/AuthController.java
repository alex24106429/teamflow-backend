package com.teamflow.controller;

import com.teamflow.config.JwtTokenProvider;
import com.teamflow.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    public AuthController(JwtTokenProvider jwtTokenProvider,
                         UserService userService,
                         AuthenticationManager authenticationManager) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),
                loginRequest.getPassword()
            )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtTokenProvider.generateToken(authentication);
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest registerRequest) {
        userService.createUser(
            registerRequest.getUsername(),
            registerRequest.getPassword()
        );

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                registerRequest.getUsername(),
                registerRequest.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtTokenProvider.generateToken(authentication);
    }

    static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    static class RegisterRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
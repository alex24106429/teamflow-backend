package com.scrumchat.controller;

import com.scrumchat.config.JwtTokenProvider;
import com.scrumchat.model.User;
import com.scrumchat.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthController(UserService userService, 
                         AuthenticationManager authenticationManager,
                         JwtTokenProvider tokenProvider) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@RequestBody RegistrationRequest request) {
        User user = userService.registerUser(request.username(), request.password());
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            request.username(), request.password());
        String jwt = tokenProvider.generateToken(authentication);
        return ResponseEntity.ok(new AuthResponse(jwt, user.getUsername()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.username(), 
                request.password()));
        String jwt = tokenProvider.generateToken(authentication);
        return ResponseEntity.ok(new AuthResponse(jwt, authentication.getName()));
    }

    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logoutUser() {
        return ResponseEntity.ok(new LogoutResponse("Successfully logged out"));
    }

    public record RegistrationRequest(String username, String password) {}
    public record LoginRequest(String username, String password) {}
    public record AuthResponse(String accessToken, String username) {}
    public record LogoutResponse(String message) {}
}
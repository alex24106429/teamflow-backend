package com.teamflow.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException)
                         throws IOException {
        // Log the authentication failure
        System.err.println("Authentication failed: " + authException.getMessage() +
                          " for request: " + request.getRequestURI() +
                          " from IP: " + request.getRemoteAddr());
        
        // Set content type for JSON response
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        
        // Create a more detailed error message
        String errorMessage = String.format(
            "{\"timestamp\":\"%s\",\"status\":401,\"error\":\"Unauthorized\",\"message\":\"%s\",\"path\":\"%s\"}",
            java.time.LocalDateTime.now(),
            authException.getMessage().replace("\"", "\\\""),
            request.getRequestURI()
        );
        
        response.getWriter().write(errorMessage);
    }
}
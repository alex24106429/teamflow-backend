package com.teamflow.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import java.util.Date;
import javax.crypto.SecretKey;

@Component
public class JwtTokenProvider {
    private final SecretKey jwtSecret = Keys.secretKeyFor(SignatureAlgorithm.HS512); // Generate a secure key
    private final long jwtExpirationMs = 86400000;
    
    private final UserDetailsService userDetailsService;

    public JwtTokenProvider(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    public String generateToken(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(user.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(jwtSecret, SignatureAlgorithm.HS512) // Use the secure key
                .compact();
    }

    public Authentication getAuthentication(String token) {
        String username = getUsernameFromToken(token);
        User userDetails = (User) userDetailsService.loadUserByUsername(username);
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(jwtSecret) // Use the secure key
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(jwtSecret) // Use the secure key
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // Handle exceptions
        }
        return false;
    }
}
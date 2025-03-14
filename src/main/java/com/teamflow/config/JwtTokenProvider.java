package com.teamflow.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
public class JwtTokenProvider {
    private final SecretKey jwtSecret;
    private final long jwtExpirationMs;
    
    private final UserDetailsService userDetailsService;

    public JwtTokenProvider(
            UserDetailsService userDetailsService,
            @Value("${app.jwt.expiration:86400000}") long jwtExpirationMs) {
        this.userDetailsService = userDetailsService;
        this.jwtExpirationMs = jwtExpirationMs;
        
        // Try to load the key from file, or generate a new one if it doesn't exist
        this.jwtSecret = loadOrGenerateKey();
    }
    
    private SecretKey loadOrGenerateKey() {
        Path keyPath = Paths.get("data", "jwt.key");
        File keyFile = keyPath.toFile();
        
        // Create data directory if it doesn't exist
        if (!keyFile.getParentFile().exists()) {
            keyFile.getParentFile().mkdirs();
        }
        
        try {
            // Try to load existing key
            if (keyFile.exists()) {
                String encodedKey = Files.readString(keyPath, StandardCharsets.UTF_8);
                return Keys.hmacShaKeyFor(Decoders.BASE64.decode(encodedKey));
            }
            
            // Generate a new key if file doesn't exist
            SecretKey generatedKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
            
            // Save the key to file for future use
            String encodedKey = Encoders.BASE64.encode(generatedKey.getEncoded());
            Files.writeString(keyPath, encodedKey, StandardCharsets.UTF_8);
            
            return generatedKey;
        } catch (IOException e) {
            System.err.println("Error handling JWT key file: " + e.getMessage());
            // Fallback to generating a new key in memory if file operations fail
            return Keys.secretKeyFor(SignatureAlgorithm.HS512);
        }
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
        if (token == null) {
            return false;
        }
        
        try {
            Jwts.parserBuilder()
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException e) {
            System.err.println("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.err.println("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.err.println("JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println("JWT claims string is empty: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("JWT validation error: " + e.getMessage());
        }
        return false;
    }
}
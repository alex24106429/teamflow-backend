package com.scrumchat.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			// Disable CSRF using lambda-based configuration
			.csrf(csrf -> csrf.disable())
			// Authorize requests using lambda-based configuration
			.authorizeHttpRequests(authorize -> authorize
				.requestMatchers("/auth/login").permitAll()
				.anyRequest().authenticated()
			)
			// Enable HTTP Basic authentication using lambda-based configuration
			.httpBasic(httpBasic -> httpBasic.realmName("ScrumChat"));

		return http.build();
	}
}
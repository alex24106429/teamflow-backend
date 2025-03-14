package com.teamflow.controller;

import com.teamflow.model.Team;
import com.teamflow.service.TeamService;
import java.security.Principal;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityNotFoundException;
import com.teamflow.model.User;
import com.teamflow.service.UserService;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/teams")
public class TeamController {
    private final TeamService teamService;
    private final UserService userService;

    public TeamController(TeamService teamService, UserService userService) {
        this.teamService = teamService;
        this.userService = userService;
    }

    @PostMapping
    public Team createTeam(@RequestBody Team team, Principal principal) {
        User creator = getUserFromPrincipal(principal);
        return teamService.createTeam(team, creator);
    }

    private User getUserFromPrincipal(Principal principal) {
        String username = principal.getName();
        return userService.getUserByUsername(username)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    @GetMapping("/{teamId}")
    public Team getTeam(@PathVariable UUID teamId) {
        return teamService.getTeamById(teamId);
    }

    @GetMapping
    public List<Team> getAllTeams() {
        return teamService.getAllTeams();
    }
}

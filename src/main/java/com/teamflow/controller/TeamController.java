package com.teamflow.controller;

import com.teamflow.dto.TeamDto;
import com.teamflow.model.Team;
import com.teamflow.service.TeamService;
import com.teamflow.util.DtoConverter;
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
    public TeamDto createTeam(@RequestBody Team team, Principal principal) {
        User creator = getUserFromPrincipal(principal);
        Team createdTeam = teamService.createTeam(team, creator);
        return DtoConverter.convertToTeamDto(createdTeam);
    }

    private User getUserFromPrincipal(Principal principal) {
        String username = principal.getName();
        return userService.getUserByUsername(username)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    @GetMapping("/{teamId}")
    public TeamDto getTeam(@PathVariable UUID teamId) {
        Team team = teamService.getTeamById(teamId);
        return DtoConverter.convertToTeamDto(team);
    }

    @GetMapping
    public List<TeamDto> getAllTeams() {
        List<Team> teams = teamService.getAllTeams();
        return DtoConverter.convertToTeamDtoList(teams);
    }
}

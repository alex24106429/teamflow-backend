package com.teamflow.controller;

import com.teamflow.model.Team;
import com.teamflow.service.TeamService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/teams")
public class TeamController {
	private final TeamService teamService;

	public TeamController(TeamService teamService) {
		this.teamService = teamService;
	}

	@PostMapping
	public Team createTeam(@RequestBody Team team) {
		return teamService.createTeam(team);
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

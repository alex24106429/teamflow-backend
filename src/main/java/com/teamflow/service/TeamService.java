package com.teamflow.service;

import com.teamflow.model.Team;
import com.teamflow.repository.TeamRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class TeamService {
	private final TeamRepository teamRepository;

	public TeamService(TeamRepository teamRepository) {
		this.teamRepository = teamRepository;
	}

	public Team createTeam(Team team) {
		return teamRepository.save(team);
	}

	public Team getTeamById(UUID teamId) {
		return teamRepository.findById(teamId).orElseThrow();
	}

	public List<Team> getAllTeams() {
		return teamRepository.findAll();
	}
}

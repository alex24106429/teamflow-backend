package com.scrumchat.service;

import com.scrumchat.model.Team;
import com.scrumchat.repository.TeamRepository;
import org.springframework.stereotype.Service;
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
}

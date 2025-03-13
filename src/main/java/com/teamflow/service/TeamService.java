package com.teamflow.service;

import com.teamflow.model.Team;
import com.teamflow.model.User;
import com.teamflow.repository.TeamRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.ArrayList;

@Service
public class TeamService {
	private final TeamRepository teamRepository;

	public TeamService(TeamRepository teamRepository) {
		this.teamRepository = teamRepository;
	}

	public Team createTeam(Team team, User creator) {
	    // Initialize members list if null
	    if (team.getMembers() == null) {
	        team.setMembers(new ArrayList<>());
	    }
	    
	    // Add creator to team members
	    team.getMembers().add(creator);
	    
	    // Save team first to get ID
	    Team savedTeam = teamRepository.save(team);
	    
	    // Add team to creator's teams
	    if (creator.getTeams() == null) {
	        creator.setTeams(new ArrayList<>());
	    }
	    creator.getTeams().add(savedTeam);
	    
	    return savedTeam;
	}

	public Team addMemberToTeam(UUID teamId, User user) {
	    Team team = teamRepository.findById(teamId)
	        .orElseThrow(() -> new EntityNotFoundException("Team not found"));
	    
	    // Add user to team members
	    team.getMembers().add(user);
	    
	    // Add team to user's teams
	    if (user.getTeams() == null) {
	        user.setTeams(new ArrayList<>());
	    }
	    user.getTeams().add(team);
	    
	    return teamRepository.save(team);
	}

	public Team getTeamById(UUID teamId) {
		return teamRepository.findById(teamId).orElseThrow();
	}

	public List<Team> getAllTeams() {
		return teamRepository.findAll();
	}
}

package com.teamflow.service;

import com.teamflow.model.Sprint;
import com.teamflow.model.Team;
import com.teamflow.repository.SprintRepository;
import com.teamflow.repository.TeamRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SprintService {
	private final SprintRepository sprintRepository;
	private final TeamRepository teamRepository;

	public SprintService(SprintRepository sprintRepository, TeamRepository teamRepository) {
		this.sprintRepository = sprintRepository;
		this.teamRepository = teamRepository;
	}

	public Sprint startSprint(UUID teamId, String name) {
		Sprint sprint = new Sprint();
		Team team = teamRepository.findById(teamId).orElseThrow();
		sprint.setTeam(team);
		sprint.setName(name);
		sprint.setStartDate(LocalDateTime.now());
		return sprintRepository.save(sprint);
	}

	public void stopSprint(UUID sprintId) {
		Sprint sprint = sprintRepository.findById(sprintId).orElseThrow();
		sprint.setEndDate(LocalDateTime.now());
		sprintRepository.save(sprint);
	}

	public List<Sprint> getSprintsByTeamId(UUID teamId) {
		return sprintRepository.findByTeam_Id(teamId);
	}

    public Optional<Sprint> getSprintById(String sprintId) {
        try {
            UUID uuid = UUID.fromString(sprintId);
            return sprintRepository.findById(uuid);
        } catch (IllegalArgumentException e) {
            // Log the error or handle it as needed
            System.err.println("Invalid UUID format: " + sprintId);
            return Optional.empty();
        }
    }
}

package com.scrumchat.service;

import com.scrumchat.model.Sprint;
import com.scrumchat.model.Team;
import com.scrumchat.repository.SprintRepository;
import com.scrumchat.repository.TeamRepository; // Import TeamRepository
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SprintService {
	private final SprintRepository sprintRepository;
	private final TeamRepository teamRepository; // Inject TeamRepository

	public SprintService(SprintRepository sprintRepository, TeamRepository teamRepository) { // Add TeamRepository to constructor
		this.sprintRepository = sprintRepository;
		this.teamRepository = teamRepository;
	}

	public Sprint startSprint(UUID teamId) {
		Sprint sprint = new Sprint();
		Team team = teamRepository.findById(teamId).orElseThrow(); // Fetch Team object
		sprint.setTeam(team); // Set Team object
		sprint.setStartDate(LocalDateTime.now()); // Use LocalDateTime.now()
		return sprintRepository.save(sprint);
	}

	public void stopSprint(UUID sprintId) {
		Sprint sprint = sprintRepository.findById(sprintId).orElseThrow();
		sprint.setEndDate(LocalDateTime.now()); // Use LocalDateTime.now()
		sprintRepository.save(sprint);
	}

	public List<Sprint> getSprintsByTeamId(UUID teamId) {
		return sprintRepository.findByTeam_Id(teamId); // Changed to findByTeam_Id
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

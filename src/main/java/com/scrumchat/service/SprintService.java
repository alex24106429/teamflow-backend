package com.scrumchat.service;

import com.scrumchat.model.Sprint;
import com.scrumchat.model.Team;
import com.scrumchat.repository.SprintRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class SprintService {
	private final SprintRepository sprintRepository;

	public SprintService(SprintRepository sprintRepository) {
		this.sprintRepository = sprintRepository;
	}

	public Sprint startSprint(UUID teamId) {
		Sprint sprint = new Sprint();
		sprint.setStartDate(LocalDateTime.now());
		sprint.setTeam(new Team(teamId));
		return sprintRepository.save(sprint);
	}

	public void stopSprint(UUID sprintId) {
		Sprint sprint = sprintRepository.findById(sprintId).orElseThrow();
		sprint.setEndDate(LocalDateTime.now());
		sprintRepository.save(sprint);
	}
}

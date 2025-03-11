package com.scrumchat.controller;

import com.scrumchat.model.Sprint;
import com.scrumchat.service.SprintService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/sprints")
public class SprintController {
	private final SprintService sprintService;

	public SprintController(SprintService sprintService) {
		this.sprintService = sprintService;
	}

	@PostMapping("/start")
	public Sprint startSprint(@RequestParam UUID teamId) {
		return sprintService.startSprint(teamId);
	}

	@PostMapping("/{sprintId}/stop")
	public void stopSprint(@PathVariable UUID sprintId) {
		sprintService.stopSprint(sprintId);
	}

	@GetMapping("/teams/{teamId}/sprints")
	public List<Sprint> getSprintsByTeamId(@PathVariable UUID teamId) {
		return sprintService.getSprintsByTeamId(teamId);
	}
}

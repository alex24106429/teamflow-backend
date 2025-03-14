package com.teamflow.controller;

import com.teamflow.model.Sprint;
import com.teamflow.service.SprintService;
import com.teamflow.dto.CreateSprintDto;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/sprints")
public class SprintController {
    private final SprintService sprintService;

    public SprintController(SprintService sprintService) {
        this.sprintService = sprintService;
    }

    @PostMapping("/start")
    public Sprint startSprint(@RequestBody CreateSprintDto sprintDto) {
        return sprintService.startSprint(
            sprintDto.getTeamId(), 
            sprintDto.getName(),
            sprintDto.getStartDate(),
            sprintDto.getEndDate()
        );
    }

    @PostMapping("/{sprintId}/stop")
    public void stopSprint(@PathVariable UUID sprintId) {
        sprintService.stopSprint(sprintId);
    }

    @PutMapping("/{sprintId}")
    public Sprint updateSprint(@PathVariable UUID sprintId, @RequestBody Map<String, String> payload) {
        return sprintService.updateSprint(sprintId, payload.get("name"));
    }

    @DeleteMapping("/{sprintId}")
    public void deleteSprint(@PathVariable UUID sprintId) {
        sprintService.deleteSprint(sprintId);
    }

    @GetMapping("/teams/{teamId}/sprints")
    public List<Sprint> getSprintsByTeamId(@PathVariable UUID teamId) {
        return sprintService.getSprintsByTeamId(teamId);
    }
}

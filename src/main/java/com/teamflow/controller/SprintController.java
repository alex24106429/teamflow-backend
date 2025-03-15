package com.teamflow.controller;

import com.teamflow.dto.SprintDto;
import com.teamflow.model.Sprint;
import com.teamflow.service.SprintService;
import com.teamflow.dto.CreateSprintDto;
import com.teamflow.util.DtoConverter;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;

@RestController
@RequestMapping("/api/sprints")
public class SprintController {
    private final SprintService sprintService;

    public SprintController(SprintService sprintService) {
        this.sprintService = sprintService;
    }

    @PostMapping("/start")
    public SprintDto startSprint(@RequestBody CreateSprintDto sprintDto) {
        Sprint sprint = sprintService.startSprint(
            sprintDto.getTeamId(),
            sprintDto.getName(),
            sprintDto.getParsedStartDate(),
            sprintDto.getParsedEndDate()
        );
        return DtoConverter.convertToSprintDto(sprint);
    }

    @PostMapping("/{sprintId}/stop")
    public void stopSprint(@PathVariable UUID sprintId) {
        sprintService.stopSprint(sprintId);
    }

    @PutMapping("/{sprintId}")
    public SprintDto updateSprint(@PathVariable UUID sprintId, @RequestBody Map<String, String> payload) {
        Sprint sprint = sprintService.updateSprint(sprintId, payload.get("name"));
        return DtoConverter.convertToSprintDto(sprint);
    }
    
    @PutMapping("/{sprintId}/dates")
    public SprintDto updateSprintDates(@PathVariable UUID sprintId, @RequestBody Map<String, String> payload) {
        LocalDateTime startDate = null;
        LocalDateTime endDate = null;
        
        if (payload.get("startDate") != null && !payload.get("startDate").isEmpty()) {
            // Parse ISO date with timezone and convert to LocalDateTime
            ZonedDateTime zonedStartDate = ZonedDateTime.parse(payload.get("startDate"));
            startDate = zonedStartDate.toLocalDateTime();
        }
        
        if (payload.get("endDate") != null && !payload.get("endDate").isEmpty()) {
            // Parse ISO date with timezone and convert to LocalDateTime
            ZonedDateTime zonedEndDate = ZonedDateTime.parse(payload.get("endDate"));
            endDate = zonedEndDate.toLocalDateTime();
        }
        
        Sprint sprint = sprintService.updateSprintDates(sprintId, startDate, endDate);
        return DtoConverter.convertToSprintDto(sprint);
    }

    @DeleteMapping("/{sprintId}")
    public void deleteSprint(@PathVariable UUID sprintId) {
        sprintService.deleteSprint(sprintId);
    }

    @GetMapping("/teams/{teamId}/sprints")
    public List<SprintDto> getSprintsByTeamId(@PathVariable UUID teamId) {
        List<Sprint> sprints = sprintService.getSprintsByTeamId(teamId);
        return DtoConverter.convertToSprintDtoList(sprints);
    }
}

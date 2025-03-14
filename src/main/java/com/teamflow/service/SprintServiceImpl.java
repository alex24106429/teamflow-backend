package com.teamflow.service;

import com.teamflow.model.Sprint;
import com.teamflow.model.Team;
import com.teamflow.repository.SprintRepository;
import com.teamflow.repository.TeamRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SprintServiceImpl implements SprintService {

    private final SprintRepository sprintRepository;
    private final TeamRepository teamRepository;

    public SprintServiceImpl(SprintRepository sprintRepository, TeamRepository teamRepository) {
        this.sprintRepository = sprintRepository;
        this.teamRepository = teamRepository;
    }

    @Override
    public Sprint startSprint(UUID teamId, String name, LocalDateTime startDate, LocalDateTime endDate) {
        if (endDate != null && endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date must be after start date");
        }

        Team team = teamRepository.findById(teamId)
            .orElseThrow(() -> new RuntimeException("Team not found"));

        Sprint sprint = new Sprint();
        sprint.setName(name);
        sprint.setStartDate(startDate);
        sprint.setEndDate(endDate);
        sprint.setTeam(team);
        
        return sprintRepository.save(sprint);
    }

    @Override
    public void stopSprint(UUID sprintId) {
        sprintRepository.deleteById(sprintId);
    }

    @Override
    public Sprint updateSprint(UUID sprintId, String name) {
        Sprint sprint = sprintRepository.findById(sprintId)
            .orElseThrow(() -> new RuntimeException("Sprint not found"));
        sprint.setName(name);
        return sprintRepository.save(sprint);
    }

    @Override
    public void deleteSprint(UUID sprintId) {
        sprintRepository.deleteById(sprintId);
    }

    @Override
    public List<Sprint> getSprintsByTeamId(UUID teamId) {
        return sprintRepository.findByTeamId(teamId);
    }
}
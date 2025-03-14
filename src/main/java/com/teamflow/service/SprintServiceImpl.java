package com.teamflow.service;

import com.teamflow.model.Sprint;
import com.teamflow.model.Team;
import com.teamflow.repository.SprintRepository;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;

@Service
public class SprintServiceImpl implements SprintService {

    private final SprintRepository sprintRepository;

    public SprintServiceImpl(SprintRepository sprintRepository) {
        this.sprintRepository = sprintRepository;
    }

    @Override
    public Sprint startSprint(UUID teamId, String name, LocalDateTime startDate, LocalDateTime endDate) {
        Sprint sprint = new Sprint();
        Team team = new Team();
        team.setId(teamId);
        sprint.setTeam(team);
        sprint.setName(name);
        sprint.setStartDate(startDate);
        sprint.setEndDate(endDate);
        sprint.setActive(true);
        return sprintRepository.save(sprint);
    }

    @Override
    public void stopSprint(UUID sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
            .orElseThrow(() -> new RuntimeException("Sprint not found"));
        sprint.setActive(false);
        sprintRepository.save(sprint);
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
        return sprintRepository.findByTeam_Id(teamId);
    }

    @Override
    public Sprint getSprintById(UUID sprintId) {
        return sprintRepository.findById(sprintId)
            .orElseThrow(() -> new RuntimeException("Sprint not found"));
    }
}
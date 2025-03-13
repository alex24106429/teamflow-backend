package com.scrumchat.service;

import com.scrumchat.model.Epic;
import com.scrumchat.model.Team;
import com.scrumchat.repository.EpicRepository;
import com.scrumchat.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EpicService {

    private final EpicRepository epicRepository;
    private final TeamRepository teamRepository;

    @Autowired
    public EpicService(EpicRepository epicRepository, TeamRepository teamRepository) {
        this.epicRepository = epicRepository;
        this.teamRepository = teamRepository;
    }

    public Epic createEpic(Epic epic, UUID teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));
        epic.setTeam(team);
        return epicRepository.save(epic);
    }

    public Optional<Epic> getEpicById(UUID id) {
        return epicRepository.findById(id);
    }

    public List<Epic> getAllEpicsByTeamId(UUID teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));
        return team.getEpics(); // Assuming Team entity has a getEpics() method to fetch associated epics
    }

    public Epic updateEpic(UUID id, Epic updatedEpic) {
        return epicRepository.findById(id)
                .map(existingEpic -> {
                    existingEpic.setName(updatedEpic.getName());
                    existingEpic.setDescription(updatedEpic.getDescription());
                    return epicRepository.save(existingEpic);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Epic not found"));
    }

    public void deleteEpic(UUID id) {
        epicRepository.deleteById(id);
    }
}
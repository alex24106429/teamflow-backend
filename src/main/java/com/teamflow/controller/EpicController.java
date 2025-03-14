package com.teamflow.controller;

import com.teamflow.model.Epic;
import com.teamflow.service.EpicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/epics")
public class EpicController {

    private final EpicService epicService;

    @Autowired
    public EpicController(EpicService epicService) {
        this.epicService = epicService;
    }

    @PostMapping
    public ResponseEntity<Epic> createEpic(@RequestBody Epic epic, @RequestParam UUID teamId) {
        Epic createdEpic = epicService.createEpic(epic, teamId);
        return new ResponseEntity<>(createdEpic, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Epic> getEpicById(@PathVariable UUID id) {
        return epicService.getEpicById(id)
                .map(epic -> new ResponseEntity<>(epic, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Epic>> getAllEpicsByTeamId(@RequestParam UUID teamId) {
        List<Epic> epics = epicService.getAllEpicsByTeamId(teamId);
        return new ResponseEntity<>(epics, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Epic> updateEpic(@PathVariable UUID id, @RequestBody Epic updatedEpic) {
        Epic epic = epicService.updateEpic(id, updatedEpic);
        return new ResponseEntity<>(epic, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEpic(@PathVariable UUID id) {
        epicService.deleteEpic(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
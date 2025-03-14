package com.teamflow.service;

import com.teamflow.model.Sprint;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;

public interface SprintService {
    Sprint startSprint(UUID teamId, String name, LocalDateTime startDate, LocalDateTime endDate);
    void stopSprint(UUID sprintId);
    Sprint updateSprint(UUID sprintId, String name);
    void deleteSprint(UUID sprintId);
    List<Sprint> getSprintsByTeamId(UUID teamId);
}

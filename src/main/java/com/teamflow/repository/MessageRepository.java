package com.teamflow.repository;

import com.teamflow.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    List<Message> findBySprintId(UUID sprintId);
    List<Message> findByEpicId(UUID epicId);
    List<Message> findByUserStoryId(UUID userStoryId);
    List<Message> findByTaskId(UUID taskId);
}

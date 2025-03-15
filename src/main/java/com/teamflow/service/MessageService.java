package com.teamflow.service;

import com.teamflow.model.Message;
import java.util.List;
import java.util.UUID;
import java.util.Optional; // Added import for Optional

public interface MessageService {
    List<Message> findBySprintId(UUID sprintId);
    List<Message> findByEpicId(UUID epicId);
    List<Message> findByUserStoryId(UUID userStoryId);
    List<Message> findByTaskId(UUID taskId);
    Message saveMessage(Message message); // Added back saveMessage method
    Optional<Message> getMessageById(UUID id); // Added back getMessageById method - may be needed later
}
package com.scrumchat.service;

import com.scrumchat.model.Message;
import java.util.List;
import java.util.UUID;
import java.util.Optional; // Added import for Optional

public interface MessageService {
    List<Message> findBySprintId(UUID sprintId);
    Message saveMessage(Message message); // Added back saveMessage method
    Optional<Message> getMessageById(UUID id); // Added back getMessageById method - may be needed later
}
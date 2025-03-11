package com.scrumchat.service;

import com.scrumchat.model.Message;
import com.scrumchat.repository.MessageRepository;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.List;

@Service
public class MessageService {
    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public List<Message> getMessagesBySprintId(UUID sprintId) {
        return messageRepository.findBySprintId(sprintId);
    }
}
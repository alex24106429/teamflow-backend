package com.teamflow.service;

import com.teamflow.model.Message;
import com.teamflow.repository.MessageRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

@Service
public class MessageServiceImpl implements MessageService {
    private final MessageRepository messageRepository;

    public MessageServiceImpl(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Override
    public List<Message> findBySprintId(UUID sprintId) {
        return messageRepository.findBySprintId(sprintId);
    }

    @Override
    public Message saveMessage(Message message) {
        // Set createdAt if not already set
        if (message.getCreatedAt() == null) {
            message.setCreatedAt(LocalDateTime.now());
        }
        return messageRepository.save(message);
    }

    @Override
    public Optional<Message> getMessageById(UUID id) { // Implemented getMessageById
        return messageRepository.findById(id);
    }
}
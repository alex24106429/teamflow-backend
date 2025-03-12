package com.scrumchat.service;

import com.scrumchat.model.Message;
import com.scrumchat.repository.MessageRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.Optional; // Added import for Optional

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
    public Message saveMessage(Message message) { // Implemented saveMessage
        return messageRepository.save(message);
    }

    @Override
    public Optional<Message> getMessageById(UUID id) { // Implemented getMessageById
        return messageRepository.findById(id);
    }
}
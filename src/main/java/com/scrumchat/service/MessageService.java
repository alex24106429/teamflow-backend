package com.scrumchat.service;

import com.scrumchat.model.Message;
import com.scrumchat.repository.MessageRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.UUID;

@Service
public class MessageService {
    
    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    public Optional<Message> getMessageById(UUID id) {
        return messageRepository.findById(id);
    }
}
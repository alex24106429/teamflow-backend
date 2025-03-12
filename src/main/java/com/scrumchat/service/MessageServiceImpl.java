package com.scrumchat.service;

import com.scrumchat.model.Message;
import com.scrumchat.repository.MessageRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

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
}
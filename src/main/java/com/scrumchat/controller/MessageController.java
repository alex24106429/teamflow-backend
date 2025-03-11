package com.scrumchat.controller;

import com.scrumchat.model.Message;
import com.scrumchat.service.MessageService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/sprints")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/{sprintId}/messages")
    public List<Message> getMessagesBySprintId(@PathVariable UUID sprintId) {
        return messageService.getMessagesBySprintId(sprintId);
    }
}
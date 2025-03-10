package com.scrumchat.controller;

import com.scrumchat.model.Message;
import com.scrumchat.model.User;
import com.scrumchat.model.Sprint;
import com.scrumchat.service.MessageService;
import com.scrumchat.service.SprintService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {
    
    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final SprintService sprintService;

    public MessageController(SimpMessagingTemplate messagingTemplate, 
                            MessageService messageService,
                            SprintService sprintService) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
        this.sprintService = sprintService;
    }

    @MessageMapping("/chat/{sprintId}")
    public void handleMessage(@DestinationVariable String sprintId, String messageContent) {
        // Get authenticated user from security context
        User sender = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        // Get sprint from repository
        Sprint sprint = sprintService.getSprintById(sprintId)
            .orElseThrow(() -> new RuntimeException("Sprint not found"));
        
        // Create and persist message
        Message message = new Message();
        message.setContent(messageContent);
        message.setSender(sender);
        message.setSprint(sprint);
        messageService.saveMessage(message);
        
        // Broadcast to subscribers
        messagingTemplate.convertAndSend("/topic/chat/" + sprintId, messageContent);
    }
}
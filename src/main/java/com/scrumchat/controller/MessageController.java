package com.scrumchat.controller;

import com.scrumchat.model.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {
    
    private final SimpMessagingTemplate messagingTemplate;

    public MessageController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat/{sprintId}")
    public void handleMessage(@DestinationVariable String sprintId, String messageContent) {
        messagingTemplate.convertAndSend("/topic/chat/" + sprintId, messageContent);
    }
}
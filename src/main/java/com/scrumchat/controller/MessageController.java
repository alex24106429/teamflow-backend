package com.scrumchat.controller;

import com.scrumchat.model.Message;
import com.scrumchat.model.User;
import com.scrumchat.model.Sprint;
import com.scrumchat.repository.UserRepository;
import com.scrumchat.service.MessageService;
import com.scrumchat.service.SprintService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class MessageController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final SprintService sprintService;
    private final UserRepository userRepository;

    public MessageController(SimpMessagingTemplate messagingTemplate,
                            MessageService messageService,
                            SprintService sprintService,
                            UserRepository userRepository) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
        this.sprintService = sprintService;
        this.userRepository = userRepository;
    }

    @MessageMapping("/chat/{sprintId}")
    public void handleMessage(Principal principal, @DestinationVariable String sprintId, String messageContent) {
        // Get authenticated user from principal
        if (principal != null) {
            String username = principal.getName(); // Get username from Principal
            User sender = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username)); // Fetch User object using UserRepository

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
        } else {
            // Handle case where principal is null, e.g., log an error or throw an exception
            System.err.println("Principal is null, authentication failed for WebSocket message.");
            // Optionally throw an exception or handle it as needed
        }
    }
}
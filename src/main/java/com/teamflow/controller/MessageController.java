package com.teamflow.controller;

import com.teamflow.dto.MessageDto;
import com.teamflow.dto.UserDto;
import com.teamflow.model.Message;
import com.teamflow.model.MessageContent; // Added import for MessageContent
import com.teamflow.model.Role;
import com.teamflow.model.Sprint;
import com.teamflow.model.User;
import com.teamflow.repository.UserRepository;
import com.teamflow.service.MessageService;
import com.teamflow.service.SprintService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;
import static java.util.stream.Collectors.toList;

@RestController // Changed back to RestController for REST endpoint, and added @Controller for WebSocket
@Controller
@RequestMapping("/api/sprints/{sprintId}/messages")
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

    @GetMapping
    public List<MessageDto> getMessagesBySprint(@PathVariable UUID sprintId) {
        return messageService.findBySprintId(sprintId).stream()
                .map(message -> new MessageDto(
                        message.getId(),
                        message.getContent().getContent(),
                        convertToUserDto(message.getSender()),
                        message.getSprint().getId(),
                        message.getCreatedAt()
                ))
                .collect(toList());
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
            MessageContent content = new MessageContent(); // Create MessageContent object
            content.setContent(messageContent); // Set the message content
            message.setContent(content); // Set MessageContent to Message
            message.setSender(sender);
            message.setSprint(sprint);
            messageService.saveMessage(message); // saveMessage should now be available

            // Broadcast to subscribers
            messagingTemplate.convertAndSend("/topic/chat/" + sprintId, messageContent);
        } else {
            // Handle case where principal is null, e.g., log an error or throw an exception
            System.err.println("Principal is null, authentication failed for WebSocket message.");
            // Optionally throw an exception or handle it as needed
        }
    }

    private UserDto convertToUserDto(User user) {
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.isEnabled(),
                user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(toList())
        );
    }
}
package com.teamflow.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamflow.dto.MessageDto;
import com.teamflow.dto.UserDto;
import com.teamflow.model.Message;
import com.teamflow.model.MessageContent;
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

import java.time.LocalDateTime;
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
                .map(message -> {
                    String content = message.getContent() != null ? message.getContent().getContent() : null;
                    return new MessageDto(
                            message.getId(),
                            content,
                            convertToUserDto(message.getSender()),
                            message.getSprint().getId(),
                            message.getCreatedAt()
                    );
                })
                .collect(toList());
    }

    @MessageMapping("/chat/{sprintId}")
    public void handleMessage(@DestinationVariable String sprintId, String messageContent) {
        try {
            // For testing purposes, use a default user if authentication is not available
            User sender = userRepository.findByUsername("tester")
                    .orElseGet(() -> {
                        System.out.println("Using default user for testing");
                        return userRepository.findAll().stream().findFirst()
                                .orElseThrow(() -> new RuntimeException("No users found in the system"));
                    });

            // Get sprint from repository
            Sprint sprint = sprintService.getSprintById(sprintId)
                .orElseThrow(() -> new RuntimeException("Sprint not found"));

            // Parse the message content from JSON
            // The client sends: JSON.stringify({ content })
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(messageContent);
            String content = jsonNode.has("content") ? jsonNode.get("content").asText() : messageContent;

            // Create and persist message
            Message message = new Message();
            message.setContent(new MessageContent(content));
            message.setSender(sender);
            message.setSprint(sprint);
            message.setCreatedAt(LocalDateTime.now());
            Message savedMessage = messageService.saveMessage(message);

            // Create DTO for broadcasting
            MessageDto messageDto = new MessageDto(
                savedMessage.getId(),
                savedMessage.getContent().getContent(),
                convertToUserDto(savedMessage.getSender()),
                savedMessage.getSprint().getId(),
                savedMessage.getCreatedAt()
            );

            // Broadcast to subscribers
            messagingTemplate.convertAndSend("/topic/chat/" + sprintId, messageDto);
        } catch (Exception e) {
            System.err.println("Error handling WebSocket message: " + e.getMessage());
            e.printStackTrace();
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
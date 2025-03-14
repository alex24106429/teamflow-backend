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

@RestController
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
    public void handleMessage(@DestinationVariable String sprintId, String messageContent,
                             org.springframework.messaging.simp.stomp.StompHeaderAccessor headerAccessor) {
        try {
            // Get the authenticated user's username from the StompHeaderAccessor
            String username = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : null;
            
            if (username == null) {
                throw new RuntimeException("User not authenticated");
            }
            
            User sender = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));

            Sprint sprint = sprintService.getSprintById(UUID.fromString(sprintId));

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(messageContent);
            String content = jsonNode.has("content") ? jsonNode.get("content").asText() : messageContent;

            Message message = new Message();
            message.setContent(new MessageContent(content));
            message.setSender(sender);
            message.setSprint(sprint);
            message.setCreatedAt(LocalDateTime.now());
            Message savedMessage = messageService.saveMessage(message);

            MessageDto messageDto = new MessageDto(
                savedMessage.getId(),
                savedMessage.getContent().getContent(),
                convertToUserDto(savedMessage.getSender()),
                savedMessage.getSprint().getId(),
                savedMessage.getCreatedAt()
            );

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
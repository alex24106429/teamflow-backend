package com.teamflow.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamflow.dto.MessageDto;
import com.teamflow.dto.UserDto;
import com.teamflow.model.*;
import com.teamflow.repository.UserRepository;
import com.teamflow.service.*;
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
public class MessageController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final SprintService sprintService;
    private final EpicService epicService;
    private final UserStoryService userStoryService;
    private final TaskService taskService;
    private final UserRepository userRepository;

    public MessageController(SimpMessagingTemplate messagingTemplate,
                            MessageService messageService,
                            SprintService sprintService,
                            EpicService epicService,
                            UserStoryService userStoryService,
                            TaskService taskService,
                            UserRepository userRepository) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
        this.sprintService = sprintService;
        this.epicService = epicService;
        this.userStoryService = userStoryService;
        this.taskService = taskService;
        this.userRepository = userRepository;
    }

    // Sprint Messages
    @GetMapping("/api/sprints/{sprintId}/messages")
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

    // Epic Messages
    @GetMapping("/api/epics/{epicId}/messages")
    public List<MessageDto> getMessagesByEpic(@PathVariable UUID epicId) {
        return messageService.findByEpicId(epicId).stream()
                .map(message -> {
                    String content = message.getContent() != null ? message.getContent().getContent() : null;
                    return new MessageDto(
                            message.getId(),
                            content,
                            convertToUserDto(message.getSender()),
                            message.getEpic().getId(),
                            "EPIC",
                            message.getCreatedAt()
                    );
                })
                .collect(toList());
    }

    // User Story Messages
    @GetMapping("/api/user-stories/{userStoryId}/messages")
    public List<MessageDto> getMessagesByUserStory(@PathVariable UUID userStoryId) {
        return messageService.findByUserStoryId(userStoryId).stream()
                .map(message -> {
                    String content = message.getContent() != null ? message.getContent().getContent() : null;
                    return new MessageDto(
                            message.getId(),
                            content,
                            convertToUserDto(message.getSender()),
                            message.getUserStory().getId(),
                            "USER_STORY",
                            message.getCreatedAt()
                    );
                })
                .collect(toList());
    }

    // Task Messages
    @GetMapping("/api/tasks/{taskId}/messages")
    public List<MessageDto> getMessagesByTask(@PathVariable UUID taskId) {
        return messageService.findByTaskId(taskId).stream()
                .map(message -> {
                    String content = message.getContent() != null ? message.getContent().getContent() : null;
                    return new MessageDto(
                            message.getId(),
                            content,
                            convertToUserDto(message.getSender()),
                            message.getTask().getId(),
                            "TASK",
                            message.getCreatedAt()
                    );
                })
                .collect(toList());
    }

    // WebSocket handlers
    @MessageMapping("/chat/sprint/{sprintId}")
    public void handleSprintMessage(@DestinationVariable String sprintId, String messageContent,
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
                "SPRINT",
                savedMessage.getCreatedAt()
            );

            messagingTemplate.convertAndSend("/topic/chat/sprint/" + sprintId, messageDto);
        } catch (Exception e) {
            System.err.println("Error handling WebSocket message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @MessageMapping("/chat/epic/{epicId}")
    public void handleEpicMessage(@DestinationVariable String epicId, String messageContent,
                             org.springframework.messaging.simp.stomp.StompHeaderAccessor headerAccessor) {
        try {
            String username = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : null;
            
            if (username == null) {
                throw new RuntimeException("User not authenticated");
            }
            
            User sender = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));

            Epic epic = epicService.getEpicById(UUID.fromString(epicId))
                    .orElseThrow(() -> new RuntimeException("Epic not found: " + epicId));

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(messageContent);
            String content = jsonNode.has("content") ? jsonNode.get("content").asText() : messageContent;

            Message message = new Message();
            message.setContent(new MessageContent(content));
            message.setSender(sender);
            message.setEpic(epic);
            message.setCreatedAt(LocalDateTime.now());
            Message savedMessage = messageService.saveMessage(message);

            MessageDto messageDto = new MessageDto(
                savedMessage.getId(),
                savedMessage.getContent().getContent(),
                convertToUserDto(savedMessage.getSender()),
                savedMessage.getEpic().getId(),
                "EPIC",
                savedMessage.getCreatedAt()
            );

            messagingTemplate.convertAndSend("/topic/chat/epic/" + epicId, messageDto);
        } catch (Exception e) {
            System.err.println("Error handling WebSocket message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @MessageMapping("/chat/user-story/{userStoryId}")
    public void handleUserStoryMessage(@DestinationVariable String userStoryId, String messageContent,
                             org.springframework.messaging.simp.stomp.StompHeaderAccessor headerAccessor) {
        try {
            String username = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : null;
            
            if (username == null) {
                throw new RuntimeException("User not authenticated");
            }
            
            User sender = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));

            UserStory userStory = userStoryService.getUserStoryById(UUID.fromString(userStoryId))
                    .orElseThrow(() -> new RuntimeException("User Story not found: " + userStoryId));

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(messageContent);
            String content = jsonNode.has("content") ? jsonNode.get("content").asText() : messageContent;

            Message message = new Message();
            message.setContent(new MessageContent(content));
            message.setSender(sender);
            message.setUserStory(userStory);
            message.setCreatedAt(LocalDateTime.now());
            Message savedMessage = messageService.saveMessage(message);

            MessageDto messageDto = new MessageDto(
                savedMessage.getId(),
                savedMessage.getContent().getContent(),
                convertToUserDto(savedMessage.getSender()),
                savedMessage.getUserStory().getId(),
                "USER_STORY",
                savedMessage.getCreatedAt()
            );

            messagingTemplate.convertAndSend("/topic/chat/user-story/" + userStoryId, messageDto);
        } catch (Exception e) {
            System.err.println("Error handling WebSocket message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @MessageMapping("/chat/task/{taskId}")
    public void handleTaskMessage(@DestinationVariable String taskId, String messageContent,
                             org.springframework.messaging.simp.stomp.StompHeaderAccessor headerAccessor) {
        try {
            String username = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : null;
            
            if (username == null) {
                throw new RuntimeException("User not authenticated");
            }
            
            User sender = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));

            Task task = taskService.getTaskById(UUID.fromString(taskId))
                    .orElseThrow(() -> new RuntimeException("Task not found: " + taskId));

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(messageContent);
            String content = jsonNode.has("content") ? jsonNode.get("content").asText() : messageContent;

            Message message = new Message();
            message.setContent(new MessageContent(content));
            message.setSender(sender);
            message.setTask(task);
            message.setCreatedAt(LocalDateTime.now());
            Message savedMessage = messageService.saveMessage(message);

            MessageDto messageDto = new MessageDto(
                savedMessage.getId(),
                savedMessage.getContent().getContent(),
                convertToUserDto(savedMessage.getSender()),
                savedMessage.getTask().getId(),
                "TASK",
                savedMessage.getCreatedAt()
            );

            messagingTemplate.convertAndSend("/topic/chat/task/" + taskId, messageDto);
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
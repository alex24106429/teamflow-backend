package com.scrumchat.controller;

import com.scrumchat.dto.MessageDto;
import com.scrumchat.dto.UserDto;
import com.scrumchat.model.Message;
import com.scrumchat.model.Role;
import com.scrumchat.model.User;
import com.scrumchat.service.MessageService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import static java.util.stream.Collectors.toList;

@RestController
@RequestMapping("/api/sprints/{sprintId}/messages")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
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
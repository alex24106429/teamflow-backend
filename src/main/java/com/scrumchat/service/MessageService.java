package com.scrumchat.service;

import com.scrumchat.model.Message;
import java.util.List;
import java.util.UUID;

public interface MessageService {
    List<Message> findBySprintId(UUID sprintId);
}
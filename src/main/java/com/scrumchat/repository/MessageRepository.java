package com.scrumchat.repository;

import com.scrumchat.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    List<Message> findBySprintId(UUID sprintId); // Changed parameter type to UUID
}

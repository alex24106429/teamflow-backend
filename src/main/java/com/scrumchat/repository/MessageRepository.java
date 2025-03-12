package com.scrumchat.repository;

import com.scrumchat.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    List<Message> findBySprintId(UUID sprintId);
}

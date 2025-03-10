package com.scrumchat.repository;

import com.scrumchat.model.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface SprintRepository extends JpaRepository<Sprint, UUID> {}

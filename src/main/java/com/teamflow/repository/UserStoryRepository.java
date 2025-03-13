package com.teamflow.repository;

import com.teamflow.model.UserStory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserStoryRepository extends JpaRepository<UserStory, UUID> {
}
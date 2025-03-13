package com.teamflow.repository;

import com.teamflow.model.Epic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EpicRepository extends JpaRepository<Epic, UUID> {
}
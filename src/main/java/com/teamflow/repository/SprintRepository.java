package com.teamflow.repository;

import com.teamflow.model.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SprintRepository extends JpaRepository<Sprint, UUID> {
    List<Sprint> findByTeam_Id(UUID teamId);
}

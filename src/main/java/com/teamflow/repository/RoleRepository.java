package com.teamflow.repository;

import com.teamflow.model.Role;
import com.teamflow.model.Role.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
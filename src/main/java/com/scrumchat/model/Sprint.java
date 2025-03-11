package com.scrumchat.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sprint")
@Data
public class Sprint {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String archivePath;
    @ManyToOne
    private Team team;
}

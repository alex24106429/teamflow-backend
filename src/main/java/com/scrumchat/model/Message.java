package com.scrumchat.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
public class Message {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;
	private String content;
	@ManyToOne
	private User sender;
	private UUID scrumItemId;
	@ManyToOne
	private Sprint sprint;
	private LocalDateTime timestamp;
}

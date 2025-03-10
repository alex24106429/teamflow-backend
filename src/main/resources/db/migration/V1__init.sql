CREATE TABLE "user" (
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
	password VARCHAR(255) NOT NULL
);

CREATE TABLE team (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    current_sprint_id UUID
);

CREATE TABLE sprint (
    id UUID PRIMARY KEY,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    archive_path VARCHAR(255),
    team_id UUID REFERENCES team(id)
);

CREATE TABLE message (
    id UUID PRIMARY KEY,
    content TEXT NOT NULL,
    sender_id UUID REFERENCES "user"(id),
    scrum_item_id UUID,
    sprint_id UUID REFERENCES sprint(id),
    timestamp TIMESTAMP NOT NULL
);

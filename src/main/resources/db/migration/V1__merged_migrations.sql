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

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT true,
    account_non_expired BOOLEAN DEFAULT true,
    credentials_non_expired BOOLEAN DEFAULT true,
    account_non_locked BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS role (
    id UUID PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES users(id),
    role_id UUID REFERENCES role(id),
    PRIMARY KEY (user_id, role_id)
);

MERGE INTO role KEY (id) VALUES ('f866d78a-4ff0-4a60-a443-530eb2f53a7c', 'ROLE_USER');
MERGE INTO role KEY (id) VALUES ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'ROLE_ADMIN');

CREATE TABLE message (
    id UUID PRIMARY KEY,
    content TEXT NOT NULL,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES team(id) ON DELETE CASCADE,
    sprint_id UUID REFERENCES sprint(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_message_team ON message(team_id);
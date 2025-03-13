CREATE TABLE IF NOT EXISTS team (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    current_sprint_id UUID
);

CREATE TABLE IF NOT EXISTS sprint (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
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

CREATE TABLE IF NOT EXISTS epics (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    team_id UUID REFERENCES team(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_stories (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL,
    epic_id UUID REFERENCES epics(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL,
    user_story_id UUID REFERENCES user_stories(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS message (
    id UUID PRIMARY KEY,
    content TEXT NOT NULL,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES team(id) ON DELETE CASCADE,
    sprint_id UUID REFERENCES sprint(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    epic_id UUID REFERENCES epics(id),
    user_story_id UUID REFERENCES user_stories(id),
    task_id UUID REFERENCES tasks(id)
);

CREATE INDEX IF NOT EXISTS idx_message_team ON message(team_id);

INSERT INTO role (id, name)
SELECT 'f866d78a-4ff0-4a60-a443-530eb2f53a7c', 'ROLE_USER'
WHERE NOT EXISTS (SELECT 1 FROM role WHERE id = 'f866d78a-4ff0-4a60-a443-530eb2f53a7c');

INSERT INTO role (id, name)
SELECT 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 'ROLE_ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM role WHERE id = 'a1b2c3d4-e5f6-7890-1234-567890abcdef');

INSERT INTO role (id, name)
SELECT 'd97a7e24-3b6a-4c3d-9f12-5a9e8f1b3c7a', 'ROLE_PRODUCT_OWNER'
WHERE NOT EXISTS (SELECT 1 FROM role WHERE id = 'd97a7e24-3b6a-4c3d-9f12-5a9e8f1b3c7a');

INSERT INTO role (id, name)
SELECT 'e88f9a2b-4d1e-4f5a-bc7d-2a8b1c3d4e5f', 'ROLE_DEVELOPER'
WHERE NOT EXISTS (SELECT 1 FROM role WHERE id = 'e88f9a2b-4d1e-4f5a-bc7d-2a8b1c3d4e5f');
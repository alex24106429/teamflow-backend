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

ALTER TABLE message
ADD COLUMN epic_id UUID REFERENCES epics(id),
ADD COLUMN user_story_id UUID REFERENCES user_stories(id),
ADD COLUMN task_id UUID REFERENCES tasks(id);
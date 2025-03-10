CREATE TABLE message (
    id UUID PRIMARY KEY,
    content TEXT NOT NULL,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES team(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_message_team ON message(team_id);
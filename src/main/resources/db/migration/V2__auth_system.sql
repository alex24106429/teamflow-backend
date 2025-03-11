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

INSERT INTO role (id, name) VALUES ('f866d78a-4ff0-4a60-a443-530eb2f53a7c', 'ROLE_USER') ON CONFLICT DO NOTHING;
INSERT INTO role (id, name) VALUES ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'ROLE_ADMIN') ON CONFLICT DO NOTHING;
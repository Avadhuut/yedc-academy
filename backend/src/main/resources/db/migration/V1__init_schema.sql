CREATE TABLE role (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE account (
    id BIGSERIAL PRIMARY KEY,
    role_id BIGINT NOT NULL REFERENCES role(id),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profile_image VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial roles
INSERT INTO role (name, description) VALUES ('ADMIN', 'Platform Administrator');
INSERT INTO role (name, description) VALUES ('STUDENT', 'Enrolled Student');

-- Seed default admin account (password: admin123)
INSERT INTO account (role_id, full_name, email, password, phone, status)
VALUES (
    (SELECT id FROM role WHERE name = 'ADMIN'),
    'YEDC Admin',
    'admin@yedc.com',
    '$2a$10$6RpAkQ2CiN4/mlq6FhZDo.ZL1X/9n8fgWC3tce09npn9CcTKfg8IS',
    '9000000001',
    'ACTIVE'
);

CREATE TABLE enrollment (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL REFERENCES account(id),
    course_id BIGINT NOT NULL REFERENCES course(id),
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    CONSTRAINT uq_account_course UNIQUE (account_id, course_id)
);

CREATE TABLE payment (
    id BIGSERIAL PRIMARY KEY,
    enrollment_id BIGINT NOT NULL REFERENCES enrollment(id),
    amount NUMERIC(10, 2) NOT NULL,
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    payment_method VARCHAR(50) DEFAULT 'MOCK',
    status VARCHAR(20) DEFAULT 'SUCCESS',
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE progress (
    id BIGSERIAL PRIMARY KEY,
    enrollment_id BIGINT NOT NULL REFERENCES enrollment(id),
    lesson_id BIGINT NOT NULL REFERENCES lesson(id),
    completed BOOLEAN DEFAULT FALSE,
    watch_percentage INT DEFAULT 0,
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_enrollment_lesson UNIQUE (enrollment_id, lesson_id)
);

CREATE INDEX idx_enrollment_account ON enrollment(account_id);
CREATE INDEX idx_enrollment_course ON enrollment(course_id);
CREATE INDEX idx_payment_transaction ON payment(transaction_id);
CREATE INDEX idx_progress_enrollment ON progress(enrollment_id);

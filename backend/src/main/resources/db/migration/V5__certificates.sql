-- V5: Certificates of Completion
CREATE TABLE certificate (
    id                 BIGSERIAL PRIMARY KEY,
    account_id         BIGINT       NOT NULL REFERENCES account(id)    ON DELETE CASCADE,
    course_id          BIGINT       NOT NULL REFERENCES course(id)     ON DELETE CASCADE,
    enrollment_id      BIGINT       NOT NULL REFERENCES enrollment(id) ON DELETE CASCADE,
    certificate_number VARCHAR(40)  NOT NULL UNIQUE,
    issued_at          TIMESTAMP    NOT NULL DEFAULT NOW(),
    UNIQUE (account_id, course_id)
);

CREATE INDEX idx_certificate_account_id ON certificate(account_id);
CREATE INDEX idx_certificate_course_id  ON certificate(course_id);

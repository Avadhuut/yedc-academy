-- V4: Reviews and Ratings
CREATE TABLE review (
    id          BIGSERIAL PRIMARY KEY,
    account_id  BIGINT   NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    course_id   BIGINT   NOT NULL REFERENCES course(id)  ON DELETE CASCADE,
    rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (account_id, course_id)
);

CREATE INDEX idx_review_course_id  ON review(course_id);
CREATE INDEX idx_review_account_id ON review(account_id);

-- Migration V10: Add ON DELETE CASCADE to progress table foreign key constraints
ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_lesson_id_fkey;
ALTER TABLE progress ADD CONSTRAINT progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES lesson(id) ON DELETE CASCADE;

ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_enrollment_id_fkey;
ALTER TABLE progress ADD CONSTRAINT progress_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES enrollment(id) ON DELETE CASCADE;

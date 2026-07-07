# Database Design

**Project Name:** YEDC Academy

---

# 1. Purpose

This document defines the conceptual database design for YEDC Academy.

It identifies the data that must be stored, the relationships between entities, and the rules that maintain data integrity.

---

# 2. Design Principles

- Normalize data to reduce duplication.
- Use meaningful table and column names.
- Enforce integrity with constraints.
- Keep the schema scalable.
- Store business data, not business logic.

---

# 3. Core Tables

## Account
Stores user account information.

Fields:
- id
- role_id
- full_name
- email
- password
- phone
- profile_image
- status
- created_at
- updated_at

---

## Role

Fields:
- id
- name
- description

Relationship:
Role (1) -> (*) Account

---

## Instructor

Fields:
- id
- name
- bio
- experience
- profile_image

Relationship:
Instructor (1) -> (*) Course

---

## Category

Fields:
- id
- name
- description

Relationship:
Category (1) -> (*) Course

---

## Course

Fields:
- id
- category_id
- instructor_id
- title
- subtitle
- description
- price
- thumbnail
- language
- level
- duration
- status
- created_at

Relationship:
Course (1) -> (*) Section

---

## Section

Fields:
- id
- course_id
- title
- display_order

Relationship:
Section (1) -> (*) Lesson

---

## Lesson

Fields:
- id
- section_id
- title
- video_url
- pdf_url
- duration
- preview_enabled
- display_order

---

## Enrollment

Fields:
- id
- account_id
- course_id
- purchased_at
- status

Relationship:
Enrollment (1) -> (1) Payment
Enrollment (1) -> (*) Progress

---

## Progress

Fields:
- id
- enrollment_id
- lesson_id
- completed
- watch_percentage
- completed_at
- updated_at

---

## Payment

Fields:
- id
- enrollment_id
- amount
- transaction_id
- payment_method
- status
- paid_at

---

# 4. Relationships

- Role (1) -> (*) Account
- Category (1) -> (*) Course
- Instructor (1) -> (*) Course
- Course (1) -> (*) Section
- Section (1) -> (*) Lesson
- Account (1) -> (*) Enrollment
- Course (1) -> (*) Enrollment
- Enrollment (1) -> (1) Payment
- Enrollment (1) -> (*) Progress
- Lesson (1) -> (*) Progress

---

# 5. Primary Keys

Every table uses:
- id (Primary Key)

---

# 6. Foreign Keys

- account.role_id -> role.id
- course.category_id -> category.id
- course.instructor_id -> instructor.id
- section.course_id -> course.id
- lesson.section_id -> section.id
- enrollment.account_id -> account.id
- enrollment.course_id -> course.id
- payment.enrollment_id -> enrollment.id
- progress.enrollment_id -> enrollment.id
- progress.lesson_id -> lesson.id

---

# 7. Constraints

- email must be unique
- transaction_id must be unique
- course price >= 0
- one enrollment per student per course
- display_order unique for lessons within a section
- display_order unique for sections within a course

---

# 8. Index Strategy

Recommended indexes:

- account.email
- course.category_id
- enrollment.account_id
- enrollment.course_id
- payment.transaction_id

---

# 9. Audit Fields

Important tables should include:
- created_at
- updated_at
- created_by (future)
- updated_by (future)

---

# 10. Soft Delete Strategy

Published courses should not be deleted.

Use:
- status = ACTIVE
- status = INACTIVE

instead of physical deletion.

---

# 11. Future Tables

- Review
- Certificate
- Coupon
- Wishlist
- Blog
- Notification
- Live Session

---

# Document Information

**Document:** Database Design

**Version:** 1.0

**Status:** Draft

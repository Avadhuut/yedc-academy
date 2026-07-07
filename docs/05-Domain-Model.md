# Domain Model

**Project Name:** YEDC Academy

---

# 1. Purpose

This document defines the core business entities (Domain Model) of YEDC Academy.

The domain model represents the real-world objects that exist in the business before designing the database.

---

# 2. What is a Domain Model?

A domain model identifies:

- Business entities
- Relationships
- Responsibilities
- Business terminology

It is independent of programming languages and databases.

---

# 3. Core Business Entities

## Account
Represents every person who can access the platform.

Responsibilities:
- Authentication
- Profile Management
- Course Ownership

---

## Role

Defines permissions.

Examples:
- STUDENT
- ADMIN

Relationship:
- One Role -> Many Accounts

---

## Instructor

Represents the creator of a course.

Stores:
- Name
- Biography
- Experience
- Profile Image

Relationship:
- One Instructor -> Many Courses

---

## Category

Groups courses.

Examples:
- Business Startup
- Marketing
- Finance
- Sales

Relationship:
- One Category -> Many Courses

---

## Course

Represents a complete learning program.

Contains:
- Sections
- Lessons
- Price
- Description

Relationship:
- One Course -> Many Sections

---

## Section

Logical grouping of lessons.

Relationship:
- One Section -> Many Lessons

---

## Lesson

Smallest learning unit.

Contains:
- Video
- PDF
- Duration
- Preview Flag

---

## Enrollment

Represents ownership of a course by a student.

Relationship:
- One Account -> Many Enrollments
- One Course -> Many Enrollments

Business Rule:
One student cannot enroll twice in the same course.

---

## Progress

Tracks learning progress.

Stores:
- Completed Lesson
- Watch Percentage
- Completion Date

Relationship:
- One Enrollment -> Many Progress Records

---

## Payment

Represents payment information.

Stores:
- Amount
- Status
- Transaction ID
- Payment Date

Relationship:
- One Enrollment -> One Payment

---

# 4. Relationships

Category (1) ------ (*) Course

Instructor (1) ---- (*) Course

Course (1) -------- (*) Section

Section (1) ------- (*) Lesson

Role (1) ---------- (*) Account

Account (1) ------- (*) Enrollment

Course (1) -------- (*) Enrollment

Enrollment (1) ---- (1) Payment

Enrollment (1) ---- (*) Progress

Lesson (1) -------- (*) Progress

---

# 5. Business Flow

Visitor
↓

Account

↓

Browse Courses

↓

Enrollment

↓

Payment

↓

Learning

↓

Progress

↓

Completion

---

# 6. Benefits

A proper domain model:

- Improves communication
- Reduces design mistakes
- Simplifies database design
- Simplifies API design
- Improves maintainability

---

# 7. Future Entities

Future versions may introduce:

- Review
- Certificate
- Coupon
- Order
- Wishlist
- Blog
- Live Session
- Community
- Notification

---

# Document Information

**Document:** Domain Model

**Version:** 1.0

**Status:** Draft

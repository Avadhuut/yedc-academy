# Development Plan

**Project Name:** YEDC Academy

---

# 1. Purpose

This document defines how YEDC Academy will be developed from project initialization to production deployment.

The objective is to deliver the project in small, testable, and production-ready milestones.

---

# 2. Development Philosophy

We will follow a **Vertical Slice Architecture** approach.

For every feature:

1. Requirements
2. Business Rules
3. UI Design
4. Database Design
5. API Design
6. Backend Development
7. Frontend Development
8. Testing
9. Documentation
10. Git Commit

No feature is considered complete until every step is finished.

---

# 3. Milestones

## Milestone 0 - Project Foundation
- Create Git repository
- Setup frontend (Next.js)
- Setup backend (Spring Boot)
- Configure PostgreSQL
- Configure Docker
- Create project structure
- Initial documentation

Deliverable:
Project runs locally.

---

## Milestone 1 - Authentication

Features:
- Register
- Login
- Logout
- Forgot Password
- JWT Authentication
- Profile

Deliverable:
Users can securely access the platform.

---

## Milestone 2 - Public Website

Features:
- Home
- About
- Courses
- Course Details
- Contact
- Search

Deliverable:
Visitors can explore the academy.

---

## Milestone 3 - Course Management

Features:
- Categories
- Create Course
- Update Course
- Publish Course
- Archive Course

Deliverable:
Admin can manage courses.

---

## Milestone 4 - Lesson Management

Features:
- Create Sections
- Upload Videos
- Upload PDFs
- Preview Lessons

Deliverable:
Complete course content is available.

---

## Milestone 5 - Enrollment

Features:
- Mock Payment
- Enrollment
- My Courses

Deliverable:
Students own purchased courses.

---

## Milestone 6 - Learning Management System

Features:
- Video Player
- Progress Tracking
- Resume Learning
- Lesson Navigation
- Resource Downloads

Deliverable:
Students can complete courses online.

---

## Milestone 7 - Admin Dashboard

Features:
- Dashboard
- Student Management
- Payment Overview
- Reports

Deliverable:
Business administration portal.

---

## Milestone 8 - Reviews

Features:
- Ratings
- Reviews

---

## Milestone 9 - Certificates

Features:
- Certificate Generation
- Certificate Download

---

## Milestone 10 - Payment Gateway

Replace mock payment with:
- Razorpay Integration

---

## Milestone 11 - Production Deployment

- Docker Compose
- Nginx
- HTTPS
- VPS Deployment
- Domain Configuration

Deliverable:
Live production application.

---

# 4. Sprint Planning

Example:

Sprint 1
- Project Setup
- Authentication

Sprint 2
- Public Website

Sprint 3
- Course Management

Sprint 4
- Learning System

Sprint 5
- Payment & Enrollment

---

# 5. Git Workflow

Main Branches:
- main
- develop

Feature Branch Naming:
- feature/authentication
- feature/course-management
- feature/payment

Bug Fix Branch:
- bugfix/<issue-name>

---

# 6. Commit Convention

Examples:

feat: add authentication module

fix: resolve login validation bug

docs: update API documentation

refactor: improve course service

test: add enrollment tests

---

# 7. Definition of Done (DoD)

A feature is complete only when:

- Requirements implemented
- Backend completed
- Frontend completed
- API documented
- Unit tested
- Integration tested
- Documentation updated
- Code reviewed
- Git merged
- No critical bugs

---

# 8. Testing Strategy

Testing includes:

- Unit Testing
- Integration Testing
- API Testing
- UI Testing
- Manual Testing

---

# 9. Release Strategy

Release after completing each milestone.

Versioning Example:

v0.1.0 - Authentication

v0.2.0 - Public Website

v0.3.0 - Course Management

v1.0.0 - MVP Release

---

# 10. Future Improvements

- CI/CD Pipeline
- Automated Deployment
- Monitoring
- Logging
- Performance Optimization
- Kubernetes
- Microservices

---

# Document Information

**Document:** Development Plan

**Version:** 1.0

**Status:** Draft

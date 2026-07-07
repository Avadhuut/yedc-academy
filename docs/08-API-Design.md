# API Design

**Project Name:** YEDC Academy

---

# 1. Purpose

This document defines the REST API contract between the frontend and backend.

The APIs describe how clients interact with the YEDC Academy platform.

---

# 2. API Design Principles

- RESTful architecture
- Resource-based URLs
- Stateless communication
- JSON request/response
- Consistent error handling
- API versioning

---

# 3. Base URL

```
/api/v1
```

---

# 4. Authentication APIs

## Register

POST /api/v1/auth/register

Purpose:
Create a new account.

---

## Login

POST /api/v1/auth/login

Purpose:
Authenticate user and return JWT.

---

## Logout

POST /api/v1/auth/logout

Purpose:
Invalidate user session (client-side token removal in MVP).

---

## Forgot Password

POST /api/v1/auth/forgot-password

---

## Reset Password

POST /api/v1/auth/reset-password

---

# 5. Account APIs

## Get Profile

GET /api/v1/me

Authentication:
Required

---

## Update Profile

PUT /api/v1/me

---

## Change Password

PUT /api/v1/me/password

---

# 6. Course APIs

## Get All Courses

GET /api/v1/courses

Public

---

## Get Course Details

GET /api/v1/courses/{courseId}

Public

---

## Search Courses

GET /api/v1/courses/search

Public

---

## Get Categories

GET /api/v1/categories

Public

---

## Get Instructors

GET /api/v1/instructors

Public

---

## Get Instructor Details

GET /api/v1/instructors/{instructorId}

Public

---

# 7. Enrollment APIs

## Purchase Course

POST /api/v1/enrollments

Authentication:
Student

---

## My Courses

GET /api/v1/me/courses

Authentication:
Student

---

# 8. Learning APIs

## Get Curriculum

GET /api/v1/courses/{courseId}/curriculum

---

## Get Lesson

GET /api/v1/lessons/{lessonId}

Requires enrollment.

---

## Update Progress

POST /api/v1/lessons/{lessonId}/progress

---

## Get Progress

GET /api/v1/me/progress

---

# 9. Admin APIs

## Create Course

POST /api/v1/admin/courses

---

## Update Course

PUT /api/v1/admin/courses/{courseId}

---

## Publish Course

PATCH /api/v1/admin/courses/{courseId}/publish

---

## Manage Categories

POST /api/v1/admin/categories
PUT /api/v1/admin/categories/{categoryId}
DELETE /api/v1/admin/categories/{categoryId}

---

## Manage Sections

POST /api/v1/admin/courses/{courseId}/sections
PUT /api/v1/admin/sections/{sectionId}
DELETE /api/v1/admin/sections/{sectionId}

---

## Manage Lessons

POST /api/v1/admin/sections/{sectionId}/lessons
PUT /api/v1/admin/lessons/{lessonId}
DELETE /api/v1/admin/lessons/{lessonId}

---

## Manage Instructors

POST /api/v1/admin/instructors
PUT /api/v1/admin/instructors/{instructorId}
DELETE /api/v1/admin/instructors/{instructorId}

---

## Manage Users

GET /api/v1/admin/users
GET /api/v1/admin/users/{userId}
PUT /api/v1/admin/users/{userId}/status

---

## View Payments

GET /api/v1/admin/payments

---

## Dashboard Analytics

GET /api/v1/admin/analytics/dashboard

---

# 10. Request Standards

- Content-Type: application/json
- Authorization: Bearer <JWT>

---

# 11. Response Standards

Successful responses should include:

- status
- message
- data

Example:

{
  "status": "SUCCESS",
  "message": "Course retrieved successfully.",
  "data": { }
}

---

# 12. Error Handling

Standard error format:

{
  "timestamp": "...",
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "Email already exists."
}

---

# 13. HTTP Status Codes

- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict
- 500 Internal Server Error

---

# 14. Authorization Rules

Public APIs:
- Browse courses
- View course details
- Register
- Login

Student APIs:
- Purchase course
- Watch lessons
- Track progress

Admin APIs:
- Manage courses
- Manage users
- Manage categories
- View reports

---

# 15. Future APIs

- Reviews
- Certificates
- Coupons
- Wishlist
- Notifications
- Live Classes
- Community

---

# Document Information

**Document:** API Design

**Version:** 1.0

**Status:** Draft

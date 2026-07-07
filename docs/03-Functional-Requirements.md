# Functional Requirements

**Project Name:** YEDC Academy

---

# 1. Purpose

This document defines all functional requirements for the YEDC Academy platform.

A functional requirement describes **what the system should do** from the user's perspective.

---

# 2. User Roles

## Visitor (Guest)
Can:
- View Home page
- Browse courses
- Search courses
- View course details
- Register
- Login
- Contact YEDC

Cannot:
- Purchase courses
- Watch paid lessons
- Access dashboard

---

## Student

Can:
- Register/Login
- Purchase courses
- View enrolled courses
- Watch lessons
- Download resources
- Track progress
- Update profile
- Change password

---

## Admin

Can:
- Manage courses
- Manage categories
- Upload lessons
- Publish/Unpublish courses
- Manage students
- View payments
- View reports

---

# 3. Authentication Module

## Registration
System shall:
- Allow new users to register
- Validate required fields
- Ensure unique email
- Store encrypted password

## Login
System shall:
- Authenticate email and password
- Generate JWT token
- Redirect to dashboard

## Forgot Password
System shall:
- Accept registered email
- Generate reset token
- Allow password reset

---

# 4. Course Catalog

System shall:
- Display published courses
- Search by title
- Filter by category
- Display course details
- Show curriculum
- Show preview lessons

---

# 5. Enrollment

System shall:
- Allow purchase of a course
- Prevent duplicate enrollment
- Create enrollment after successful payment
- Display purchased courses

---

# 6. Learning Management

System shall:
- Play videos
- Display lesson list
- Mark lesson complete
- Save learning progress
- Resume learning
- Allow PDF download

---

# 7. Student Dashboard

System shall display:
- Continue learning
- My courses
- Progress
- Profile
- Purchase history

---

# 8. Admin Features

Admin shall:
- Create/Edit/Delete courses
- Upload videos
- Upload PDFs
- Create sections
- Create lessons
- Manage categories
- Manage users
- View analytics

---

# 9. Payment (MVP)

System shall:
- Simulate successful payment
- Generate purchase record
- Unlock purchased course
- Store payment history

Future:
- Razorpay integration

---

# 10. Notifications

System shall:
- Send welcome email
- Send purchase confirmation
- Send password reset email

---

# 11. Error Handling

System shall:
- Show validation errors
- Handle unauthorized access
- Show 404 pages
- Handle server errors gracefully

---

# 12. Non-MVP Features

- Reviews
- Certificates
- Live classes
- Community
- AI Mentor
- Mobile Apps

---

# Document Information

**Document:** Functional Requirements

**Version:** 1.0

**Status:** Draft

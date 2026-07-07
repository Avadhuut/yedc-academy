# Business Rules

**Project Name:** YEDC Academy

---

# 1. Purpose

This document defines the business rules that govern how the YEDC Academy platform operates.

Business rules describe what is allowed, what is not allowed, and how the system should behave in different situations.

---

# 2. Account Rules

## BR-001
Every account must have a unique email address.

## BR-002
A user must register before purchasing any course.

## BR-003
Only authenticated users can access the Student Dashboard.

## BR-004
Passwords must be stored in encrypted form.

---

# 3. Course Rules

## BR-005
Only Admin users can create courses.

## BR-006
Only Published courses are visible to visitors.

## BR-007
Every course must belong to exactly one category.

## BR-008
A course must contain at least one section before it can be published.

## BR-009
Course price cannot be negative.

---

# 4. Section Rules

## BR-010
A section cannot exist without a course.

## BR-011
Sections must have a display order.

---

# 5. Lesson Rules

## BR-012
Every lesson belongs to one section.

## BR-013
Every lesson must contain a video.

## BR-014
PDF resources are optional.

## BR-015
Lessons may be marked as Preview.

Preview lessons can be watched without purchasing the course.

---

# 6. Enrollment Rules

## BR-016
A student can purchase the same course only once.

## BR-017
Enrollment is created in PENDING status when a purchase is initiated. It is activated (marked ACTIVE) only after successful payment.

## BR-018
Only enrolled students can access paid lessons.

---

# 7. Learning Rules

## BR-019
Learning progress is saved automatically.

## BR-020
Students resume from their last watched lesson.

## BR-021
Progress belongs to an Enrollment.

---

# 8. Payment Rules

## BR-022
Failed payments never activate enrollments or unlock courses.

## BR-023
Every payment must have a unique transaction ID.

## BR-024
Payment amount must match the course price.

---

# 9. Admin Rules

## BR-025
Only Admin users can publish or unpublish courses.

## BR-026
Published courses should not be permanently deleted.

Instead, mark them as Inactive.

## BR-027
Admins can edit course details without affecting existing enrollments.

---

# 10. Review Rules (Future)

## BR-028
Only students who purchased a course can submit reviews.

## BR-029
One student can submit only one review per course.

---

# 11. Certificate Rules (Future)

## BR-030
Certificates are generated only after completing all lessons.

Future versions may also require passing a final assessment.

---

# 12. Exception Rules

If payment succeeds but the confirmation page is interrupted:

- Enrollment should still exist.
- Student should retain access.

If a student refreshes the payment page:

- Duplicate enrollments must not be created.

If an unpublished course has enrolled students:

- Existing students keep access.
- New students cannot purchase it.

---

# Document Information

**Document:** Business Rules

**Version:** 1.0

**Status:** Draft

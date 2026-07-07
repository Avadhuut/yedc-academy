# CODING_STANDARDS.md

# Coding Standards

## General Principles

- Follow SOLID principles.
- Prefer composition over inheritance.
- Keep methods small and focused.
- Avoid duplicated logic.
- Write readable code.

## Java

- Java 21
- Constructor Injection only
- Use Records for DTOs when appropriate.
- Use Lombok only where it improves readability.
- Use Bean Validation.
- Global Exception Handler required.

## Spring Boot

Feature-first package structure.

Each module contains:
- controller
- service
- repository
- dto
- mapper
- entity
- validator

## API

- RESTful endpoints
- Versioned (/api/v1)
- Consistent JSON responses
- Standard error model

## Database

- Flyway migrations
- Snake_case table names
- UUID or BIGINT strategy kept consistent
- Soft delete where required

## Frontend

- TypeScript only
- Functional React components
- Reusable components
- Responsive design
- No business logic in UI components

## Git

Commit format:

feat:
fix:
docs:
refactor:
test:
chore:

One feature per commit.

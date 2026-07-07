# PROJECT_CONSTITUTION.md

# Project Constitution

These rules are non-negotiable.

## Product

- Product vision has highest priority.
- MVP first.
- No undocumented features.

## Architecture

- Modular Monolith.
- Feature-first structure.
- REST APIs only.
- PostgreSQL as primary database.

## Development Workflow

For every feature:

1. Requirement
2. Business Rules
3. Database
4. API
5. Backend
6. Frontend
7. Tests
8. Documentation
9. Review

Never skip steps.

## Security

- JWT authentication
- Password hashing
- Role-based authorization
- Validate all input
- Never trust client input

## Quality Gates

A feature is complete only if:

- Backend complete
- Frontend complete
- Tests passing
- API documented
- Documentation updated
- No critical bugs

## Documentation

All architectural changes must update documentation.

## AI Agent Rules

- Never invent APIs.
- Never rename documented endpoints.
- Never modify database relationships without explanation.
- If documentation conflicts, stop and ask for clarification.

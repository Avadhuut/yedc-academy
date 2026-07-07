# System Architecture

**Project Name:** YEDC Academy

---

# 1. Purpose

This document defines the high-level architecture of the YEDC Academy platform.

It explains how different parts of the system interact and why specific architectural decisions were made.

---

# 2. Architecture Goals

- Simplicity
- Scalability
- Maintainability
- Low initial cost
- Future extensibility

---

# 3. Architecture Style

## Chosen Architecture

**Modular Monolith**

Reason:
- Faster development
- Easier debugging
- Lower hosting cost
- Simple deployment
- Easy to evolve into microservices later

---

# 4. High-Level Architecture

User

↓

Browser (Next.js)

↓

REST API (HTTPS)

↓

Spring Boot Backend

↓

PostgreSQL

↓

Local Storage (MVP)

Future:

AWS S3
Redis
CloudFront

---

# 5. Technology Stack

Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

Backend
- Java 21
- Spring Boot

Database
- PostgreSQL

Cache
- Redis (Future)

Storage
- Local Storage (MVP)
- AWS S3 (Future)

Authentication
- Spring Security
- JWT

Deployment
- Docker
- Nginx
- VPS

---

# 6. Backend Modules

- auth
- account
- course
- category
- instructor
- enrollment
- learning
- payment
- notification
- admin
- common

Each module owns its own:
- Controller
- Service
- Repository
- DTOs
- Validation

---

# 7. Communication

Frontend communicates only through REST APIs.

Flow:

Browser

↓

REST API

↓

Spring Boot

↓

Database

Frontend never accesses the database directly.

---

# 8. Authentication Flow

User Login

↓

Credentials Verified

↓

JWT Generated

↓

Browser Stores Token

↓

Authorization Header

↓

Backend Validates Token

↓

Protected Resource

---

# 9. File Storage Strategy

MVP

Application

↓

Local File System

Future

Application

↓

Storage Service

↓

AWS S3

The application should depend on a StorageService abstraction rather than a specific storage implementation.

---

# 10. Deployment Architecture

Internet

↓

Domain

↓

Nginx

↓

Next.js

↓

Spring Boot

↓

PostgreSQL

Initially everything can run on a single VPS.

---

# 11. Folder Structure

yedc-academy/

docs/

frontend/

backend/

docker/

scripts/

README.md

---

# 12. Architecture Decisions (ADR)

ADR-001:
Use Modular Monolith.

ADR-002:
Use REST APIs.

ADR-003:
Use PostgreSQL.

ADR-004:
Store files locally during MVP.

ADR-005:
Use JWT Authentication.

ADR-006:
Deploy using Docker.

---

# 13. Future Evolution

Future improvements:

- Redis
- AWS S3
- CloudFront
- Background Jobs
- Elasticsearch
- Kubernetes
- Microservices

---

# Document Information

**Document:** System Architecture

**Version:** 1.0

**Status:** Draft

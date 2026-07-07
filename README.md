# YEDC Academy

YEDC Academy is India's most trusted online platform for practical entrepreneurship education and business growth. This platform is built with a decoupled architecture utilizing a Java Spring Boot backend and a Next.js frontend.

---

## Tech Stack
- **Backend:** Java 21, Spring Boot 3.3.1, Spring Security (JWT), Spring Data JPA, Flyway, PostgreSQL, Lombok, MapStruct, OpenAPI / Swagger UI.
- **Frontend:** React 18, Next.js 14, Tailwind CSS, TypeScript.
- **Infrastructure:** Docker, Docker Compose.

---

## Directory Structure
- `/backend` - Spring Boot REST APIs and JPA model definitions.
- `/frontend` - Next.js dynamic user dashboard.
- `/docker` - Dockerfiles for build stages.
- `/docs` - Requirements and software design docs.

---

## Local Development Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for direct frontend dev)

### Spin up the Containers
Run both backend and database services:
```bash
docker-compose up --build
```
The database automatically applies schema migrations.

### OpenAPI Swagger Interface
The API documentation is accessible at:
[http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

### Frontend Development Server
Start the frontend dev server locally:
```bash
cd frontend
npm install
npm run dev
```
Access the application at [http://localhost:3000](http://localhost:3000).

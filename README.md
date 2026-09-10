# Ticket System

Backend Intern Assignment implementation based on the supplied assignment PDF.

## Structure

- `backend/` - Golang REST API
- `frontend/` - frontend application scaffold

## Backend

The backend provides:

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `POST /tickets`
- `GET /tickets`
- `GET /tickets/{id}`
- `PATCH /tickets/{id}/status`

Authentication uses JWT. Passwords are bcrypt hashes. Ticket ownership is enforced using the authenticated user's ID.

## Status flow

`open -> in_progress -> closed`

Closed tickets cannot be reopened.

## Local run

```bash
cd backend
go mod tidy
go run ./cmd/server
```

The service runs on port 8080 by default.

## Docker

```bash
docker build -t ticket-system .
docker run -p 8080:8080 ticket-system
curl http://localhost:8080/health
```

Expected:

```json
{"status":"ok"}
```

## Environment

Copy `.env.example` to `.env` if environment variables are needed.

## Frontend

The frontend directory is intentionally kept separate so the backend can be developed and tested independently. It contains a lightweight scaffold for the UI phase.

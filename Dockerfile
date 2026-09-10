FROM golang:1.23-bookworm AS builder

WORKDIR /app
COPY backend/go.mod backend/go.sum* ./backend/
WORKDIR /app/backend
RUN go mod download

COPY backend/ ./
RUN CGO_ENABLED=1 GOOS=linux go build -o /app/ticket-server ./cmd/server

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/ticket-server ./ticket-server

EXPOSE 8080
CMD ["./ticket-server"]

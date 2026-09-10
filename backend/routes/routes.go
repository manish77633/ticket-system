package routes

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"ticket-system/backend/handlers"
	"ticket-system/backend/middleware"
)

func New(auth *handlers.AuthHandler, tickets *handlers.TicketHandler, jwtSecret string) http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.CORS)

	r.Get("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"ok"}`))
	})

	r.Route("/auth", func(r chi.Router) {
		r.Post("/register", auth.Register)
		r.Post("/login", auth.Login)
	})

	r.Group(func(r chi.Router) {
		r.Use(middleware.Auth(jwtSecret))
		r.Post("/tickets", tickets.Create)
		r.Get("/tickets", tickets.List)
		r.Get("/tickets/{id}", tickets.Get)
		r.Patch("/tickets/{id}/status", tickets.UpdateStatus)
	})

	return r
}

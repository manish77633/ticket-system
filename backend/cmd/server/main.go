package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"

	"ticket-system/backend/config"
	"ticket-system/backend/database"
	"ticket-system/backend/handlers"
	"ticket-system/backend/repositories"
	"ticket-system/backend/routes"
	"ticket-system/backend/services"
)

func main() {
	_ = godotenv.Load()
	cfg := config.Load()

	db, err := database.Open(cfg.MongoURI)
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err := db.Client().Disconnect(nil); err != nil {
			log.Println("Error disconnecting from MongoDB:", err)
		}
	}()

	userRepo := repositories.NewUserRepository(db)
	ticketRepo := repositories.NewTicketRepository(db)

	authService := services.NewAuthService(userRepo, cfg.JWTSecret)
	ticketService := services.NewTicketService(ticketRepo)

	authHandler := handlers.NewAuthHandler(authService)
	ticketHandler := handlers.NewTicketHandler(ticketService)

	router := routes.New(authHandler, ticketHandler, cfg.JWTSecret, cfg.FrontendURL)

	addr := ":" + cfg.Port
	log.Printf("ticket-system backend running on %s", addr)
	if err := http.ListenAndServe(addr, router); err != nil {
		log.Fatal(err)
	}
}

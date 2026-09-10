package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port      string
	JWTSecret string
	DBPath    string
}

func Load() Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}
	if _, err := strconv.Atoi(port); err != nil {
		port = "8081"
	}

	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "change-this-secret-in-production"
	}

	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "./ticket_system.db"
	}

	return Config{Port: port, JWTSecret: secret, DBPath: dbPath}
}

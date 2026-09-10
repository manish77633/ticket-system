package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port      string
	JWTSecret string
	MongoURI  string
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

	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
	}

	return Config{
		Port:      port,
		JWTSecret: secret,
		MongoURI:  mongoURI,
	}
}

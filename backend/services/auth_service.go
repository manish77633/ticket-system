package services

import (
	"errors"
	"strings"

	"ticket-system/backend/models"
	"ticket-system/backend/repositories"
	"ticket-system/backend/utils"
)

var ErrInvalidCredentials = errors.New("invalid credentials")
var ErrEmailExists = errors.New("email already exists")

type AuthService struct {
	users *repositories.UserRepository
	secret string
}

func NewAuthService(users *repositories.UserRepository, secret string) *AuthService {
	return &AuthService{users: users, secret: secret}
}

func (s *AuthService) Register(name, email, password string) (models.User, error) {
	name = strings.TrimSpace(name)
	email = strings.ToLower(strings.TrimSpace(email))
	if name == "" || email == "" || password == "" {
		return models.User{}, errors.New("name, email and password are required")
	}
	if len(password) < 6 {
		return models.User{}, errors.New("password must be at least 6 characters")
	}
	if _, err := s.users.GetByEmail(email); err == nil {
		return models.User{}, ErrEmailExists
	}
	hash, err := utils.HashPassword(password)
	if err != nil {
		return models.User{}, err
	}
	return s.users.Create(name, email, hash)
}

func (s *AuthService) Login(email, password string) (string, models.User, error) {
	email = strings.ToLower(strings.TrimSpace(email))
	u, err := s.users.GetByEmail(email)
	if err != nil || !utils.CheckPassword(u.PasswordHash, password) {
		return "", models.User{}, ErrInvalidCredentials
	}
	token, err := utils.GenerateToken(u.ID.Hex(), s.secret)
	return token, u, err
}

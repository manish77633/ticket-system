package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	"ticket-system/backend/services"
	"ticket-system/backend/utils"
)

type AuthHandler struct {
	service *services.AuthService
}

func NewAuthHandler(service *services.AuthService) *AuthHandler {
	return &AuthHandler{service: service}
}

type authRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req authRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.Error(w, http.StatusBadRequest, "invalid JSON")
		return
	}
	u, err := h.service.Register(req.Name, req.Email, req.Password)
	if err != nil {
		if errors.Is(err, services.ErrEmailExists) {
			utils.Error(w, http.StatusConflict, err.Error())
		} else {
			utils.Error(w, http.StatusBadRequest, err.Error())
		}
		return
	}
	utils.JSON(w, http.StatusCreated, map[string]interface{}{
		"id": u.ID, "name": u.Name, "email": u.Email, "created_at": u.CreatedAt,
	})
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req authRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.Error(w, http.StatusBadRequest, "invalid JSON")
		return
	}
	token, u, err := h.service.Login(req.Email, req.Password)
	if err != nil {
		utils.Error(w, http.StatusUnauthorized, "invalid email or password")
		return
	}
	utils.JSON(w, http.StatusOK, map[string]interface{}{
		"token": token,
		"user": map[string]interface{}{"id": u.ID, "name": u.Name, "email": u.Email},
	})
}


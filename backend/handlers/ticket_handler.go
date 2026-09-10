package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"ticket-system/backend/middleware"
	"ticket-system/backend/repositories"
	"ticket-system/backend/services"
	"ticket-system/backend/utils"
)

type TicketHandler struct {
	service *services.TicketService
}

func NewTicketHandler(service *services.TicketService) *TicketHandler {
	return &TicketHandler{service: service}
}

type createTicketRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type updateStatusRequest struct {
	Status string `json:"status"`
}

func currentUserID(r *http.Request) (primitive.ObjectID, bool) {
	return middleware.UserID(r.Context())
}

func parseID(r *http.Request) (primitive.ObjectID, error) {
	return primitive.ObjectIDFromHex(chi.URLParam(r, "id"))
}

func (h *TicketHandler) Create(w http.ResponseWriter, r *http.Request) {
	userID, ok := currentUserID(r)
	if !ok {
		utils.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	var req createTicketRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.Error(w, http.StatusBadRequest, "invalid JSON")
		return
	}
	t, err := h.service.Create(req.Title, req.Description, userID)
	if err != nil {
		utils.Error(w, http.StatusBadRequest, err.Error())
		return
	}
	utils.JSON(w, http.StatusCreated, t)
}

func (h *TicketHandler) List(w http.ResponseWriter, r *http.Request) {
	userID, ok := currentUserID(r)
	if !ok {
		utils.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	tickets, err := h.service.List(userID)
	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "failed to fetch tickets")
		return
	}
	utils.JSON(w, http.StatusOK, tickets)
}

func (h *TicketHandler) Get(w http.ResponseWriter, r *http.Request) {
	userID, ok := currentUserID(r)
	if !ok {
		utils.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	id, err := parseID(r)
	if err != nil || id.IsZero() {
		utils.Error(w, http.StatusBadRequest, "invalid ticket id")
		return
	}
	t, err := h.service.Get(id, userID)
	if errors.Is(err, repositories.ErrNotFound) {
		utils.Error(w, http.StatusNotFound, "ticket not found")
		return
	}
	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "failed to fetch ticket")
		return
	}
	utils.JSON(w, http.StatusOK, t)
}

func (h *TicketHandler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	userID, ok := currentUserID(r)
	if !ok {
		utils.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	id, err := parseID(r)
	if err != nil || id.IsZero() {
		utils.Error(w, http.StatusBadRequest, "invalid ticket id")
		return
	}
	var req updateStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.Error(w, http.StatusBadRequest, "invalid JSON")
		return
	}
	t, err := h.service.UpdateStatus(id, userID, strings.TrimSpace(req.Status))
	if errors.Is(err, repositories.ErrNotFound) {
		utils.Error(w, http.StatusNotFound, "ticket not found")
		return
	}
	if errors.Is(err, services.ErrInvalidStatus) || errors.Is(err, services.ErrInvalidTransition) {
		utils.Error(w, http.StatusBadRequest, err.Error())
		return
	}
	if err != nil {
		utils.Error(w, http.StatusInternalServerError, "failed to update ticket")
		return
	}
	utils.JSON(w, http.StatusOK, t)
}

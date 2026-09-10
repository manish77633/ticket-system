package services

import (
	"errors"
	"strings"

	"ticket-system/backend/models"
	"ticket-system/backend/repositories"
)

var ErrInvalidStatus = errors.New("invalid status")
var ErrInvalidTransition = errors.New("invalid status transition")

type TicketService struct {
	tickets *repositories.TicketRepository
}

func NewTicketService(tickets *repositories.TicketRepository) *TicketService {
	return &TicketService{tickets: tickets}
}

func (s *TicketService) Create(title, description string, userID int64) (models.Ticket, error) {
	title = strings.TrimSpace(title)
	description = strings.TrimSpace(description)
	if title == "" || description == "" {
		return models.Ticket{}, errors.New("title and description are required")
	}
	return s.tickets.Create(title, description, userID)
}

func (s *TicketService) List(userID int64) ([]models.Ticket, error) {
	return s.tickets.ListByUser(userID)
}

func (s *TicketService) Get(id, userID int64) (models.Ticket, error) {
	return s.tickets.GetByID(id, userID)
}

func (s *TicketService) UpdateStatus(id, userID int64, next string) (models.Ticket, error) {
	if next != models.StatusOpen && next != models.StatusInProgress && next != models.StatusClosed {
		return models.Ticket{}, ErrInvalidStatus
	}
	t, err := s.tickets.GetByID(id, userID)
	if err != nil {
		return models.Ticket{}, err
	}
	if t.Status == models.StatusClosed {
		return models.Ticket{}, ErrInvalidTransition
	}
	if t.Status == models.StatusOpen && next != models.StatusInProgress {
		return models.Ticket{}, ErrInvalidTransition
	}
	if t.Status == models.StatusInProgress && next != models.StatusClosed {
		return models.Ticket{}, ErrInvalidTransition
	}
	return s.tickets.UpdateStatus(id, userID, next)
}

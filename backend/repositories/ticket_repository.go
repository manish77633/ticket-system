package repositories

import (
	"database/sql"
	"errors"

	"ticket-system/backend/models"
)

type TicketRepository struct {
	db *sql.DB
}

func NewTicketRepository(db *sql.DB) *TicketRepository {
	return &TicketRepository{db: db}
}

func (r *TicketRepository) Create(title, description string, userID int64) (models.Ticket, error) {
	res, err := r.db.Exec(
		`INSERT INTO tickets(title,description,status,user_id) VALUES(?,?,?,?)`,
		title, description, models.StatusOpen, userID,
	)
	if err != nil {
		return models.Ticket{}, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return models.Ticket{}, err
	}
	return r.GetByID(id, userID)
}

func (r *TicketRepository) ListByUser(userID int64) ([]models.Ticket, error) {
	rows, err := r.db.Query(
		`SELECT id,title,description,status,user_id,created_at
		 FROM tickets WHERE user_id=? ORDER BY id DESC`, userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tickets := make([]models.Ticket, 0)
	for rows.Next() {
		var t models.Ticket
		if err := rows.Scan(&t.ID,&t.Title,&t.Description,&t.Status,&t.UserID,&t.CreatedAt); err != nil {
			return nil, err
		}
		tickets = append(tickets, t)
	}
	return tickets, rows.Err()
}

func (r *TicketRepository) GetByID(id, userID int64) (models.Ticket, error) {
	var t models.Ticket
	err := r.db.QueryRow(
		`SELECT id,title,description,status,user_id,created_at
		 FROM tickets WHERE id=? AND user_id=?`, id, userID,
	).Scan(&t.ID,&t.Title,&t.Description,&t.Status,&t.UserID,&t.CreatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return models.Ticket{}, ErrNotFound
	}
	return t, err
}

func (r *TicketRepository) UpdateStatus(id, userID int64, status string) (models.Ticket, error) {
	res, err := r.db.Exec(
		`UPDATE tickets SET status=? WHERE id=? AND user_id=?`,
		status, id, userID,
	)
	if err != nil {
		return models.Ticket{}, err
	}
	n, err := res.RowsAffected()
	if err != nil {
		return models.Ticket{}, err
	}
	if n == 0 {
		return models.Ticket{}, ErrNotFound
	}
	return r.GetByID(id, userID)
}

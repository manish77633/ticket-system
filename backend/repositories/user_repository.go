package repositories

import (
	"database/sql"
	"errors"

	"ticket-system/backend/models"
)

var ErrNotFound = errors.New("not found")
var ErrDuplicate = errors.New("duplicate")

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(name, email, passwordHash string) (models.User, error) {
	res, err := r.db.Exec(
		`INSERT INTO users(name,email,password_hash) VALUES(?,?,?)`,
		name, email, passwordHash,
	)
	if err != nil {
		return models.User{}, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return models.User{}, err
	}
	return r.GetByID(id)
}

func (r *UserRepository) GetByEmail(email string) (models.User, error) {
	var u models.User
	err := r.db.QueryRow(
		`SELECT id,name,email,password_hash,created_at FROM users WHERE email=?`,
		email,
	).Scan(&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.CreatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return models.User{}, ErrNotFound
	}
	return u, err
}

func (r *UserRepository) GetByID(id int64) (models.User, error) {
	var u models.User
	err := r.db.QueryRow(
		`SELECT id,name,email,password_hash,created_at FROM users WHERE id=?`,
		id,
	).Scan(&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.CreatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return models.User{}, ErrNotFound
	}
	return u, err
}

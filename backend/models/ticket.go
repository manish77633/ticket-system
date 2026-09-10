package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	StatusOpen       = "open"
	StatusInProgress = "in_progress"
	StatusClosed     = "closed"
)

type Ticket struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title       string             `bson:"title" json:"title"`
	Description string             `bson:"description" json:"description"`
	Status      string             `bson:"status" json:"status"`
	UserID      primitive.ObjectID `bson:"user_id" json:"user_id"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
}

package repositories

import (
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"ticket-system/backend/models"
)

type TicketRepository struct {
	collection *mongo.Collection
}

func NewTicketRepository(db *mongo.Database) *TicketRepository {
	return &TicketRepository{collection: db.Collection("tickets")}
}

func (r *TicketRepository) Create(title, description string, userID primitive.ObjectID) (models.Ticket, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	t := models.Ticket{
		ID:          primitive.NewObjectID(),
		Title:       title,
		Description: description,
		Status:      models.StatusOpen,
		UserID:      userID,
		CreatedAt:   time.Now(),
	}

	_, err := r.collection.InsertOne(ctx, t)
	if err != nil {
		return models.Ticket{}, err
	}
	return t, nil
}

func (r *TicketRepository) ListByUser(userID primitive.ObjectID) ([]models.Ticket, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.D{{Key: "_id", Value: -1}})
	cursor, err := r.collection.Find(ctx, bson.M{"user_id": userID}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var tickets []models.Ticket
	if err = cursor.All(ctx, &tickets); err != nil {
		return nil, err
	}
	
	if tickets == nil {
		tickets = []models.Ticket{}
	}
	return tickets, nil
}

func (r *TicketRepository) GetByID(id, userID primitive.ObjectID) (models.Ticket, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var t models.Ticket
	err := r.collection.FindOne(ctx, bson.M{"_id": id, "user_id": userID}).Decode(&t)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return models.Ticket{}, ErrNotFound
		}
		return models.Ticket{}, err
	}
	return t, nil
}

func (r *TicketRepository) UpdateStatus(id, userID primitive.ObjectID, status string) (models.Ticket, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	res, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": id, "user_id": userID},
		bson.M{"$set": bson.M{"status": status}},
	)
	if err != nil {
		return models.Ticket{}, err
	}
	if res.MatchedCount == 0 {
		return models.Ticket{}, ErrNotFound
	}

	return r.GetByID(id, userID)
}

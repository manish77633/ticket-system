package repositories

import (
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"ticket-system/backend/models"
)

var ErrNotFound = errors.New("not found")
var ErrDuplicate = errors.New("duplicate")

type UserRepository struct {
	collection *mongo.Collection
}

func NewUserRepository(db *mongo.Database) *UserRepository {
	return &UserRepository{collection: db.Collection("users")}
}

func (r *UserRepository) Create(name, email, passwordHash string) (models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	u := models.User{
		ID:           primitive.NewObjectID(),
		Name:         name,
		Email:        email,
		PasswordHash: passwordHash,
		CreatedAt:    time.Now(),
	}

	_, err := r.collection.InsertOne(ctx, u)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			return models.User{}, ErrDuplicate
		}
		return models.User{}, err
	}

	return u, nil
}

func (r *UserRepository) GetByEmail(email string) (models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var u models.User
	err := r.collection.FindOne(ctx, bson.M{"email": email}).Decode(&u)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return models.User{}, ErrNotFound
		}
		return models.User{}, err
	}
	return u, nil
}

func (r *UserRepository) GetByID(id primitive.ObjectID) (models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var u models.User
	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&u)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return models.User{}, ErrNotFound
		}
		return models.User{}, err
	}
	return u, nil
}

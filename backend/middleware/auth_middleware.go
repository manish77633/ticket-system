package middleware

import (
	"context"
	"net/http"
	"strings"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"ticket-system/backend/utils"
)

type contextKey string

const userIDKey contextKey = "userID"

func UserID(ctx context.Context) (primitive.ObjectID, bool) {
	v := ctx.Value(userIDKey)
	id, ok := v.(primitive.ObjectID)
	return id, ok
}

func Auth(secret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			header := r.Header.Get("Authorization")
			parts := strings.Fields(header)
			if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
				http.Error(w, `{"error":"missing or invalid authorization header"}`, http.StatusUnauthorized)
				return
			}
			idStr, err := utils.ParseToken(parts[1], secret)
			if err != nil {
				http.Error(w, `{"error":"invalid or expired token"}`, http.StatusUnauthorized)
				return
			}
			
			objID, err := primitive.ObjectIDFromHex(idStr)
			if err != nil {
				http.Error(w, `{"error":"invalid token payload"}`, http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), userIDKey, objID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

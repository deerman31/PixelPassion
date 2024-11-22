package handler

import (
	jwttokens "backend-golang/handler/jwt_tokens"
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
)

func GetUserInfoHandler(db *sql.DB) echo.HandlerFunc {
	secretKey := os.Getenv("JWT_SECRET_KEY")
	return func(c echo.Context) error {
		fmt.Println("GetUserInfoHandler")

		claims, ok := c.Get("user").(*jwttokens.Claims)
		if !ok {
			return echo.NewHTTPError(http.StatusInternalServerError, "user claims not found")
		}
		userID := claims.UserID
	}
}

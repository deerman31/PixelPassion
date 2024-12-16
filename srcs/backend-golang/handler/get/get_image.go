package get

import (
	jwttokens "backend-golang/handler/jwt_tokens"
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
)

const (
	getNowImagePathQuery = "SELECT profile_image_path1 FROM user_info WHERE user_id = ?"
)

func GetImageHandler(db *sql.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		fmt.Println("GetImageHandler")
		claims, ok := c.Get("user").(*jwttokens.Claims)
		if !ok {
			return echo.NewHTTPError(http.StatusInternalServerError, "user claims not found")
		}
		userID := claims.UserID
		// トランザクション開始
		tx, err := db.Begin()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Could not start transaction",
			})
		}
		defer tx.Rollback()
		var imagePath sql.NullString
		err = tx.QueryRow(getNowImagePathQuery, userID).Scan(&imagePath)
		if err != nil && err != sql.ErrNoRows {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Failed to get existing image path",
			})
		}
		retImagePath := ""
		if imagePath.Valid && imagePath.String != "" {
			retImagePath = imagePath.String
		} else {
			retImagePath = os.Getenv("DEFAULT_IMAGE")
		}
		// 画像データを送信する途中

	}
}

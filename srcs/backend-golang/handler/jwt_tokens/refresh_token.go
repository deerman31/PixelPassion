package jwttokens

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
)

type RefreshTokenRequest struct {
	AccessToken  string
	RefreshToken string
}

type RefreshTokenResponse struct {
	AccessToken string
}

const (
	updateUserOfflineStatusQuery = `
        UPDATE users 
        SET is_online = FALSE 
        WHERE id = ?
    `
)

// エラーレスポンスを集約した関数を作成
func newErrorResponse(status int, message string) *echo.HTTPError {
	return echo.NewHTTPError(status, map[string]string{"error": message})
}

func RefreshTokenHandler(db *sql.DB) echo.HandlerFunc {
	secretKey := os.Getenv("JWT_SECRET_KEY")
	return func(c echo.Context) error {
		fmt.Println("RefreshTokenHandler")
		req := new(RefreshTokenRequest)
		// requestのbodyをbind
		if err := c.Bind(req); err != nil {
			return newErrorResponse(http.StatusBadRequest, "Invalid request body")
		}

		// access_tokenを検証
		claims, err := ParseAndValidateToken(req.AccessToken, secretKey)
		if err != nil {
			return newErrorResponse(http.StatusUnauthorized, err.Error())
		}

		userID := claims.UserID

		// トランザクション処理
		tx, err := db.Begin()
		if err != nil {
			return newErrorResponse(http.StatusInternalServerError, "Could not start transaction")
		}
		defer func() {
			if err != nil {
				tx.Rollback()
			}
		}()

		valid, err := ValidateRefreshToken(db, userID, req.RefreshToken)
		if err != nil || !valid {
			// refresh_tokenをdbから削除
			if _, delErr := tx.Exec(DeleteRefreshTokenQuery, userID); delErr != nil {
				return newErrorResponse(http.StatusInternalServerError, delErr.Error())
			}

			if err != nil && err.Error() == "RefreshToken has expired" {
				return newErrorResponse(http.StatusUnauthorized, err.Error())
			}
			return newErrorResponse(http.StatusUnauthorized, "Invalid refresh token")
		}
		// ユーザーのオフラインステータス更新
		result, err := tx.Exec(updateUserOfflineStatusQuery, userID)
		if err != nil {
			return newErrorResponse(http.StatusInternalServerError, err.Error())
		}

		rows, err := result.RowsAffected()
		if err != nil {
			return newErrorResponse(http.StatusInternalServerError, err.Error())
		}
		if rows == 0 {
			return newErrorResponse(http.StatusNotFound, "User not found")
		}

		// トランザクションのコミット
		if err = tx.Commit(); err != nil {
			return newErrorResponse(http.StatusInternalServerError, "Could not commit transaction")
		}

		// 新しいアクセストークンの生成
		accessToken, err := GenerateAccessToken(userID, secretKey)
		if err != nil {
			return newErrorResponse(http.StatusInternalServerError, err.Error())
		}
		return c.JSON(http.StatusOK, RefreshTokenResponse{AccessToken: accessToken})
	}
}

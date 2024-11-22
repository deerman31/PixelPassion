package handler

import (
	jwttokens "backend-golang/handler/jwt_tokens"
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
)

const (
	// ユーザーのオンラインステータスを更新するクエリ
	updateUserOfflineStatusQuery = `
        UPDATE users 
        SET is_online = FALSE 
        WHERE id = ?
    `
)

func LogoutHandler(db *sql.DB) echo.HandlerFunc {
	secretKey := os.Getenv("JWT_SECRET_KEY")
	return func(c echo.Context) error {

		fmt.Println("LogoutHandler")

		// Authorizationヘッダーを取得
		tokenString, err := jwttokens.GetAuthToken(c)
		if err != nil {
			return c.JSON(http.StatusUnauthorized, map[string]string{
				"error": err.Error(),
			})
		}
		claims, err := jwttokens.ParseAndValidateToken(tokenString, secretKey)
		if err != nil {
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
		}
		userID := claims.UserID

		// トランザクションを開始
		tx, err := db.Begin()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not start transaction"})
		}
		defer tx.Rollback() // エラーが発生した場合はロールバック

		// userのis_onlineをfalseにする
		result, err := tx.Exec(updateUserOfflineStatusQuery, userID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}
		// 更新が成功したか確認
		rows, err := result.RowsAffected()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}
		// userが見つからなかった場合
		if rows == 0 {
			return c.JSON(http.StatusNotFound, map[string]string{"error": "User not found"})
		}

		// logoutするのでRefreshTokenは必要ないため、削除する
		if _, err := tx.Exec(jwttokens.DeleteRefreshTokenQuery, userID); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		// トランザクションのコミット
		if err = tx.Commit(); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not commit transaction"})
		}
		return c.JSON(http.StatusOK, map[string]string{"message": "User created successfully. Please check your email to verify your account."})
	}
}

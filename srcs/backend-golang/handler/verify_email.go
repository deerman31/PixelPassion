package handler

import (
	"backend-golang/email"
	"database/sql"
	"fmt"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql" // MySQLドライバーをインポート
	"github.com/labstack/echo/v4"
)

func VerifyEmail(db *sql.DB) echo.HandlerFunc {
	return func(c echo.Context) error {

		// urlに存在するqueryを取得する
		token := c.QueryParam("token")
		if token == "" {
			return c.JSON(http.StatusBadRequest, map[string]string{"message": "Token is required"})
		}

		aaauserID,err:=email.VerifyToken(token)
		if err != nil {
			
		}

		// トランザクション開始
		tx, err := db.Begin()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"message": "Failed to start transaction",
			})
		}
		defer tx.Rollback() // エラー時はロールバック

		// トークンの検証
		var userID int
		//var expiresAt time.Time
		var expiresAt string
		err = tx.QueryRow(`SELECT user_id, expires_at FROM verification_tokens WHERE token = ?`, token).Scan(&userID, &expiresAt)

		if err != nil {
			// エラーの詳細をログ出力
			fmt.Printf("Query error: %v\n", err)

			if err == sql.ErrNoRows {
				return c.JSON(http.StatusNotFound, map[string]string{
					"message": "Invalid verification token",
				})
			}

			return c.JSON(http.StatusInternalServerError, map[string]string{
				"message": "Internal server error",
			})
		}

		// 文字列からtime.Time型に変換
		parsedTime, err := time.Parse("2006-01-02 15:04:05", expiresAt)
		// トークンの有効期限チェック
		if time.Now().After(parsedTime) {
			return c.JSON(http.StatusUnauthorized, map[string]string{
				"message": "Verification token has expired",
			})
		}

		// ユーザーの確認
		var isRegistered bool
		err = tx.QueryRow(`SELECT is_registered FROM users WHERE id = ?`, userID).Scan(&isRegistered)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"message": "Failed to get user information",
			})
		}

		if isRegistered {
			return c.JSON(http.StatusGone, map[string]string{
				"message": "User is already verified",
			})
		}

		// ユーザーの認証状態を更新
		_, err = tx.Exec(`UPDATE users SET is_registered = true WHERE id = ?`, userID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"message": "Failed to update user verification status",
			})
		}

		// Tokenは検証したので削除する
		_, err = tx.Exec("DELETE FROM verification_tokens WHERE token = ?", token)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Failed to delete token"})
		}

		// トランザクションをコミット
		if err = tx.Commit(); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"message": "Failed to commit transaction",
			})
		}

		// ログインページにリダイレクト
		return c.Redirect(http.StatusFound, "/")
	}
}

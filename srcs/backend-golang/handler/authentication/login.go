package authentication

import (
	jwttokens "backend-golang/handler/jwt_tokens"
	"database/sql"
	"errors"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
)



// ErrUserNotFound はユーザーが見つからない場合のエラー
var ErrUserNotFound = errors.New("user not found")

func searchUserDB(tx *sql.Tx, username string) (*User, int, error) {
	user := &User{}
	if err := tx.QueryRow(selectUserByUsernameQuery, username).Scan(
		&user.ID,
		&user.Username,
		&user.HashedPassword,
		&user.isRegistered,
	); err != nil {
		if err == sql.ErrNoRows {
			return nil, http.StatusUnauthorized, ErrUserNotFound
		}
		return nil, http.StatusInternalServerError, fmt.Errorf("database error: %v", err)
	}
	return user, 0, nil
}

func LoginHandler(db *sql.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		/* LoginRequestの新しいポインタを作成
		reqはLoginRequestのポインタ型の変数 */
		req := new(LoginRequest)
		/* HTTPリクエストを受け取り、そのボディの内容をreqという変数にバインド（結びつけ）しています。*/
		if err := c.Bind(req); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		}
		// validationをここで行う
		if err := c.Validate(req); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}
		// トランザクションを開始
		tx, err := db.Begin()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not start transaction"})
		}
		defer tx.Rollback() // エラーが発生した場合はロールバック

		user, status, err := searchUserDB(tx, req.Username)
		if err != nil {
			return c.JSON(status, map[string]string{"error": err.Error()})
		}

		// userがメールで認証済みかどうか確認
		if !user.isRegistered {
			return c.JSON(http.StatusForbidden, map[string]string{"error": "Email not verified"})
		}

		if !comparePassword(user.HashedPassword, req.Password) {
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid password"})
		}
		// ここまでが検証
		// ここからaccess_tokenとrefresh_tokenを生成する
		//tokenPair, err := GenerateTokenPair(user, tx)
		tokenPair, err := jwttokens.GenerateTokenPair(user.ID, tx)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		result, err := tx.Exec(updateUserOnlineStatusQuery, user.ID)
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

		// トランザクションのコミット
		if err = tx.Commit(); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not commit transaction"})
		}

		return c.JSON(http.StatusOK,
			TokenResponse{AccessToken: tokenPair.AccessToken, RefreshToken: tokenPair.RefreshToken})
	}
}

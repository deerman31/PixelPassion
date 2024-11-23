package update

import (
	jwttokens "backend-golang/handler/jwt_tokens"
	"database/sql"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
)


func UpdateEmailHandler(db *sql.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		claims, ok := c.Get("user").(*jwttokens.Claims)
		if !ok {
			return echo.NewHTTPError(http.StatusInternalServerError, "user claims not found")
		}
		userID := claims.UserID

		req := new(UpdateEmailRequest)
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

		// emailの重複をCheck
		status, err := checkDuplicateEmail(tx, req.Email)
		if err != nil {
			return c.JSON(status, map[string]string{"error": err.Error()})
		}

		if status, err := executeEmailUpdate(tx, req.Email, userID); err != nil {
			return c.JSON(status, map[string]string{"error": err.Error()})
		}
		// トランザクションのコミット
		if err = tx.Commit(); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not commit transaction"})
		}
		return c.JSON(http.StatusOK, map[string]string{"message": "Update Email successfully."})

	}
}

func executeEmailUpdate(tx *sql.Tx, email string, userID int) (int, error) {
	result, err := tx.Exec(updateEmailQuery, email, userID)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	// 更新が成功したか確認
	rows, err := result.RowsAffected()
	if err != nil {
		return http.StatusInternalServerError, err
	}
	// userが見つからなかった場合
	if rows == 0 {
		return http.StatusNotFound, fmt.Errorf("User not found")
	}
	return 0, nil
}

func checkDuplicateEmail(tx *sql.Tx, email string) (int, error) {
	if email == "" {
		return http.StatusBadRequest, fmt.Errorf("email cannot be empty")
	}
	var emailExists bool
	err := tx.QueryRow(checkDuplicateUsernameQuery, email).Scan(&emailExists)

	switch {
	case err == sql.ErrNoRows:
		return http.StatusNotFound, fmt.Errorf("database query returned no rows")
	case err != nil:
		return http.StatusInternalServerError, fmt.Errorf("database error while checking email: %w", err)
	case emailExists:
		return http.StatusConflict, fmt.Errorf("email %q is already taken", email)
	default:
		return http.StatusOK, nil
	}
}

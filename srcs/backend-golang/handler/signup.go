package handler

import (
	"database/sql"
	"net/http"

	"github.com/labstack/echo/v4"
)

type SignupRequest struct {
	Username  string `json:"username"`
	Email     string `json:"email"`
	Lastname  string `json:"lastname"`
	Firstname string `json:"firstname"`
	Password  string `json:"password"`
    IsGpsEnabled bool `json:"isGpsEnabled"`
    Gender string `json:"gender"`
    SexualOrientation string `json:"sexual_orientation"`
    Eria string `json:"eria"`
}

func Signup(db *sql.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		req := new(SignupRequest)
		if err := c.Bind(req); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		}

		// validationをここで行う

		// トランザクションを開始
		tx, err := db.Begin()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not start transaction"})
		}
		defer tx.Rollback() // エラーが発生した場合はロールバック

		// ユーザー名の重複チェック
		if err := checkUsernameExists(tx, req.Username); err != nil {
			return c.JSON(http.StatusConflict, map[string]string{"error": err.Error()})
		}

		if err := checkEmailExists(tx, req.Email); err != nil {
			return c.JSON(http.StatusConflict, map[string]string{"error": err.Error()})
		}

 		// ユーザーの登録
 		if err := createUser(tx, req); err != nil {
 			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create user"})
 		}

		// トランザクションをコミット
		if err = tx.Commit(); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not commit transaction"})
		}

		return c.JSON(http.StatusCreated, map[string]string{"message": "User created successfully"})
	}
}

func checkUsernameExists(tx *sql.Tx, username string) error {
	var exists bool
	err := tx.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username = ?)", username).Scan(&exists)
	if err != nil {
		return err
	}
	if exists {
		return echo.NewHTTPError(http.StatusConflict, "Username already exists")
	}
	return nil
}

func checkEmailExists(tx *sql.Tx, email string) error {
	var exists bool
	err := tx.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)", email).Scan(&exists)
	if err != nil {
		return err
	}
	if exists {
		return echo.NewHTTPError(http.StatusConflict, "Email already exists")
	}
	return nil
}

func createUser(tx *sql.Tx, req *SignupRequest) error {
	_, err := tx.Exec("INSERT INTO users (username, email, lastname, firstname, password, is_gps, gender, sexual_orientation, eria) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
		req.Username, req.Email, req.Lastname, req.Firstname, req.Password, req.IsGpsEnabled, req.Gender, req.SexualOrientation, req.Eria)
	return err
}
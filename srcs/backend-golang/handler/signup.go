package handler

import (
	"backend-golang/email"
	"database/sql"
	"fmt"
	"net/http"

	"golang.org/x/crypto/bcrypt"

	"github.com/labstack/echo/v4"
)

type SignupRequest struct {
	Username   string `json:"username" validate:"required,username"`
	Email      string `json:"email" validate:"required,email"`
	Lastname   string `json:"lastname" validate:"required,name"`
	Firstname  string `json:"firstname" validate:"required,name"`
	Password   string `json:"password" validate:"required,password"`
	RePassword string `json:"repassword" validate:"required,password"`

	IsGpsEnabled bool `json:"isGpsEnabled" validate:"required"`

	Gender            string `json:"gender" validate:"required,oneof=male female"`
	SexualOrientation string `json:"sexual_orientation" validate:"required,oneof=heterosexual homosexual bisexual"`

	Eria string `json:"eria" validate:"required,eria"`
}

func SignupHandler(db *sql.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		req := new(SignupRequest)
		if err := c.Bind(req); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		}

		// passwordとrepasswordが同じかをCheckする
		if req.Password != req.RePassword {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Password and confirm password do not match"})
		}

		// validationをここで行う
		// Echo のグローバルバリデータを使用
		if err := c.Validate(req); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}

		// トランザクションを開始
		tx, err := db.Begin()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not start transaction"})
		}
		defer tx.Rollback() // エラーが発生した場合はロールバック

		// usernameとemailの重複をcheck
		n, err := checkDuplicateUserCredentials(tx, req.Username, req.Email)
		if err != nil {
			return c.JSON(n, map[string]string{"error": err.Error()})
		}

		// このタイミングでパスワードをハッシュ化する
		hashedBytes, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}
		req.Password = string(hashedBytes)

		// ユーザーの登録
		userID, err := createUser(tx, req)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create user"})
		}

		// 確認Tokenを生成
		token, err := email.GenerateVerificationToken(userID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to generate verification token"})
		}

		// 確認メールを送信
		if err := email.SendVerificationEmail(req.Email, token); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to send verification email"})
		}

		// トランザクションをコミット
		if err = tx.Commit(); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not commit transaction"})
		}

		return c.JSON(http.StatusCreated, map[string]string{"message": "User created successfully. Please check your email to verify your account."})
	}
}

func checkDuplicateUserCredentials(tx *sql.Tx, username, email string) (int, error) {
	// 1つのクエリで両方をチェック
	const query = `
        SELECT 
            EXISTS(SELECT 1 FROM users WHERE username = ?) as username_exists,
            EXISTS(SELECT 1 FROM users WHERE email = ?) as email_exists
	`
	var usernameExists, emailExists bool
	err := tx.QueryRow(query, username, email).Scan(&usernameExists, &emailExists)
	if err != nil {
		// エラーメッセージをより具体的に
		return http.StatusInternalServerError, fmt.Errorf("failed to check credentials: %w", err)
	}

	// 存在チェックの順序を明確に
	switch {
	case usernameExists:
		return http.StatusConflict, fmt.Errorf("username %s is already taken", username)
	case emailExists:
		return http.StatusConflict, fmt.Errorf("email %s is already registered", email)
	default:
		return http.StatusOK, nil
	}
}

func createUser(tx *sql.Tx, req *SignupRequest) (int, error) {
	/*
		SQLのINSERT文でreqの情報をusersテーブルに挿入している.
		挿入が成功すると、resultオブジェクトが返される.
		LastInsertId()メソッドは新しく作成されたUserIDを返す.
	*/
	result, err := tx.Exec("INSERT INTO users (username, email, lastname, firstname, password, is_gps, gender, sexual_orientation, eria) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
		req.Username, req.Email, req.Lastname, req.Firstname, req.Password, req.IsGpsEnabled, req.Gender, req.SexualOrientation, req.Eria)
	if err != nil {
		return 0, err
	}
	userID, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(userID), err
}

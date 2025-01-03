package authentication

import (
	"backend-golang/email"
	"database/sql"
	"fmt"
	"net/http"

	"golang.org/x/crypto/bcrypt"

	"github.com/labstack/echo/v4"
)

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
		status, err := checkDuplicateUserCredentials(tx, req.Username, req.Email)
		if err != nil {
			return c.JSON(status, map[string]string{"error": err.Error()})
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
	var usernameExists, emailExists bool
	err := tx.QueryRow(checkDuplicateCredentialsQuery, username, email).Scan(&usernameExists, &emailExists)
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
	result, err := tx.Exec(insertNewUserQuery, req.Username, req.Email, req.Password)
	if err != nil {
		return 0, err
	}
	userID, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}
	if _, err := tx.Exec(insertNewUserInfoQuery, userID, req.Lastname, req.Firstname, req.BirthDate, req.IsGpsEnabled, req.Gender, req.SexualOrientation, req.Eria); err != nil {
		return 0, err
	}

	return int(userID), err
}

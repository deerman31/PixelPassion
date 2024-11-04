package handler

import (
	"crypto/hmac"
	"crypto/sha256"
	"database/sql"
	"encoding/base64"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	_ "github.com/go-sql-driver/mysql" // MySQLドライバーをインポート
	"github.com/labstack/echo/v4"
)

const (
	tokenExpiration    = 24 * time.Hour
	expectedDataParts  = 3
	expectedTokenParts = 2
)

const (
	queryGetUserRegistration    = `SELECT is_registered FROM users WHERE id = ?`
	queryUpdateUserRegistration = `UPDATE users SET is_registered = true WHERE id = ?`
)

func parseToken(token string) (string, []byte, error) {
	// Base64decode
	decoded, err := base64.URLEncoding.DecodeString(token)
	if err != nil {
		return "", nil, fmt.Errorf("Invalid token: malformed base64")
	}

	decoded_str := string(decoded)
	if strings.Count(decoded_str, ".") != 3 {
		return "", nil, fmt.Errorf("Invalid token: incorrect format - expected 4 parts")
	}

	// データと署名をsplitする
	lastDot := strings.LastIndex(decoded_str, ".")
	first := decoded_str[:lastDot]
	second := decoded_str[lastDot+1:]

	receivedSignature, err := base64.URLEncoding.DecodeString(second)
	if err != nil {
		return "", nil, fmt.Errorf("Invalid token: malformed signature")
	}
	return first, receivedSignature, nil
}

func verifySignature(data, secretKey string, signature []byte) error {
	// 署名と検証
	h := hmac.New(sha256.New, []byte(secretKey))
	h.Write([]byte(data))
	expectedSignature := h.Sum(nil)
	if !hmac.Equal(signature, expectedSignature) {
		return fmt.Errorf("Invalid token")
	}
	return nil
}

func validateTokenData(data string) (int, error) {
	// データ部分をさらに分解
	dataParts := strings.Split(data, ".")
	if len(dataParts) != expectedDataParts {
		return 0, fmt.Errorf("Invalid token: incorrect data format - expected 3 parts")
	}
	// userIDを取り出してintに変換
	userID, err := strconv.Atoi(dataParts[0])
	if err != nil {
		return 0, fmt.Errorf("Invalid token: user ID must be numeric")
	}
	// タイムスタンプを検証
	timestamp, err := time.Parse(time.RFC3339, dataParts[2])
	if err != nil {
		return 0, fmt.Errorf("Invalid token: invalid timestamp format")
	}
	// 有効期限を確認（24時間）
	if time.Since(timestamp) > tokenExpiration {
		return 0, fmt.Errorf("Token expired")
	}
	return userID, nil
}

func validateToken(token string) (int, int, error) {
	// 環境変数から暗号化キーを取得
	secretKey := os.Getenv("TOKEN_SECRET_KEY")
	if secretKey == "" {
		return 0, http.StatusInternalServerError, fmt.Errorf("TOKEN_SECRET_KEY is not set")
	}

	data, signature, err := parseToken(token)
	if err != nil {
		return 0, http.StatusUnauthorized, fmt.Errorf(err.Error())
	}

	if err = verifySignature(data, secretKey, signature); err != nil {
		return 0, http.StatusUnauthorized, fmt.Errorf(err.Error())
	}
	userID, err := validateTokenData(data)
	if err != nil {
		return 0, http.StatusUnauthorized, fmt.Errorf(err.Error())
	}
	return userID, 0, nil
}

func verifyUserRegistration(db *sql.DB, userID int) (int, error) {
	// トランザクション開始
	tx, err := db.Begin()
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("Failed to start transaction")
	}
	defer tx.Rollback() // エラー時はロールバック

	// ユーザーの確認
	var isRegistered bool
	err = tx.QueryRow(queryGetUserRegistration, userID).Scan(&isRegistered)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("Failed to get user information")
	}
	if isRegistered {
		return http.StatusGone, fmt.Errorf("User is already verified")
	}

	// ユーザーの認証状態を更新
	_, err = tx.Exec(queryUpdateUserRegistration, userID)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("Failed to update user verification status")
	}

	// トランザクションをコミット
	if err = tx.Commit(); err != nil {
		return http.StatusInternalServerError, fmt.Errorf("Failed to commit transaction")
	}
	return 0, err
}

func VerifyEmailHandler(db *sql.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		// urlに存在するqueryを取得する
		token := c.QueryParam("token")
		if token == "" {
			return c.JSON(http.StatusBadRequest, map[string]string{"message": "Token is required"})
		}

		userID, status, err := validateToken(token)
		if err != nil {
			return c.JSON(status, map[string]string{"message": err.Error()})
		}
		status, err = verifyUserRegistration(db, userID)
		if err != nil {
			return c.JSON(status, map[string]string{"message": err.Error()})
		}

		// ログインページにリダイレクト
		return c.Redirect(http.StatusFound, "/")
	}
}

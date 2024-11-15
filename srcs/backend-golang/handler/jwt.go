package handler

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type TokenType int

const (
	AccessToken TokenType = iota
	RefreshToken
)

type TokenPair struct {
	AccessToken  string
	RefreshToken string
}

type Claims struct {
	UserID    int       `json:"user_id"`
	Username  string    `json:"username"`
	TokenType TokenType `json:"token_type"`
	// JWT標準クレーム（有効期限など）を継承
	jwt.RegisteredClaims
}

func GenerateTokenPair(user *User, tx *sql.Tx) (*TokenPair, error) {
	secretKey := os.Getenv("TOKEN_SECRET_KEY")
	accessTokenLimitStr := os.Getenv("ACCESS_TOKEN_LIMIT")
	refreshTokenLimitStr := os.Getenv("REFRESH_TOKEN_LIMIT")

	accessTokenLimit, err := strconv.Atoi(accessTokenLimitStr)
	if err != nil {
		log.Fatalf("Invalid ACCESS_TOKEN_LIMIT: %v", err)
	}
	refreshTokenLimit, err := strconv.Atoi(refreshTokenLimitStr)
	if err != nil {
		log.Fatalf("Invalid REFRESH_TOKEN_LIMIT: %v", err)
	}

	// AccessTokenを生成
	// 有効期限の計算を変数に格納
	accessExpiresAt := time.Now().Add(time.Duration(accessTokenLimit))
	accessToken, err := signNewToken(user, AccessToken, accessExpiresAt, secretKey)
	if err != nil {
		return nil, err
	}

	// Refresh Token生成
	// 有効期限の計算を変数に格納
	refreshExpiresAt := time.Now().Add(time.Duration(refreshTokenLimit) * 24 * time.Hour)
	refreshToken, err := signNewToken(user, RefreshToken, refreshExpiresAt, secretKey)
	if err != nil {
		return nil, err
	}

	tokenHash := hashToken(refreshToken)
	// DBにRefresh tokenを保存
	query := `
        INSERT INTO refresh_tokens 
        (user_id, token_hash, expires_at) 
        VALUES (?, ?, ?)
    `
	if _, err = tx.Exec(query,
		user.ID,
		tokenHash,
		refreshExpiresAt,
	); err != nil {
		return nil, err
	}

	return &TokenPair{
			AccessToken:  accessToken,
			RefreshToken: refreshToken},
		nil

}

func signNewToken(user *User, tokenType TokenType, expiresAt time.Time, secretKey string) (string, error) {
	claims := &Claims{
		UserID:    int(user.ID),
		Username:  user.Username,
		TokenType: tokenType,
		RegisteredClaims: jwt.RegisteredClaims{
			// 有効期限を設定 -> 15分 後で環境変数を使うように
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodES256, claims)
	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func hashToken(token string) string {
	hash := sha256.Sum256([]byte(token))
	return hex.EncodeToString(hash[:])
}

func validateRefreshToken(db *sql.DB, tokenString string) (bool, error) {
	hashToken := hashToken(tokenString)
	query := `
        SELECT EXISTS(
            SELECT 1 FROM refresh_tokens 
            WHERE token_hash = ? 
            AND expires_at > NOW() 
        )
    `
	var exists bool
	err := db.QueryRow(query, hashToken).Scan(&exists)
	return exists, err
}

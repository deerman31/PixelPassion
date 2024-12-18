package jwttokens

import (
	"database/sql"
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func signNewToken(userID int, tokenType TokenType, expiresAt time.Time, secretKey string) (string, error) {
	claims := &Claims{
		UserID:    userID,
		TokenType: tokenType,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	//token := jwt.NewWithClaims(jwt.SigningMethodES256, claims)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

// func GenerateAccessToken(userID int, tx *sql.Tx, secretKey string) (string, error) {
func GenerateAccessToken(userID int, secretKey string) (string, error) {
	// AccessTokenを生成
	accessExpiresAt := calculateAccessTokenExpiry()

	accessToken, err := signNewToken(userID, AccessToken, accessExpiresAt, secretKey)
	if err != nil {
		return "", err
	}
	return accessToken, nil
}

// func GenerateRefreshToken(userID int, tx *sql.Tx, secretKey string) (string, error) {
func GenerateRefreshToken(userID int, secretKey string) (string, error) {
	// Refresh Token生成
	refreshExpiresAt := calculateRefreshTokenExpiry()
	refreshToken, err := signNewToken(userID, RefreshToken, refreshExpiresAt, secretKey)
	if err != nil {
		return "", err
	}
	return refreshToken, nil
}

func GenerateTokenPair(userID int, tx *sql.Tx) (*TokenPair, error) {
	secretKey := os.Getenv("JWT_SECRET_KEY")
	// 古いrefreshTokenをDELETEする
	if _, err := tx.Exec(DeleteRefreshTokenQuery, userID); err != nil {
		return nil, fmt.Errorf("failed to delete old refresh tokens: %w", err)
	}

	// AccessTokenを生成
	//accessToken, err := GenerateAccessToken(userID, tx, secretKey)
	accessToken, err := GenerateAccessToken(userID, secretKey)
	if err != nil {
		return nil, err
	}

	// Refresh Token生成
	//refreshToken, err := GenerateRefreshToken(userID, tx, secretKey)
	refreshToken, err := GenerateRefreshToken(userID, secretKey)
	if err != nil {
		return nil, err
	}

	salt, err := generateSalt()
	if err != nil {
		return nil, err
	}

	// tokenをhash化
	tokenHash, err := hashTokenWithSalt(refreshToken, salt)
	if err != nil {
		return nil, err
	}

	refreshExpiresAt := calculateRefreshTokenExpiry()
	// DBにRefresh tokenを保存
	if _, err = tx.Exec(saveRefreshTokenQuery, userID, tokenHash, salt, refreshExpiresAt); err != nil {
		return nil, err
	}
	return &TokenPair{AccessToken: accessToken, RefreshToken: refreshToken}, nil
}

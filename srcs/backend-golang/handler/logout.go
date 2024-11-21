package handler

import (
	jwttokens "backend-golang/handler/jwt_tokens"
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

func getAuthToken(c echo.Context) (string, error) {
	authHeader := c.Request().Header.Get("Authorization")
	if authHeader == "" {
		return "", fmt.Errorf("Authorization header is required")
	}
	strs := strings.Split(authHeader, " ")
	if len(strs) != 2 || strs[0] != "Bearer" {
		return "", fmt.Errorf("Invalid authorization format")
	}
	return strs[1], nil
}

func test(tokenString, secretKey string) (*jwttokens.Claims, error) {

	// トークンの解析
	token, err := jwt.ParseWithClaims(tokenString, &jwttokens.Claims{}, func(token *jwt.Token) (interface{}, error) {
		// 署名方式の検証
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secretKey), nil
	})
	if err != nil {
		return nil, err
	}
	// クレームの取得と検証
	claims, ok := token.Claims.(*jwttokens.Claims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("Invalid token claims")
	}
	// トークンタイプの検証
	if claims.TokenType != jwttokens.AccessToken {
		return nil, fmt.Errorf("invalid token type: %v", claims.TokenType)
	}
	return claims, nil
}

func Logout(db *sql.DB) echo.HandlerFunc {
	secretKey := os.Getenv("JWT_SECRET_KEY")
	return func(c echo.Context) error {
		// Authorizationヘッダーを取得
		tokenString, err := getAuthToken(c)
		if err != nil {
			return c.JSON(http.StatusUnauthorized, map[string]string{
				"error": err.Error(),
			})
		}
		claims, err:= test(tokenString, secretKey)
		if err !=nil{
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
		}
	}
}

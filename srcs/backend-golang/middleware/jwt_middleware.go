package middleware

import (
	jwttokens "backend-golang/handler/jwt_tokens"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

// JWTConfig はミドルウェアの設定を保持する構造体
type JWTConfig struct {
	SecretKey string
}

func JWTMiddleware() echo.MiddlewareFunc {
	config := &JWTConfig{
		SecretKey: os.Getenv("JWT_SECRET_KEY"),
	}
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// Authorizationヘッダーを取得
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"error": "Authorization header is required",
				})
			}
			// Bearer スキームの確認
			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"error": "Invalid authorization format",
				})
			}
			tokenString := parts[1]

			// Tokenの検証
			token, err := jwt.ParseWithClaims(tokenString, &jwttokens.Claims{}, func(token *jwt.Token) (interface{}, error) {
				// 署名方法の検証
				if _, ok := token.Method.(*jwt.SigningMethodECDSA); !ok {
					return nil, echo.NewHTTPError(http.StatusUnauthorized, "unexpected signing method")
				}
				return []byte(config.SecretKey), nil
			})
			if err != nil {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"error": "Invalid or expired token",
				})
			}
			// クレームの検証
			claims, ok := token.Claims.(*jwttokens.Claims)
			if !ok || !token.Valid {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"error": "Invalid token claims",
				})
			}
			// AccessTokenであることを確認
			if claims.TokenType != jwttokens.AccessToken {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"error": "Invalid token type",
				})
			}
			// コンテキストにユーザー情報を設定
			c.Set("user", claims)

			return next(c)
		}
	}
}

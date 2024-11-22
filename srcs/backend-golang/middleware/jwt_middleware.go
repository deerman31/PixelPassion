package middleware

import (
	jwttokens "backend-golang/handler/jwt_tokens"
	"net/http"
	"os"

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
			tokenString, err := jwttokens.GetAuthToken(c)
			if err != nil {
				return c.JSON(http.StatusUnauthorized, map[string]string{
					"error": err.Error(),
				})
			}
			claims, err := jwttokens.ParseAndValidateToken(tokenString, config.SecretKey)
			if err != nil {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
			}

			// コンテキストにユーザー情報を設定
			c.Set("user", claims)

			return next(c)
		}
	}
}

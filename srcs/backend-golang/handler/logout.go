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

const (
	// ユーザーのオンラインステータスを更新するクエリ
	updateUserOfflineStatusQuery = `
        UPDATE users 
        SET is_online = FALSE 
        WHERE id = ?
    `
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

func LogoutHandler(db *sql.DB) echo.HandlerFunc {
	secretKey := os.Getenv("JWT_SECRET_KEY")
	return func(c echo.Context) error {

		fmt.Println("LogoutHandler")

		// Authorizationヘッダーを取得
		tokenString, err := getAuthToken(c)
		if err != nil {
			return c.JSON(http.StatusUnauthorized, map[string]string{
				"error": err.Error(),
			})
		}
		claims, err := test(tokenString, secretKey)
		if err != nil {
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": err.Error()})
		}
		userID := claims.UserID

		// トランザクションを開始
		tx, err := db.Begin()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not start transaction"})
		}
		defer tx.Rollback() // エラーが発生した場合はロールバック

		// userのis_onlineをfalseにする
		result, err := tx.Exec(updateUserOfflineStatusQuery, userID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}
		// 更新が成功したか確認
		rows, err := result.RowsAffected()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}
		// userが見つからなかった場合
		if rows == 0 {
			return c.JSON(http.StatusNotFound, map[string]string{"error": "User not found"})
		}

		// logoutするのでRefreshTokenは必要ないため、削除する
		if _, err := tx.Exec(jwttokens.DeleteRefreshTokenQuery, userID); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		// トランザクションのコミット
		if err = tx.Commit(); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not commit transaction"})
		}
		return c.JSON(http.StatusOK, map[string]string{"message": "User created successfully. Please check your email to verify your account."})
	}
}

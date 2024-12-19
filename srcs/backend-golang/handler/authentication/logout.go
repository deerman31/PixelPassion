package authentication

import (
	jwttokens "backend-golang/handler/jwt_tokens"
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

func verifyTokenClaims(tokenString, secretKey string) (*jwttokens.Claims, error) {
	// トークンの解析
	token, err := jwt.ParseWithClaims(tokenString, &jwttokens.Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secretKey), nil
	})

	// まず、署名が正しいかどうかに関係なくClaimsを取得
	if token != nil { // tokenがnilでないことを確認
		claims, ok := token.Claims.(*jwttokens.Claims)
		if !ok {
			return nil, fmt.Errorf("Invalid token claims")
		}

		// エラーがある場合でも、期限切れエラーのみの場合は claims を返す
		if err != nil {
			if err.Error() == "Token is expired" {
				return claims, nil
			}
		}

		// トークンタイプの検証
		if claims.TokenType == jwttokens.RefreshToken {
			return nil, fmt.Errorf("invalid token type: %v", claims.TokenType)
		}

		return claims, nil
	}

	// tokenがnilの場合やその他のエラーの場合
	return nil, err
}


func LogoutHandler(db *sql.DB) echo.HandlerFunc {
	secretKey := os.Getenv("JWT_SECRET_KEY")
	return func(c echo.Context) error {

		fmt.Println("LogoutHandler")

		// Authorizationヘッダーを取得
		tokenString, err := jwttokens.GetAuthToken(c)
		if err != nil {
			return c.JSON(http.StatusUnauthorized, map[string]string{
				"error": err.Error(),
			})
		}
		//claims, err := jwttokens.ParseAndValidateToken(tokenString, secretKey)
		claims, err := verifyTokenClaims(tokenString, secretKey)
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
		return c.JSON(http.StatusOK, map[string]string{"message": "User logout successfully."})
	}
}

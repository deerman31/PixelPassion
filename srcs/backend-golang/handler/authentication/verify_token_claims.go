package authentication

import (
	jwttokens "backend-golang/handler/jwt_tokens"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

func VerifyTokenClaims(tokenString, secretKey string) (*jwttokens.Claims, error) {
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
		if claims.TokenType != jwttokens.AccessToken {
			return nil, fmt.Errorf("invalid token type: %v", claims.TokenType)
		}

		return claims, nil
	}

	// tokenがnilの場合やその他のエラーの場合
	return nil, err
}

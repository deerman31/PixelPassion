package jwttokens

import (
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

func ParseAndValidateToken(tokenString, secretKey string) (*Claims, error) {

	// トークンの解析
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		// 署名方式の検証
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secretKey), nil
	})
	if err != nil {
		// fmt.Println("ZZZZZ:" ,err.Error())
		return nil, err
	}
	// クレームの取得と検証
	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("Invalid token claims")
	}
	// トークンタイプの検証
	if claims.TokenType != AccessToken {
		return nil, fmt.Errorf("invalid token type: %v", claims.TokenType)
	}
	return claims, nil
}

package jwttokens

import "github.com/golang-jwt/jwt/v5"

type TokenType int

const (
	AccessToken TokenType = iota
	RefreshToken
)

const (
	SaltLength = 32
	KeyLength  = 32
	Iterations = 10000
)

type TokenPair struct {
	AccessToken  string
	RefreshToken string
}

type Claims struct {
	UserID    int       `json:"user_id"`
	TokenType TokenType `json:"token_type"`
	// JWT標準クレーム（有効期限など）を継承
	jwt.RegisteredClaims
}

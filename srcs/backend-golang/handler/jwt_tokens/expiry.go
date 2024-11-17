package jwttokens

import (
	"os"
	"strconv"
	"time"
)

// accessTokenの有効期限を戻り値で返す関数
func calculateAccessTokenExpiry() time.Time {
	accessTokenLimitStr := os.Getenv("ACCESS_TOKEN_LIMIT")
	accessTokenLimit, err := strconv.Atoi(accessTokenLimitStr)
	if err != nil {
		accessTokenLimit = 5
	}
	return time.Now().Add(time.Duration(accessTokenLimit) * time.Minute)
}

// refreshTokenの有効期限を戻り値で返す関数
func calculateRefreshTokenExpiry() time.Time {
	refreshTokenLimitStr := os.Getenv("REFRESH_TOKEN_LIMIT")
	refreshTokenLimit, err := strconv.Atoi(refreshTokenLimitStr)
	if err != nil {
		refreshTokenLimit = 7
	}
	return time.Now().Add(time.Duration(refreshTokenLimit) * 24 * time.Hour)
}

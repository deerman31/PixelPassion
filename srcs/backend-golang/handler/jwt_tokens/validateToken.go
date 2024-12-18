package jwttokens

import (
	"database/sql"
	"fmt"
	"time"
)

func ValidateRefreshToken(db *sql.DB, userID int, tokenString string) (bool, error) {
	// tokenのsaltを取得
	var storedHash, storedSalt string
	var expiresAt time.Time
	if err := db.QueryRow(selectRefreshTokenByUserIDQuery, userID).Scan(&storedHash, &storedSalt, &expiresAt); err != nil {
		if err == sql.ErrNoRows {
			return false, nil
		}
		return false, fmt.Errorf("database error: %w", err)
	}

	// 保存されているソルトを使用して入力されたトークンをハッシュ化
	computedHash, err := hashTokenWithSalt(tokenString, storedSalt)
	if err != nil {
		fmt.Println(err.Error())
		return false, err
	}

	// expiresAt
	if time.Now().After(expiresAt) {
		return false, fmt.Errorf("RefreshToken has expired")
	}

	// 同じソルトを使用するため、同じトークンなら同じハッシュ値が生成されるため、
	// 比較が可能となる
	return storedHash == computedHash, nil
}

package tokens

import (
	"database/sql"
	"time"
)

func CreateVerificationToken(tx *sql.Tx, userID int, token string) error {
	_, err := tx.Exec(`
		INSERT INTO verification_tokens (user_id, token, expires_at)
		VALUES (?, ?, ?)`,
		userID, token, time.Now().Add(24*time.Hour))
	return err
}

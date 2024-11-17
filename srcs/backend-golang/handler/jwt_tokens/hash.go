package jwttokens

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"fmt"

	"golang.org/x/crypto/pbkdf2"
)

// セキュアなソルトを生成
func generateSalt() (string, error) {
	salt := make([]byte, SaltLength) // byteのスライスを事前に作成
	// rand.Readで暗号学的に安全な乱数をソルトに読み込む
	if _, err := rand.Read(salt); err != nil {
		return "", fmt.Errorf("failed to generate salt: %w", err)
	}
	//生成されたバイト列をBase64形式の文字列に変換
	return base64.StdEncoding.EncodeToString(salt), nil
}

func hashTokenWithSalt(token string, salt string) (string, error) {
	saltBytes, err := base64.StdEncoding.DecodeString(salt)
	if err != nil {
		return "", fmt.Errorf("failed to decode salt: %w", err)
	}
	// PBKDF2でハッシュ化（SHA-256, 10000回のストレッチング）
	hash := pbkdf2.Key([]byte(token), saltBytes, Iterations, KeyLength, sha256.New)
	return hex.EncodeToString(hash), nil

}
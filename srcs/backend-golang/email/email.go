package email

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"net/smtp"
	"os"
	"time"
)

func SendVerificationEmail(email, token string) error {
	// SMTPサーバーの設定
	smtpHost := "mailpit"
	smtpPort := 1025

	verificationLink := fmt.Sprintf("http://localhost:%s/api/verify-email?token=%s",
		os.Getenv("BACKEND_GOLANG_PORT"), token)

	// 送信元と送信先の設定
	from := "ykusano@student.42tokyo.jp"
	to := []string{email}

	subject := "メールアドレスの確認"
	body := fmt.Sprintf(`
こんにちは、

以下のリンクをクリックしてメールアドレスを確認してください：
%s

このリンクは24時間有効です。

よろしくお願いいたします。
`, verificationLink)

	msg := fmt.Sprintf(
		"To: %s\r\n"+
			"From: %s\r\n"+
			"Subject: %s\r\n"+
			"Content-Type: text/plain; charset=\"UTF-8\"\r\n"+
			"\r\n"+
			"%s\r\n", email, from, subject, body)

	addr := fmt.Sprintf("%s:%d", smtpHost, smtpPort)
	// メール送信
	err := smtp.SendMail(addr, nil, from, to, []byte(msg))
	if err != nil {
		return err
	}

	fmt.Println("Email sent successfully")
	return nil
}

func GenerateVerificationToken(userID int) (string, error) {
	secretKey := os.Getenv("TOKEN_SECRET_KEY")
	if secretKey == "" {
		return "", fmt.Errorf("TOKEN_SECRET_KEY is not set")
	}

	// ランダムな32バイトのバイト列を生成
	randomBytes := make([]byte, 32)
	if _, err := rand.Read(randomBytes); err != nil {
		return "", fmt.Errorf("failed to generate random bytes: %v", err)
	}

	// ユーザーIDと現在時刻を文字列として結合
	timestamp := time.Now().Format(time.RFC3339)
	data := fmt.Sprintf("%d.%s.%s", userID, base64.URLEncoding.EncodeToString(randomBytes), timestamp)

	// HMAC-SHA256で署名を作成
	h := hmac.New(sha256.New, []byte(secretKey))
	h.Write([]byte(data))
	signature := h.Sum(nil)

	// データと署名を結合してBase64エンコード
	token := fmt.Sprintf("%s.%s", data, base64.URLEncoding.EncodeToString(signature))

	return base64.URLEncoding.EncodeToString([]byte(token)), nil
}

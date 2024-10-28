package email

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"net/smtp"
	"os"
	"strconv"
	"strings"
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

func VerifyToken(token string) (int, error) {
    // 環境変数から暗号化キーを取得
    secretKey := os.Getenv("TOKEN_SECRET_KEY")
    if secretKey == "" {
        return 0, fmt.Errorf("TOKEN_SECRET_KEY is not set")
    }

    // Base64デコード
    decoded, err := base64.URLEncoding.DecodeString(token)
    if err != nil {
        return 0, fmt.Errorf("invalid token format: failed to decode base64: %v", err)
    }

    // データと署名を分離
    parts := strings.Split(string(decoded), ".")
    if len(parts) != 2 {
        return 0, fmt.Errorf("invalid token format: wrong number of segments")
    }

    data := parts[0]
    receivedSignature, err := base64.URLEncoding.DecodeString(parts[1])
    if err != nil {
        return 0, fmt.Errorf("invalid token format: failed to decode signature: %v", err)
    }

    // 署名を検証
    h := hmac.New(sha256.New, []byte(secretKey))
    h.Write([]byte(data))
    expectedSignature := h.Sum(nil)

    if !hmac.Equal(receivedSignature, expectedSignature) {
        return 0, fmt.Errorf("invalid token: signature mismatch")
    }

    // データ部分をさらに分解
    dataParts := strings.Split(data, ".")
    if len(dataParts) != 3 {
        return 0, fmt.Errorf("invalid token format: wrong data format")
    }

    // userIDを取り出してintに変換
    userID, err := strconv.Atoi(dataParts[0])
    if err != nil {
        return 0, fmt.Errorf("invalid token format: failed to parse user ID: %v", err)
    }

    // タイムスタンプを検証
    timestamp, err := time.Parse(time.RFC3339, dataParts[2])
    if err != nil {
        return 0, fmt.Errorf("invalid token format: failed to parse timestamp: %v", err)
    }

    // 有効期限を確認（24時間）
    if time.Since(timestamp) > 24*time.Hour {
        return 0, fmt.Errorf("token has expired")
    }

    return userID, nil
}
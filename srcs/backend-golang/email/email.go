package email

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"net/smtp"
	"os"
)

type EmailConfig struct {
	Host     string
	Port     string
	Username string
	Password string
	From     string
}

func GetEmailConfig() EmailConfig {
	return EmailConfig{
		Host:     os.Getenv("SMTP_HOST"),
		Port:     os.Getenv("SMTP_PORT"),
		Username: os.Getenv("SMTP_USERNAME"),
		Password: os.Getenv("SMTP_PASSWORD"),
		From:     os.Getenv("SMTP_FROM"),
	}
}

func SendVerificationEmail(email, token string) error {
	config := GetEmailConfig()

	verificationLink := fmt.Sprintf("http://localhost:%s/api/verify?token=%s",
		os.Getenv("BACKEND_GOLANG_PORT"), token)

	subject := "メールアドレスの確認"
	body := fmt.Sprintf(`
こんにちは、

以下のリンクをクリックしてメールアドレスを確認してください：
%s

このリンクは24時間有効です。

よろしくお願いいたします。
`, verificationLink)
	msg := fmt.Sprintf("From: %s\r\n"+
        "To: %s\r\n"+
        "Subject: %s\r\n"+
        "\r\n"+
		"%s\r\n", config.From, email, subject, body)

	addr := fmt.Sprintf("%s:%s", config.Host, config.Port)
	auth := smtp.PlainAuth("", config.Username, config.Password, config.Host)
	return smtp.SendMail(addr, auth, config.From, []string{email}, []byte(msg))
}

func GenerateVerificationToken() (string, error) {
	/* GenerateVerificationToken()は、32byteのrondomなbyte列を生成し、それをBase64Encodeして文字列として返す.
	   makeで32byteのスライスbを作成.
	   rand.Read()でrandomなbyteを読み込む.
	   base64.URLEncoding.EncodeToString()メソッドでBase64エンコードされた文字列に変換する.
	   これでエンコードされた文字列はURLセーフである.なので,メールの確認リンクなどに安全に使用される.
	*/
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

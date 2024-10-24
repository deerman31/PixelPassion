package main

import (
	"backend-golang/db"
	"backend-golang/validations"
	"fmt"
	"log"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// データベースに接続
	db, err := db.ConnectDB()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	fmt.Println("Successfully connected to the database")

	port, err := portSet()
	if err != nil {
		log.Fatal(err)
	}

	e := echo.New()

	// ミドルウェアの設定
	setupMiddleware(e)

	// カスタムバリデータの設定
	e.Validator = validations.NewCustomValidator()

	routing(e, db)

	e.Logger.Fatal(e.Start(":" + port))
}

func portSet() (string, error) {
	port := os.Getenv("BACKEND_GOLANG_PORT")
	if port == "" {
		return "", fmt.Errorf("Error: BACKEND_GOLANG_PORT is not set")
	}
	return port, nil
}

func setupMiddleware(e *echo.Echo) {
	// 基本的なミドルウェアの設定
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"}, // 本番環境では適切なオリジンに設定してください
		AllowMethods: []string{echo.GET, echo.PUT, echo.POST, echo.PATCH, echo.DELETE},
	}))
}

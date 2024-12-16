package main

import (
	"backend-golang/db"
	"backend-golang/validations"
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func defaultUserSet(db *sql.DB) {
	// $2a$10$4cGIYd0K9uIyOp9rixSB4.nHSn9.evNVaZe.rCtkpKLW0oVlqETz6
	username := "ykusano"
	email := "ykusano@test.com"
	firstname := "Yoshinari"
	lastname := "Kusano"
	password := "$2a$10$4cGIYd0K9uIyOp9rixSB4.nHSn9.evNVaZe.rCtkpKLW0oVlqETz6"
	IsGpsEnabled := true
	Gender := "male"
	SexualOrientation := "heterosexual"
	Eria := "Hokkaido"
	BirthDate := "2000-04-02"

	tx, err := db.Begin()
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}
	defer tx.Rollback() // エラーが発生した場合はロールバック
	result, err := tx.Exec("INSERT INTO users (username, email, password, is_registered) VALUES (?, ?, ?, ?)", username, email, password, true)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}
	userID, err := result.LastInsertId()
	if _, err := tx.Exec("INSERT INTO user_info (user_id, lastname, firstname, birthdate, is_gps, gender, sexual_orientation, eria) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", userID, lastname, firstname, BirthDate, IsGpsEnabled, Gender, SexualOrientation, Eria); err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}
	if err = tx.Commit(); err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}
}

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

	defaultUserSet(db)

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

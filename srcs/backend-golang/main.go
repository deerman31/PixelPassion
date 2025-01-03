package main

import (
	"backend-golang/db"
	"backend-golang/validations"
	"database/sql"
	"fmt"
	"log"
	"os"

	"backend-golang/middleware"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

func defaultUserSet(db *sql.DB) {
	username := "ykusano"
	email := "ykusano@test.com"
	firstname := "Yoshinari"
	lastname := "Kusano"
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte("Oinari0618!"), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}
	password := string(hashedBytes)
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
	userID, _ := result.LastInsertId()
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
	middleware.SetupMiddleware(e)

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

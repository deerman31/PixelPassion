package main

import (
	"backend-golang/db"
	"fmt"
	"log"
	"os"

	"github.com/labstack/echo/v4"
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

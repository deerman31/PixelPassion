package main

import (
    "database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

func connectDB() (*sql.DB, error) {
    // 環境変数から接続情報を取得
    dbUser := os.Getenv("MYSQL_USER")
    dbPass := os.Getenv("MYSQL_PASSWORD")
    dbHost := "db-mysql" // Docker Composeのサービス名
    dbPort := os.Getenv("MYSQL_PORT")
    dbName := os.Getenv("MYSQL_DATABASE")

    // データベース接続文字列を構築
    dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", dbUser, dbPass, dbHost, dbPort, dbName)

    // データベースに接続
    db, err := sql.Open("mysql", dsn)
    if err != nil {
        return nil, fmt.Errorf("failed to connect to database: %v", err)
    }

    // 接続テスト
    if err := db.Ping(); err != nil {
        db.Close()
        return nil, fmt.Errorf("failed to ping database: %v", err)
    }

    return db, nil
}


func main() {
	 // データベースに接続
	 db, err := connectDB()
	 if err != nil {
		 log.Fatal(err)
	 }
	 defer db.Close()
 
	 fmt.Println("Successfully connected to the database")

	r := rooting()

	port := os.Getenv("BACKEND_GOLANG_PORT")
	if port == "" {
        log.Fatal("Error: BACKEND_GOLANG_PORT is not set")
	}
    log.Fatal(http.ListenAndServe(":" + port, r))
}

package main

import (
	"fmt"
	"log"
	"meguriai-backend/db"
	"net/http"
	"os"
)


func main() {
	 // データベースに接続
	 db, err := db.ConnectDB()
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

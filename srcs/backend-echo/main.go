package main

import (
	"log"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
)

func helloWorldHandler(c echo.Context) error {
    return c.String(http.StatusOK, "Hello, World!")
}

func main() {
	e := echo.New()
	e.GET("/", helloWorldHandler)

	port := os.Getenv("BACKEND_ECHO_PORT")
	if port == "" {
		log.Fatal("Error")
	}

	e.Logger.Fatal(e.Start(":"+port))
}

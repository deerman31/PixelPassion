package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func LoginHandler(c echo.Context) error {
	return c.String(http.StatusCreated, "Login")
}

// func SignupHandler(db *sql.DB) echo.HandlerFunc {
// 	return func(c echo.Context) error {
// 	}}
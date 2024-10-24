package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func Logout(c echo.Context) error {
	return c.String(http.StatusCreated, "Logout")
}

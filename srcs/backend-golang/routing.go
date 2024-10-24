package main

import (
	"backend-golang/handler"
	"database/sql"

	"github.com/labstack/echo/v4"
)
// db *sql.DB
func routing(e *echo.Echo, db *sql.DB) {
	g := e.Group("/api")
	g.GET("", handler.HelloWorldHandler)
	g.POST("/signup", handler.Signup(db))
	g.POST("/login", handler.Login)
	g.POST("/logout", handler.Logout)
}

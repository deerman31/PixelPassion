package main

import (
	"backend-golang/handler"
	"backend-golang/handler/authentication"
	"backend-golang/middleware"
	"database/sql"

	"github.com/labstack/echo/v4"
)

// db *sql.DB
func routing(e *echo.Echo, db *sql.DB) {
	g := e.Group("/api")
	g.GET("", handler.HelloWorldHandler)

	g.POST("/signup", authentication.SignupHandler(db))
	g.POST("/login", authentication.LoginHandler(db))
	g.POST("/logout", authentication.LogoutHandler(db))
	g.GET("/verify-email", authentication.VerifyEmailHandler(db))

	// 保護されたルート(認証が必要)
	protected := e.Group("/api")
	protected.Use(middleware.JWTMiddleware())
}

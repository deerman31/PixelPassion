package main

import (
	"backend-golang/handler"
	"backend-golang/middleware"
	"database/sql"

	"github.com/labstack/echo/v4"
)

// db *sql.DB
func routing(e *echo.Echo, db *sql.DB) {
	g := e.Group("/api")
	g.GET("", handler.HelloWorldHandler)
	g.POST("/signup", handler.SignupHandler(db))
	g.POST("/login", handler.LoginHandler(db))
	g.POST("/logout", handler.LogoutHandler(db))
	//g.POST("/logout", handler.Logout)
	g.GET("/verify-email", handler.VerifyEmailHandler(db))

	// 保護されたルート(認証が必要)
	protected := e.Group("/api")
	protected.Use(middleware.JWTMiddleware())
}

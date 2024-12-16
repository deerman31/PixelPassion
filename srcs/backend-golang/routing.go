package main

import (
	"backend-golang/handler"
	"backend-golang/handler/authentication"
	"backend-golang/handler/update"
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
	protected.POST("/update/username", update.UpdateUsernameHandler(db))
	protected.POST("/update/email", update.UpdateEmailHandler(db))
	protected.POST("/update/fullname", update.UpdateFullNameHandler(db))
	protected.POST("/update/isgps", update.UpdateGpsHandler(db))
	protected.POST("/update/gender", update.UpdateGenderHandler(db))
	protected.POST("/update/sexual", update.UpdateSexualOrientationHandler(db))
	protected.POST("/update/eria", update.UpdateEriaHandler(db))
	protected.POST("/update/image", update.UpdateImageHandler(db))
}

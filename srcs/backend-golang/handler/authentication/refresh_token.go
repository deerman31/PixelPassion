package authentication

import (
	jwttokens "backend-golang/handler/jwt_tokens"
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
)

type RefreshTokenRequest struct {
	AccessToken  string
	RefreshToken string
}

type RefreshTokenResponse struct {
	AccessToken string
}

var (
	errInvalidRequest    = fmt.Errorf("invalid request body")
	errTransactionFailed = fmt.Errorf("transaction failed")
	errUserNotFound      = fmt.Errorf("user not found")
	errTokenExpired      = fmt.Errorf("refresh token has expired")
	errInvalidToken      = fmt.Errorf("invalid refresh token")
)

// エラーレスポンスを集約した関数を作成
func newErrorResponse(status int, message string) *echo.HTTPError {
	return echo.NewHTTPError(status, map[string]string{"error": message})
}

func updateUserStatus(tx *sql.Tx, userID int) error {
	// ユーザーのオフラインステータス更新
	result, err := tx.Exec(updateUserOfflineStatusQuery, userID)
	if err != nil {
		return err
	}
	rows, e := result.RowsAffected()
	if e != nil {
		return err
	}
	if rows == 0 {
		return errUserNotFound
	}
	return nil
}

func deleteRefreshToken(tx *sql.Tx, userID int) error {
	_, err := tx.Exec(jwttokens.DeleteRefreshTokenQuery, userID)
	return err
}

func handleTokenRefresh(db *sql.DB, tx *sql.Tx, userID int, refreshToken string) error {
	valid, err := jwttokens.ValidateRefreshToken(db, userID, refreshToken)
	if err != nil || !valid {
		if err := updateUserStatus(tx, userID); err != nil {
			return err
		}
		if err := deleteRefreshToken(tx, userID); err != nil {
			return err
		}
		if err != nil && err.Error() == "RefreshToken has expired" {
			return errTokenExpired
		}
		return errInvalidToken
	}
	return nil
}

func RefreshTokenHandler(db *sql.DB) echo.HandlerFunc {
	secretKey := os.Getenv("JWT_SECRET_KEY")
	return func(c echo.Context) error {
		fmt.Println("RefreshTokenHandler")
		req := new(RefreshTokenRequest)
		// requestのbodyをbind
		if err := c.Bind(req); err != nil {
			return newErrorResponse(http.StatusBadRequest, "Invalid request body")
		}

		// access_tokenを検証
		claims, err := VerifyTokenClaims(req.AccessToken, secretKey)
		if err != nil {
			return newErrorResponse(http.StatusUnauthorized, err.Error())
		}

		userID := claims.UserID

		// トランザクション処理
		tx, err := db.Begin()
		if err != nil {
			return newErrorResponse(http.StatusInternalServerError, "Could not start transaction")
		}
		defer tx.Rollback()

		if err := handleTokenRefresh(db, tx, userID, req.RefreshToken); err != nil {
			switch err {
			case errUserNotFound:
				return newErrorResponse(http.StatusNotFound, err.Error())
			case errTokenExpired:
				return newErrorResponse(http.StatusUnauthorized, err.Error())
			default:
				return newErrorResponse(http.StatusInternalServerError, err.Error())
			}
		}

		// トランザクションのコミット
		if err = tx.Commit(); err != nil {
			return newErrorResponse(http.StatusInternalServerError, "Could not commit transaction")
		}

		// 新しいアクセストークンの生成
		accessToken, err := jwttokens.GenerateAccessToken(userID, secretKey)
		if err != nil {
			return newErrorResponse(http.StatusInternalServerError, err.Error())
		}
		return c.JSON(http.StatusOK, RefreshTokenResponse{AccessToken: accessToken})
	}
}

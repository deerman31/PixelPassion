package tags

import (
	jwttokens "backend-golang/handler/jwt_tokens"
	"database/sql"
	"net/http"

	"github.com/labstack/echo/v4"
)

type SetTagRequest struct {
	Tag string `json:"tag" validate:"required,tag"`
}

func SetTagHandler(db *sql.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		claims, ok := c.Get("user").(*jwttokens.Claims)
		if !ok {
			return echo.NewHTTPError(http.StatusInternalServerError, "user claims not found")
		}
		userID := claims.UserID

		req := new(SetTagRequest)
		if err := c.Bind(req); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
			//return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		}

		// validationをここで行う
		if err := c.Validate(req); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}
		// トランザクションを開始
		tx, err := db.Begin()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not start transaction"})
		}
		defer tx.Rollback() // エラーが発生した場合はロールバック

		// tagをtagsに追加
		if err := addTag(tx, req.Tag); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		// tagsからtag_idを取得する
		tagID, err := getTagIDByName(tx, req.Tag)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		// tagIDとuserIDを使って、user_tagに要素を追加
		if err := addUserTag(tx, userID, tagID); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}

		// トランザクションをコミット
		if err = tx.Commit(); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not commit transaction"})
		}
		// 成功時のレスポンスを返す
		return c.JSON(http.StatusOK, map[string]string{"message": "Tag added successfully"})
	}
}

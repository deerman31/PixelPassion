package update

import (
	jwttokens "backend-golang/handler/jwt_tokens"
	"database/sql"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

const (
	maxFileSize          = 5 << 20 // 5MB
	updateImagePathQuery = `UPDATE user_info SET profile_image_path1 = ? WHERE user_id = ?`
	getNowImagePathQuery = "SELECT profile_image_path1 FROM user_info WHERE user_id = ?"
	allowedMIMETypeJPEG  = "image/jpeg"
	allowedMIMETypePNG   = "image/png"
	allowedMIMETypeGIF   = "image/gif"
)

/*
1 マルチパートフォームファイルでuploadする画像FILEを取得する
2 FILEサイズをCheckする
3 FILE形式をCheck
4 uploadするファイル名を生成する
5 4で作成したファイル名にuploadするディレクトリを結合する
6 ファイルをバックエンドのコンテナに保存する
7 9で削除するために既存の画像パスを取得する
8 DBのパスをupdateする
9 7で取得した古い画像pathを使い、古い画像を削除する
*/

func UpdateImageHandler(db *sql.DB) echo.HandlerFunc {
	uploadDir := os.Getenv("IMAGE_UPLOAD_DIR")
	return func(c echo.Context) error {

		fmt.Println("UpdateImageHandler")

		claims, ok := c.Get("user").(*jwttokens.Claims)
		if !ok {
			return echo.NewHTTPError(http.StatusInternalServerError, "user claims not found")
		}
		userID := claims.UserID

		// マルチパートフォームファイルを取得
		/* ここでuploadする画像データを取得する */
		file, err := c.FormFile("image")
		if err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid file upload"})
		}

		// ファイルサイズチェック
		if file.Size > maxFileSize {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": fmt.Sprintf("File size exceeds maximum limit of %d MB", maxFileSize/(1<<20)),
			})
		}

		// ファイル形式チェック
		if !isValidImageType(file.Header.Get("Content-Type")) {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": "Invalid file type. Only JPEG, PNG and GIF are allowed",
			})
		}

		// ファイル名生成（UUID + 元の拡張子）
		ext := filepath.Ext(file.Filename)
		newFileName := fmt.Sprintf("%s%s", uuid.NewString(), ext)

		// トランザクション開始
		tx, err := db.Begin()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Could not start transaction",
			})
		}
		defer tx.Rollback()


		// uploadするディレクトリ名とファイル名を結合する
		filePath := filepath.Join(uploadDir, newFileName)
		// ファイル保存とDB更新
		if err := saveFile(file, filePath); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Failed to save file",
			})
		}


		// 既存の画像パスを取得（あれば古い画像を削除するため）
		var oldImagePath sql.NullString
		err = tx.QueryRow(getNowImagePathQuery, userID).Scan(&oldImagePath)
		if err != nil && err != sql.ErrNoRows {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Failed to get existing image path",
			})
		}


		// DB更新
		if status, err := executeImageUpdate(tx, filePath, userID); err != nil {
			// エラー時は新しくアップロードしたファイルを削除
			os.Remove(filePath)
			return c.JSON(status, map[string]string{"error": err.Error()})
		}


		// トランザクションのコミット
		if err = tx.Commit(); err != nil {
			os.Remove(filePath)
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "Could not commit transaction",
			})
		}


		// 古い画像ファイルの削除（トランザクション成功後）
		if oldImagePath.Valid && oldImagePath.String != "" {
			os.Remove(oldImagePath.String)
		}


		return c.JSON(http.StatusOK, map[string]interface{}{
			"message":   "Image uploaded successfully",
			"imagePath": filePath,
		})
	}
}

// uploadする画像ファイルのパスをDBに保存する関数
func executeImageUpdate(tx *sql.Tx, imagePath string, userID int) (int, error) {
	result, err := tx.Exec(updateImagePathQuery, imagePath, userID)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("failed to update image path: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return http.StatusInternalServerError, err
	}
	if rows == 0 {
		return http.StatusNotFound, fmt.Errorf("user not found")
	}

	return http.StatusOK, nil
}

func isValidImageType(contentType string) bool {
	validTypes := map[string]bool{
		allowedMIMETypeJPEG: true,
		allowedMIMETypePNG:  true,
		allowedMIMETypeGIF:  true,
	}
	return validTypes[contentType]
}

func saveFile(file *multipart.FileHeader, destPath string) error {
	// パスのバリデーションを追加
	// IsAbs()は引数が絶対Pathかどうかを調べる関数
	if !filepath.IsAbs(destPath) {
		return fmt.Errorf("destination path must be absolute")
	}

	/* マルチパートファイルをオープンしてReaderを取得
	エラー発生時は即座にエラーを返す
	deferを使用して関数終了時に確実にファイルをクローズ */
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()
	/* 指定されたパスに新しいファイルを作成
	エラー発生時は即座にエラーを返す
	deferを使用して関数終了時に確実にファイルをクローズ */
	dst, err := os.Create(destPath)
	if err != nil {
		return err
	}
	defer dst.Close()
	/* io.Copyを使用してソースファイル（src）から保存先ファイル（dst）にデータをコピー
	コピー処理中のエラーがあれば、それを返す */
	_, err = io.Copy(dst, src)
	return err
}

package jwttokens

const (
	// refreshTokenを削除するquery
	deleteRefreshTokenQuery = `
        DELETE FROM refresh_tokens 
        WHERE user_id = ?
    `
	// DBにRefresh tokenを保存
	saveRefreshTokenQuery = `
        INSERT INTO refresh_tokens 
        (user_id, token_hash, salt, expires_at) 
        VALUES (?, ?, ?, ?)
    `
	// ユーザーIDに基づいてリフレッシュトークンの情報を取得するクエリ
	selectRefreshTokenByUserIDQuery = `
        SELECT token_hash, salt, expires_at
        FROM refresh_tokens 
        WHERE user_id = ?
    `
)

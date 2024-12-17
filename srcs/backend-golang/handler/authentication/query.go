package authentication

const (
	queryGetUserRegistration    = `SELECT is_registered FROM users WHERE id = ?`
	queryUpdateUserRegistration = `UPDATE users SET is_registered = true WHERE id = ?`

	// 1つのクエリで両方をチェック
	checkDuplicateCredentialsQuery = `
        SELECT 
            EXISTS(SELECT 1 FROM users WHERE username = ?) as username_exists,
            EXISTS(SELECT 1 FROM users WHERE email = ?) as email_exists
	`
	// 新規ユーザーを登録するためのクエリ
	insertNewUserQuery = `
        INSERT INTO users (
            username, 
            email, 
            password
        ) VALUES (?, ?, ?)
    `
	insertNewUserInfoQuery = `
        INSERT INTO user_info (
            user_id, 
            lastname, 
            firstname, 
			birthdate,
            is_gps, 
            gender, 
            sexual_orientation, 
            eria
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

	// ユーザーのオンラインステータスを更新するクエリ
	updateUserOfflineStatusQuery = `
        UPDATE users 
        SET is_online = FALSE 
        WHERE id = ?
    `

	// ユーザーのオンラインステータスを更新するクエリ
	updateUserOnlineStatusQuery = `
        UPDATE users 
        SET is_online = TRUE 
        WHERE id = ?
    `
	// ユーザー名からユーザー情報を取得するクエリ
	selectUserByUsernameQuery = `
        SELECT id, username, password, is_registered
        FROM users 
        WHERE username = ?
        LIMIT 1
    `
)

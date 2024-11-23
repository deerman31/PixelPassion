package update

const (
	checkDuplicateUsernameQuery = `
        SELECT EXISTS(
			SELECT 1 FROM users
			WHERE username = ?
		) as username_exists
	`

	checkDuplicateEmailQuery = `
        SELECT EXISTS(
			SELECT 1 FROM users
			WHERE email = ?
		) as email_exists
	`

	// ユーザーのusernameを更新するクエリ
	updateUserNameQuery = `
        UPDATE users 
        SET username = ? 
        WHERE id = ?
    `

	// ユーザーのemailを更新するクエリ
	updateEmailQuery = `
        UPDATE users 
        SET email = ? 
        WHERE id = ?
    `

	// ユーザーのSexualOrientationを更新するクエリ
	updateSexualOrientationQuery = `
        UPDATE user_info 
        SET sexual_orientation = ?
        WHERE user_id = ?
    `


	// ユーザーのeriaを更新するクエリ
	updateEriaQuery = `
        UPDATE user_info 
        SET eria = ?
        WHERE user_id = ?
    `

	// ユーザーのemailを更新するクエリ
	updateFullNameQuery = `
        UPDATE user_info 
        SET lastname = ?,
            firstname = ? 
        WHERE user_id = ?
    `

	// ユーザーのgenderを更新するクエリ
	updateGenderQuery = `
        UPDATE user_info 
        SET gender = ?
        WHERE user_id = ?
    `

	// ユーザーのis_gpsを更新するクエリ
	updateGpsQuery = `
        UPDATE user_info 
        SET is_gps = ?
        WHERE user_id = ?
    `

	// ユーザーself_introのを更新するクエリ
	updateSelfIntroQuery = `
        UPDATE user_info 
        SET self_intro = ?
        WHERE user_id = ?
    `
)

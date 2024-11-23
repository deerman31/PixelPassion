package authentication

type SignupRequest struct {
	Username   string `json:"username" validate:"required,username"`
	Email      string `json:"email" validate:"required,email"`
	Lastname   string `json:"lastname" validate:"required,name"`
	Firstname  string `json:"firstname" validate:"required,name"`
	Password   string `json:"password" validate:"required,password"`
	RePassword string `json:"repassword" validate:"required,password"`

	// requiredをbool型に付けるとfalseだとエラーだと判定してしまう。
	IsGpsEnabled bool `json:"isGpsEnabled"`

	Gender            string `json:"gender" validate:"required,oneof=male female"`
	SexualOrientation string `json:"sexual_orientation" validate:"required,oneof=heterosexual homosexual bisexual"`

	Eria string `json:"eria" validate:"required,eria"`

	// birthdateは一度設定すれば、変更する必要はないだろう
	BirthDate string `json:"birthdate" validate:"required,birthdate"`
}

type LoginRequest struct {
	Username string `json:"username" validate:"required,username"`
	Password string `json:"password" validate:"required,password"`
}

// トークンのレスポンス用構造体を追加
type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

// User はデータベースのユーザー情報を表す構造体
type User struct {
	ID             int
	Username       string
	HashedPassword string
	isRegistered   bool
}

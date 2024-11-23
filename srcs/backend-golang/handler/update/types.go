package update

type UpdateEmailRequest struct {
	Email string `json:"email" validate:"required,email"`
}

type UpdateEriaRequest struct {
	Eria string `json:"eria" validate:"required,eria"`
}

type UpdateFullNameRequest struct {
	Lastname  string `json:"lastname" validate:"required,name"`
	Firstname string `json:"firstname" validate:"required,name"`
}

type UpdateGenderRequest struct {
	Gender string `json:"gender" validate:"required,oneof=male female"`
}

type UpdateGpsRequest struct {
	IsGpsEnabled bool `json:"isGpsEnabled"`
}

type UpdateSexualOrientationRequest struct {
	SexualOrientation string `json:"sexual_orientation" validate:"required,oneof=heterosexual homosexual bisexual"`
}

type UpdateUsernameRequest struct {
	Username string `json:"username" validate:"required,username"`
}

type UpdateSelfIntroRequest struct {
	SelfIntro string `json:"self_intro"`
}

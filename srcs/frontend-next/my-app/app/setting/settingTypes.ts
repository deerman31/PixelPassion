export interface SettingFormData {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  repassword: string;
  isGpsEnabled: boolean;
  gender: "male" | "female";
  sexual_orientation: "heterosexual" | "homosexual" | "bisexual";
  eria: string;
}
// // 成功時のResponse型
// export interface SignupSuccessResponse {
//   message: string;
// }
// Error時のresponseの型
export interface SettingErrorResponse {
  error: string;
}

export const initialSignUpFormData: SettingFormData = {
  username: "",
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  repassword: "",
  isGpsEnabled: false,
  gender: "male",
  sexual_orientation: "heterosexual",
  eria: "",
};

export interface SettingUsernameFormData {
  username: string;
}
export interface SettingEmailFormData {
  email: string;
}
export interface SettingFullnameFormData {
  firstname: string;
  lastname: string;
}
export interface SettingGpsEnabledFormData {
  isGpsEnabled: boolean;
}
export interface SettingGenderFormData {
  gender: "male" | "female";
}
export interface SettingSexualOrientationFormData {
  sexual_orientation: "heterosexual" | "homosexual" | "bisexual";
}
export interface SettingEriaFormData {
  eria: string;
}

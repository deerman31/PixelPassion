export interface SignUpFormData {
  username: string;
  firstname: string;
  lastname: string;
  birthdate: string;
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
export interface SignupErrorResponse {
  error: string;
}

export const initialSignUpFormData: SignUpFormData = {
  username: "",
  firstname: "",
  lastname: "",
  birthdate: "",
  email: "",
  password: "",
  repassword: "",
  isGpsEnabled: false,
  gender: "male",
  sexual_orientation: "heterosexual",
  eria: "",
};

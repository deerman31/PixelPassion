export interface LoginFormData {
    username: string;
    password: string;
}

// 成功時のResponse型(BackendのTokenResponse構造体と同じようにする)
export interface LoginSuccessResponse {
    access_token: string;
    refresh_token: string;
}
// Error時のresponseの型
export interface LoginErrorResponse {
    error: string;
}

export const initialLoginFormData: LoginFormData = {
    username: '',
    password: '',
};

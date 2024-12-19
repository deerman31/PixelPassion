// authUtils.ts
import {
    getSessionAccessToken,
    getSessionRefreshToken,
    removeSessionAccessToken,
    removeSessionRefreshToken,
    setSessionAccessToken,
} from "@/app/utils/veridy_token";

export interface AuthError extends Error {
    code?: string;
}

export const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = getSessionRefreshToken();

    const response = await fetch("/api/refresh", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${refreshToken}`,
        },
    });

    if (!response.ok) {
        const error = new Error("Token refresh failed") as AuthError;
        error.code = response.status === 401
            ? "REFRESH_TOKEN_EXPIRED"
            : "REFRESH_FAILED";
        throw error;
    }

    const data = await response.json();
    removeSessionAccessToken();
    setSessionAccessToken(data.AccessToken);
    return data.AccessToken;
};

export const handleLogout = () => {
    removeSessionAccessToken();
    removeSessionRefreshToken();
    window.location.href = "/login";
};

// 認証付きのAPIリクエストを行う汎用関数
export const makeAuthenticatedRequest = async <T>(
    url: string,
    options: RequestInit = {}
): Promise<T> => {
    try {
        const accessToken = getSessionAccessToken();
        let response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        if (!response.ok && response.status === 401) {
            // トークンをリフレッシュして再試行
            await refreshAccessToken();
            response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    "Authorization": `Bearer ${getSessionAccessToken()}`,
                },
            });
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    } catch (err) {
        const error = err as AuthError;
        if (error.code === "REFRESH_TOKEN_EXPIRED") {
            handleLogout();
        }
        throw error;
    }
};
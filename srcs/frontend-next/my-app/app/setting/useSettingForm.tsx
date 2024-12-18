import { FormEvent, useState, ChangeEvent } from "react";
import {
    SettingEmailFormData,
    SettingEriaFormData,
    SettingErrorResponse,
    SettingFullnameFormData,
    SettingGenderFormData,
    SettingGpsEnabledFormData,
    SettingSexualOrientationFormData,
    SettingUsernameFormData,
} from "./settingTypes";
import {
    getSessionAccessToken,
    getSessionRefreshToken,
    removeSessionAccessToken,
    removeSessionRefreshToken,
    setSessionAccessToken,
} from "../utils/veridy_token";

// すべてのフォームデータ型のユニオン型を定義
//type FormDataType = EndpointFormDataMap[EndpointType];

// エンドポイントと対応するフォームデータ型のマッピング
interface EndpointFormDataMap {
    email: SettingEmailFormData;
    eria: SettingEriaFormData;
    fullname: SettingFullnameFormData;
    gender: SettingGenderFormData;
    isgps: SettingGpsEnabledFormData;
    sexual: SettingSexualOrientationFormData;
    username: SettingUsernameFormData;
}
// エンドポイント名の型
type EndpointType = keyof EndpointFormDataMap;

// エラー型の定義
interface AuthError extends Error {
    code?: string;
}
// APIリクエストの型定義を改善
interface ApiRequestConfig<T extends EndpointType> {
    endpoint: T;
    formData: EndpointFormDataMap[T];
}
// ログアウト処理を関数として分離
const handleLogout = () => {
    removeSessionAccessToken();
    removeSessionRefreshToken();
    window.location.href = "/login";
};
// アクセストークンのリフレッシュ関数
const refreshAccessToken = async (): Promise<string> => {
    const accessToken = getSessionAccessToken();
    const refreshToken = getSessionRefreshToken();

    const response = await fetch("/api/refresh", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            accessToken,
            refreshToken,
        }),
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

export const useSettingForm = () => {
    // エラー状態の管理
    const [error, setError] = useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);


    // 汎用的なAPIリクエストハンドラー
    const handleApiRequest = async <T extends EndpointType>(config: ApiRequestConfig<T>): Promise<Response> => {
        const { endpoint, formData } = config;
        const accessToken = getSessionAccessToken();

        try {
            return await makeApiRequest(endpoint, accessToken, formData);
        } catch (err) {
            const error = err as AuthError;
            if (error.code === "ACCESS_TOKEN_EXPIRED") {
                try {
                    const newAccessToken = await refreshAccessToken();
                    return await makeApiRequest(endpoint, newAccessToken, formData);
                } catch (refreshErr) {
                    const refreshError = refreshErr as AuthError;
                    if (refreshError.code === "REFRESH_TOKEN_EXPIRED") {
                        handleLogout();
                        throw refreshError;
                    }
                    throw refreshErr;
                }
            }
            throw error;
        }
    };

    // 汎用的なフォーム送信ハンドラーを作成するファクトリー関数
    const createSubmitHandler = <T extends EndpointType>(endpoint: T) => {
        return async (event: FormEvent<HTMLFormElement>, formData: EndpointFormDataMap[T]) => {
            event.preventDefault();
            setError("");

            try {
                await handleApiRequest({ endpoint, formData });
                setShowError(false);
            } catch (err) {
                const error = err as AuthError;
                setError(error.message || "An unexpected error occurred");
                setShowError(true);
            }
        };
    };

    // 基本的なAPIリクエスト関数
    const makeApiRequest = async <T extends EndpointType>(endpoint: T, accessToken: string, formData: EndpointFormDataMap[T],
    ): Promise<Response> => {
        const response = await fetch(`/api/update/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            const errorData: SettingErrorResponse = await response.json();
            const error = new Error(
                errorData.error || `Update ${endpoint} failed`,
            ) as AuthError;
            error.code = response.status === 401
                ? "ACCESS_TOKEN_EXPIRED"
                : "UPDATE_FAILED";
            throw error;
        }
        return response;
    };

    // 各Submit関数の実装
    const [usernameformData, setusernameformData] = useState<
        SettingUsernameFormData
    >({
        username: "",
    });
    // テキストフィールドの変更ハンドラー
    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setusernameformData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleUsernameSubmit = async (event: FormEvent<HTMLFormElement>) => {
        await createSubmitHandler('username')(event, usernameformData);
    };

    const [emailFormData, setEmailFormData] = useState<SettingEmailFormData>({
        email: "",
    });
    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmailFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
        await createSubmitHandler('email')(event, emailFormData);
    };

    const [fullnameFormData, setFullnameFormData] = useState<
        SettingFullnameFormData
    >({
        firstname: "",
        lastname: "",
    });
    const handleFullnameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFullnameFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleFullnameSubmit = async (event: FormEvent<HTMLFormElement>) => {
        await createSubmitHandler('fullname')(event, fullnameFormData);
    };

    const [gpsFormData, setGpsFormData] = useState<SettingGpsEnabledFormData>({
        isGpsEnabled: false,
    });
    const handleGpsCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setGpsFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };
    const handleGpsSubmit = async (event: FormEvent<HTMLFormElement>) => {
        await createSubmitHandler('isgps')(event, gpsFormData);
    };

    const [genderFormData, setGenderFormData] = useState<SettingGenderFormData>({
        gender: "male",
    });
    const handleGenderRadioChange = (name: string, value: string) => {
        setGenderFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleGenderSubmit = async (event: FormEvent<HTMLFormElement>) => {
        await createSubmitHandler('gender')(event, genderFormData);
    };

    const [sexualFormData, setSexualFormData] = useState<
        SettingSexualOrientationFormData
    >({
        sexual_orientation: "heterosexual",
    });
    const handleSexualRadioChange = (name: string, value: string) => {
        setSexualFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSexualSubmit = async (event: FormEvent<HTMLFormElement>) => {
        await createSubmitHandler('sexual')(event, sexualFormData);
    };

    const [eriaFormData, setEriaFormData] = useState<SettingEriaFormData>({
        eria: "",
    });
    const handleEriaSubmit = async (event: FormEvent<HTMLFormElement>) => {
        await createSubmitHandler('eria')(event, eriaFormData);
    };

    return {
        error,
        showError,
        setShowError,

        usernameformData,
        handleUsernameChange,
        handleUsernameSubmit,

        emailFormData,
        handleEmailChange,
        handleEmailSubmit,

        fullnameFormData,
        handleFullnameChange,
        handleFullnameSubmit,

        gpsFormData,
        handleGpsCheckboxChange,
        handleGpsSubmit,

        genderFormData,
        handleGenderRadioChange,
        handleGenderSubmit,

        sexualFormData,
        handleSexualRadioChange,
        handleSexualSubmit,

        eriaFormData,
        handleEriaSubmit,
        setEriaFormData,
    };
};

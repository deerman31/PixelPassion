import { ChangeEvent, FormEvent, useState } from "react";
import {
  LoginErrorResponse,
  LoginFormData,
  LoginSuccessResponse,
} from "./loginTypes";
import {
  setSessionAccessToken,
  setSessionRefreshToken,
} from "../utils/veridy_token";

export const useLoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  // エラー状態の管理
  const [error, setError] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);

  // テキストフィールドの変更ハンドラー
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // フォーム送信ハンドラー
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data: LoginSuccessResponse | LoginErrorResponse = await response
        .json();
      if (!response.ok) {
        const errorData = data as LoginErrorResponse;
        throw new Error(errorData.error || "Login failed");
      }
      const successData = data as LoginSuccessResponse;
      setSessionAccessToken(successData.access_token);
      setSessionRefreshToken(successData.refresh_token);
      window.location.href = "/dashboard";
      //router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
      setShowError(true);
    }
  };

  return {
    formData,
    error,
    showError,
    setShowError,
    handleTextChange,
    handleSubmit,
  };
};

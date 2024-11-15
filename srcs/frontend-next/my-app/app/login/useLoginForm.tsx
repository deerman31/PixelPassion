import { useState, ChangeEvent, FormEvent } from "react"
import { LoginFormData } from "./loginTypes"

export const useLoginForm = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        username: '',
        password: ''
    })

    // エラー状態の管理
    const [error, setError] = useState<string>('')
    const [showError, setShowError] = useState<boolean>(false)

    // テキストフィールドの変更ハンドラー
    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    // フォーム送信ハンドラー
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || "Login failed")
            }

            window.location.href = '/forgot-password'
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('An unexpected error occurred')
            }
            setShowError(true)
        }
    }

    return {
        formData,
        error,
        showError,
        setShowError,
        handleTextChange,
        handleSubmit
    }
}
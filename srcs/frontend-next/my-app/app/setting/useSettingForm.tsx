import { useState, ChangeEvent, FormEvent } from 'react'
import { SettingFormData, SettingErrorResponse } from './settingTypes'

export const useSettingUpForm = () => {
    // フォームの状態管理
    const [formData, setFormData] = useState<SettingFormData>({
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        repassword: '',
        isGpsEnabled: false,
        gender: 'male',
        sexual_orientation: 'heterosexual',
        eria: ""
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

    // チェックボックスの変更ハンドラー
    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }))
    }

    // ラジオボタンの変更ハンドラー
    const handleRadioChange = (name: string, value: string) => {
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
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            if (!response.ok) {
                const errorData: SettingErrorResponse = await response.json()
                throw new Error(errorData.error || "Signup failed")
            } else {
                window.location.href = '/login'
            }
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
        handleCheckboxChange,
        handleRadioChange,
        handleSubmit,
        setFormData
    }
}
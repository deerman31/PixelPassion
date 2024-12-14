
import { useState, ChangeEvent, FormEvent } from 'react'
import { SettingEmailFormData, SettingEriaFormData, SettingErrorResponse, SettingFullnameFormData, SettingGenderFormData, SettingGpsEnabledFormData, SettingSexualOrientationFormData, SettingUsernameFormData } from './settingTypes'
import { getSessionAccessToken } from '../utils/veridy_token'

export const useSettingForm = () => {
    // エラー状態の管理
    const [error, setError] = useState<string>('')
    const [showError, setShowError] = useState<boolean>(false)

    const [usernameformData, setusernameformData] = useState<SettingUsernameFormData>({
        username: ''
    })
    // テキストフィールドの変更ハンドラー
    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setusernameformData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    // フォーム送信ハンドラー
    const handleUsernameSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')

        const accessToken = getSessionAccessToken();

        try {
            const response = await fetch('/api/update/username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(usernameformData)
            })
            if (!response.ok) {
                const errorData: SettingErrorResponse = await response.json()
                throw new Error(errorData.error || "Update username failed")
            } else {
                setShowError(false)
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

    const [emailFormData, setEmailFormData] = useState<SettingEmailFormData>({
        email: ''
    })
    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setEmailFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        const accessToken = getSessionAccessToken();
        try {
            const response = await fetch('/api/update/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(emailFormData)
            })
            if (!response.ok) {
                const errorData: SettingErrorResponse = await response.json()
                throw new Error(errorData.error || "Update email failed")
            } else {
                setShowError(false)
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

    const [fullnameFormData, setFullnameFormData] = useState<SettingFullnameFormData>({
        firstname: '',
        lastname: ''
    })
    const handleFullnameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFullnameFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const handleFullnameSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        const accessToken = getSessionAccessToken();
        try {
            const response = await fetch('/api/update/fullname', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(fullnameFormData)
            })
            if (!response.ok) {
                const errorData: SettingErrorResponse = await response.json()
                throw new Error(errorData.error || "Update fullname failed")
            } else {
                setShowError(false)
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


    const [gpsFormData, setGpsFormData] = useState<SettingGpsEnabledFormData>({
        isGpsEnabled: false
    })
    const handleGpsCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target
        setGpsFormData(prev => ({
            ...prev,
            [name]: checked
        }))
    }
    const handleGpsSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        const accessToken = getSessionAccessToken();
        try {
            const response = await fetch('/api/update/isgps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(gpsFormData)
            })
            if (!response.ok) {
                const errorData: SettingErrorResponse = await response.json()
                throw new Error(errorData.error || "Update gps failed")
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


    const [genderFormData, setGenderFormData] = useState<SettingGenderFormData>({
        gender: 'male',
    })
    const handleGenderRadioChange = (name: string, value: string) => {
        setGenderFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const handleGenderSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        const accessToken = getSessionAccessToken();
        try {
            const response = await fetch('/api/update/gender', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(genderFormData)
            })
            if (!response.ok) {
                const errorData: SettingErrorResponse = await response.json()
                throw new Error(errorData.error || "Update Gender failed")
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

    const [sexualFormData, setSexualFormData] = useState<SettingSexualOrientationFormData>({
        sexual_orientation: 'heterosexual',
    })
    const handleSexualRadioChange = (name: string, value: string) => {
        setSexualFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const handleSexualSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        const accessToken = getSessionAccessToken();
        try {
            const response = await fetch('/api/update/sexual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(sexualFormData)
            })
            if (!response.ok) {
                const errorData: SettingErrorResponse = await response.json()
                throw new Error(errorData.error || "Update Sexual failed")
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

    const [eriaFormData, setEriaFormData] = useState<SettingEriaFormData>({
        eria: ""
    })
    const handleEriaSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        const accessToken = getSessionAccessToken();
        try {
            const response = await fetch('/api/update/eria', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(eriaFormData)
            })
            if (!response.ok) {
                const errorData: SettingErrorResponse = await response.json()
                throw new Error(errorData.error || "Update eria failed")
            } else {
                setShowError(false)
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
        setEriaFormData
    }
}
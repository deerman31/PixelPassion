import { useState, ChangeEvent, FormEvent } from 'react'
import { SignUpFormData } from './signupTypes'

export const useSignUpForm = () => {
  // フォームの状態管理
  const [formData, setFormData] = useState<SignUpFormData>({
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
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
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
        body: JSON.stringify({
          username: formData.username,
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
          repassword: formData.repassword,
          isGpsEnabled: Boolean(formData.isGpsEnabled),
          gender: formData.gender,
          sexual_orientation: formData.sexual_orientation,
          eria: formData.eria
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Signup failed")
      }

      window.location.href = '/login'
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
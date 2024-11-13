'use client'

import { Header } from '../components/Header'
import { useState, ChangeEvent, FormEvent } from 'react'
import * as Form from '@radix-ui/react-form'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import * as RadioGroup from '@radix-ui/react-radio-group'

interface FormData {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  repassword: string;
  isGpsEnabled: boolean;
  gender: 'male' | 'female';
  sexual_orientation: 'heterosexual' | 'homosexual' | 'bisexual';
  eria: string;
}

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
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

  const [error, setError] = useState<string>('')
  const [showError, setShowError] = useState<boolean>(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target
    setFormData(prev => ({
      ...prev,
      // チェックボックスの場合はcheckedプロパティを使用
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    // Basic validation
    if (formData.password !== formData.repassword) {
      setError('Passwords do not match')
      setShowError(true)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setShowError(true)
      return
    }

    try {
      //const response = await fetch('http://localhost:3000/api/signup', {
      //const response = await fetch('/api/signup', {
      const response = await fetch('http://localhost:3000/api/signup', {
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
          isGpsEnabled: Boolean(formData.isGpsEnabled),
          gender: formData.gender,
          sexual_orientation: formData.sexual_orientation,
          eria: formData.eria
        })
      })

      if (!response.ok) {
        //const data = await response.json()
        const text = await response.text()
        console.error('Response text:', text) // デバッグ用にログ出力
        let errorMessage = 'Signup failed'
        try {
          const data = JSON.parse(text)
          errorMessage = data.error || data.message || errorMessage
        } catch (parseError) {
          console.error('JSON parse error:', parseError)
          errorMessage = text || errorMessage
        }

        throw new Error(errorMessage)
      }

      // Redirect to login page or show success message
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

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Create your account
          </h1>

          <Form.Root onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <Form.Field name="username" className="grid mb-4">
              <Form.Label className="text-sm font-medium text-gray-700 mb-1">
                Username
              </Form.Label>
              <Form.Control asChild>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  name="username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black"
                />
              </Form.Control>
              <Form.Message match="valueMissing" className="text-sm text-red-500">
                Please enter your username
              </Form.Message>
            </Form.Field>

            {/* First Name */}
            <Form.Field name="firstname" className="grid mb-4">
              <Form.Label className="text-sm font-medium text-gray-700 mb-1">
                First Name
              </Form.Label>
              <Form.Control asChild>
                <input
                  type="text"
                  required
                  value={formData.firstname}
                  onChange={handleChange}
                  name="firstname"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black"
                />
              </Form.Control>
              <Form.Message match="valueMissing" className="text-sm text-red-500">
                Please enter your first name
              </Form.Message>
            </Form.Field>

            {/* Last Name */}
            <Form.Field name="lastname" className="grid mb-4">
              <Form.Label className="text-sm font-medium text-gray-700 mb-1">
                Last Name
              </Form.Label>
              <Form.Control asChild>
                <input
                  type="text"
                  required
                  value={formData.lastname}
                  onChange={handleChange}
                  name="lastname"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black"
                />
              </Form.Control>
              <Form.Message match="valueMissing" className="text-sm text-red-500">
                Please enter your last name
              </Form.Message>
            </Form.Field>

            {/* Email */}
            <Form.Field name="email" className="grid mb-4">
              <Form.Label className="text-sm font-medium text-gray-700 mb-1">
                Email Address
              </Form.Label>
              <Form.Control asChild>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black"
                />
              </Form.Control>
              <Form.Message match="valueMissing" className="text-sm text-red-500">
                Please enter your email
              </Form.Message>
              <Form.Message match="typeMismatch" className="text-sm text-red-500">
                Please provide a valid email
              </Form.Message>
            </Form.Field>

            {/* Password */}
            <Form.Field name="password" className="grid mb-4">
              <Form.Label className="text-sm font-medium text-gray-700 mb-1">
                Password
              </Form.Label>
              <Form.Control asChild>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black"
                />
              </Form.Control>
              <Form.Message match="valueMissing" className="text-sm text-red-500">
                Please enter a password
              </Form.Message>
            </Form.Field>

            {/* Confirm Password */}
            <Form.Field name="repassword" className="grid mb-4">
              <Form.Label className="text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </Form.Label>
              <Form.Control asChild>
                <input
                  type="password"
                  required
                  value={formData.repassword}
                  onChange={handleChange}
                  name="repassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black"
                />
              </Form.Control>
              <Form.Message match="valueMissing" className="text-sm text-red-500">
                Please confirm your password
              </Form.Message>
            </Form.Field>

            {/* GPS Setting */}
            <Form.Field name="isGpsEnabled" className="grid mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isGpsEnabled}
                  onChange={handleChange}
                  name="isGpsEnabled"
                  id="isGpsEnabled"
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <Form.Label className="ml-2 block text-sm text-gray-700">
                  Enable GPS Location
                </Form.Label>
              </div>
            </Form.Field>
            {/* Gender */}
            <Form.Field name="gender" className="grid mb-4">
              <Form.Label className="text-sm font-medium text-gray-700 mb-2">
                Gender
              </Form.Label>
              <RadioGroup.Root
                value={formData.gender}
                onValueChange={(value) => handleRadioChange('gender', value)}
                className="flex gap-4"
              >
                <div className="flex items-center">
                  <RadioGroup.Item
                    value="male"
                    id="male"
                    className="w-4 h-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-emerald-600" />
                  </RadioGroup.Item>
                  <label className="ml-2 text-sm text-gray-700" htmlFor="male">
                    Male
                  </label>
                </div>
                <div className="flex items-center">
                  <RadioGroup.Item
                    value="female"
                    id="female"
                    className="w-4 h-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-emerald-600" />
                  </RadioGroup.Item>
                  <label className="ml-2 text-sm text-gray-700" htmlFor="female">
                    Female
                  </label>
                </div>
              </RadioGroup.Root>
            </Form.Field>

            {/* Sexual Orientation */}
            <Form.Field name="sexual_orientation" className="grid mb-4">
              <Form.Label className="text-sm font-medium text-gray-700 mb-2">
                Sexual Orientation
              </Form.Label>
              <RadioGroup.Root
                value={formData.sexual_orientation}
                onValueChange={(value) => handleRadioChange('sexual_orientation', value)}
                className="flex flex-col gap-2"
              >
                {['heterosexual', 'homosexual', 'bisexual'].map((orientation) => (
                  <div key={orientation} className="flex items-center">
                    <RadioGroup.Item
                      value={orientation}
                      id={orientation}
                      className="w-4 h-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-emerald-600" />
                    </RadioGroup.Item>
                    <label
                      className="ml-2 text-sm text-gray-700 capitalize"
                      htmlFor={orientation}
                    >
                      {orientation}
                    </label>
                  </div>
                ))}
              </RadioGroup.Root>
            </Form.Field>

            {/* Prefecture */}
            <Form.Field name="eria" className="grid mb-4">
              <Form.Label className="text-sm font-medium text-gray-700 mb-1">
                Prefecture
              </Form.Label>
              <Form.Control asChild>
                <select
                  required
                  value={formData.eria}
                  onChange={(e) => handleRadioChange('eria', e.target.value)}
                  name="eria"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black"
                >
                  <option value="">Select Prefecture</option>
                  <option value="Hokkaido">北海道</option>
                  <option value="Aomori">青森県</option>
                  <option value="Iwate">岩手県</option>
                  <option value="Miyagi">宮城県</option>
                  <option value="Akita">秋田県</option>
                  <option value="Yamagata">山形県</option>
                  <option value="Fukushima">福島県</option>
                  <option value="Ibaraki">茨城県</option>
                  <option value="Tochigi">栃木県</option>
                  <option value="Gunma">群馬県</option>
                  <option value="Saitama">埼玉県</option>
                  <option value="Chiba">千葉県</option>
                  <option value="Tokyo">東京都</option>
                  <option value="Kanagawa">神奈川県</option>
                  <option value="Niigata">新潟県</option>
                  <option value="Toyama">富山県</option>
                  <option value="Ishikawa">石川県</option>
                  <option value="Fukui">福井県</option>
                  <option value="Yamanashi">山梨県</option>
                  <option value="Nagano">長野県</option>
                  <option value="Gifu">岐阜県</option>
                  <option value="Shizuoka">静岡県</option>
                  <option value="Aichi">愛知県</option>
                  <option value="Mie">三重県</option>
                  <option value="Shiga">滋賀県</option>
                  <option value="Kyoto">京都府</option>
                  <option value="Osaka">大阪府</option>
                  <option value="Hyogo">兵庫県</option>
                  <option value="Nara">奈良県</option>
                  <option value="Wakayama">和歌山県</option>
                  <option value="Tottori">鳥取県</option>
                  <option value="Shimane">島根県</option>
                  <option value="Okayama">岡山県</option>
                  <option value="Hiroshima">広島県</option>
                  <option value="Yamaguchi">山口県</option>
                  <option value="Tokushima">徳島県</option>
                  <option value="Kagawa">香川県</option>
                  <option value="Ehime">愛媛県</option>
                  <option value="Kochi">高知県</option>
                  <option value="Fukuoka">福岡県</option>
                  <option value="Saga">佐賀県</option>
                  <option value="Nagasaki">長崎県</option>
                  <option value="Kumamoto">熊本県</option>
                  <option value="Oita">大分県</option>
                  <option value="Miyazaki">宮崎県</option>
                  <option value="Kagoshima">鹿児島県</option>
                  <option value="Okinawa">沖縄県</option>
                </select>
              </Form.Control>
              <Form.Message match="valueMissing" className="text-sm text-red-500">
                Please select your prefecture
              </Form.Message>
            </Form.Field>

            {/* Submit Button */}
            <Form.Submit asChild>
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
              >
                Sign Up
              </button>
            </Form.Submit>
          </Form.Root>
        </div>
      </main>

      {/* Error Dialog */}
      <AlertDialog.Root open={showError} onOpenChange={setShowError}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="bg-black/50 fixed inset-0" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 max-w-md w-[90vw]">
            <AlertDialog.Title className="text-lg font-medium text-gray-900 mb-2">
              Error
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-gray-500 mb-4">
              {error}
            </AlertDialog.Description>
            <AlertDialog.Action asChild>
              <button
                onClick={() => setShowError(false)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Okay
              </button>
            </AlertDialog.Action>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  )
}
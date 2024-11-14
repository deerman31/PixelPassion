'use client'

import { Header } from '../components/Header'
import { useState, ChangeEvent, FormEvent } from 'react'
import * as Form from '@radix-ui/react-form'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import * as RadioGroup from '@radix-ui/react-radio-group'

import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';

const PREFECTURES = [
  { value: 'Hokkaido', label: '北海道' },
  { value: 'Aomori', label: '青森県' },
  { value: 'Iwate', label: '岩手県' },
  { value: 'Miyagi', label: '宮城県' },
  { value: 'Akita', label: '秋田県' },
  { value: 'Yamagata', label: '山形県' },
  { value: 'Fukushima', label: '福島県' },
  { value: 'Ibaraki', label: '茨城県' },
  { value: 'Tochigi', label: '栃木県' },
  { value: 'Gunma', label: '群馬県' },
  { value: 'Saitama', label: '埼玉県' },
  { value: 'Chiba', label: '千葉県' },
  { value: 'Tokyo', label: '東京都' },
  { value: 'Kanagawa', label: '神奈川県' },
  { value: 'Niigata', label: '新潟県' },
  { value: 'Toyama', label: '富山県' },
  { value: 'Ishikawa', label: '石川県' },
  { value: 'Fukui', label: '福井県' },
  { value: 'Yamanashi', label: '山梨県' },
  { value: 'Nagano', label: '長野県' },
  { value: 'Gifu', label: '岐阜県' },
  { value: 'Shizuoka', label: '静岡県' },
  { value: 'Aichi', label: '愛知県' },
  { value: 'Mie', label: '三重県' },
  { value: 'Shiga', label: '滋賀県' },
  { value: 'Kyoto', label: '京都府' },
  { value: 'Osaka', label: '大阪府' },
  { value: 'Hyogo', label: '兵庫県' },
  { value: 'Nara', label: '奈良県' },
  { value: 'Wakayama', label: '和歌山県' },
  { value: 'Tottori', label: '鳥取県' },
  { value: 'Shimane', label: '島根県' },
  { value: 'Okayama', label: '岡山県' },
  { value: 'Hiroshima', label: '広島県' },
  { value: 'Yamaguchi', label: '山口県' },
  { value: 'Tokushima', label: '徳島県' },
  { value: 'Kagawa', label: '香川県' },
  { value: 'Ehime', label: '愛媛県' },
  { value: 'Kochi', label: '高知県' },
  { value: 'Fukuoka', label: '福岡県' },
  { value: 'Saga', label: '佐賀県' },
  { value: 'Nagasaki', label: '長崎県' },
  { value: 'Kumamoto', label: '熊本県' },
  { value: 'Oita', label: '大分県' },
  { value: 'Miyazaki', label: '宮崎県' },
  { value: 'Kagoshima', label: '鹿児島県' },
  { value: 'Okinawa', label: '沖縄県' },
];

// components/UsernameField.tsx

interface UsernameFieldProps {
  username: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function UsernameField({ username, onChange }: UsernameFieldProps) {
  return (
    <Form.Field name="username" className="grid mb-4">
      <Form.Label className="text-sm font-medium text-gray-700 mb-1">
        Username
      </Form.Label>
      <Form.Control asChild>
        <input
          type="text"
          required
          value={username}
          onChange={onChange}
          name="username"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black"
        />
      </Form.Control>
      <Form.Message match="valueMissing" className="text-sm text-red-500">
        Please enter your username
      </Form.Message>
    </Form.Field>
  );
}

// formで収集するデータの型を定義している。これはなんとなくわかった
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
  /* 状態管理 */
  /* Formの状態を管理する */
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

  /* errorメッセージの状態を管理する */
  const [error, setError] = useState<string>('')
  /* Errorダイアログの表示状態を管理 (ダイアログとはエラーメッセージを表示する部分？)) */
  const [showError, setShowError] = useState<boolean>(false)

  /* イベントハンドラー */
  /* handleChange() text入力とcheckboxの変更を処理 */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target
    setFormData(prev => ({
      ...prev,
      // チェックボックスの場合はcheckedプロパティを使用
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  /* handleRadioChange() ラヂオボタンの変更を処理 */
  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // イベントハンドラーを別関数として定義
  // const handlePrefectureChange = (event: ChangeEvent<HTMLSelectElement>) => {
  //   // イベントオブジェクト全体をログ出力
  //   console.log('Event object:', event);
  //   console.log('Target element:', event.target);
  //   console.log('Selected value:', event.target.value);

  //   // 値を直接取得して設定
  //   const selectedValue = event.target.value;

  //   setFormData(prevState => {
  //     const newState = {
  //       ...prevState,
  //       eria: selectedValue
  //     };
  //     console.log('New form data:', newState);
  //     return newState;
  //   });
  // };


  /* Form送信 */
  /*handleSubmit() formの送信処理を担当 */
  /* FormEvent<HTMLFormElement>は Typescript の Form 送信イベントの型である。 */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault() /* フォームのデフォルトの送信動作（ページのリロード）を防止 */
    setError('') /* Error状態をリセット */

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
        const data = await response.json();
        throw new Error(data.message || "Signup failed");
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
            <UsernameField username={formData.username} onChange={handleChange} />

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

            <Form.Field className="grid mb-4" name="prefecture">
              <div className="flex items-baseline justify-between">
                <Form.Label className="text-sm font-medium text-gray-700 mb-1">
                  Prefecture
                </Form.Label>
                <Form.Message
                  className="text-sm text-red-500"
                  match="valueMissing"
                >
                  Please select your prefecture
                </Form.Message>
              </div>

              <Form.Control asChild>
                <Select.Root
                  required
                  value={formData.eria}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      eria: value
                    });
                  }}
                  name="eria"
                >
                  <Select.Trigger
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-black inline-flex items-center justify-between"
                    aria-label="Prefecture selection"
                  >
                    <Select.Value placeholder="Select Prefecture" />
                    <Select.Icon>
                      <ChevronDown className="h-4 w-4" />
                    </Select.Icon>
                  </Select.Trigger>

                  <Select.Portal>
                    <Select.Content
                      className="bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden"
                      position="popper"
                      sideOffset={5}
                    >
                      <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                        <ChevronDown className="h-4 w-4 rotate-180" />
                      </Select.ScrollUpButton>

                      <Select.Viewport className="p-1 max-h-64 overflow-y-auto">
                        <Select.Group>
                          <Select.Label className="px-6 py-2 text-xs text-gray-500 bg-white">
                            都道府県を選択してください
                          </Select.Label>
                          {PREFECTURES.map((pref) => (
                            <Select.Item
                              key={pref.value}
                              value={pref.value}
                              className="relative flex items-center px-6 py-2 text-sm rounded-sm hover:bg-emerald-50 focus:bg-emerald-50 radix-disabled:opacity-50 focus:outline-none select-none text-black"
                            >
                              <Select.ItemText className="text-black">{pref.label}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Group>
                      </Select.Viewport>

                      <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                        <ChevronDown className="h-4 w-4" />
                      </Select.ScrollDownButton>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </Form.Control>

              {(!formData.eria) && (
                <p className="text-sm text-red-500 mt-1">
                  Please select your prefecture
                </p>
              )}
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
                Ok
              </button>
            </AlertDialog.Action>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  )
}
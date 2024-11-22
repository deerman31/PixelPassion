'use client'

import { AuthHeader } from '../components/AuthHeader'
import * as Form from '@radix-ui/react-form'
import * as AlertDialog from '@radix-ui/react-alert-dialog'

import { FormTextField } from '../components/FormTextField'
import { CheckboxField } from '../components/CheckboxField'
import { RadioGroupField } from '../components/RadioField'
import { GENDER_OPTIONS, ORIENTATION_OPTIONS, PREFECTURES } from './formOptions'
import { SelectField } from '../components/SelectField'
import { useSignUpForm } from './useSignUpForm'
import FormBirthDateField from '../components/BirthdateField'



export default function Page() {
  const {
    formData,
    error,
    showError,
    setShowError,
    handleTextChange,
    handleCheckboxChange,
    handleRadioChange,
    handleSubmit,
    setFormData
  } = useSignUpForm()

  return (
    <div className="min-h-screen bg-black">
      <AuthHeader />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Create your account
          </h1>

          <Form.Root onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <FormTextField name='username' label='Username' value={formData.username} onChange={handleTextChange} placeholder='Enter your username' />
            {/* First Name */}
            <FormTextField name='firstname' label='Firstname' value={formData.firstname} onChange={handleTextChange} placeholder='Enter your firstname' />
            {/* Last Name */}
            <FormTextField name='lastname' label='Lastname' value={formData.lastname} onChange={handleTextChange} placeholder='Enter your lastname' />

            {/* Birth Date */}
            <FormBirthDateField name='birthdate' label='BirthDate' value={formData.birthdate} onChange={handleTextChange} />

            {/* Email */}
            <FormTextField name='email' label='Email' type='email' value={formData.email} onChange={handleTextChange} placeholder="Enter your email address" />
            {/* Password */}
            <FormTextField name='password' label='Password' type='password' value={formData.password} onChange={handleTextChange} placeholder="Enter your password" />
            {/* Confirm Password */}
            <FormTextField name='repassword' label='Confirm Password' type='password' value={formData.repassword} onChange={handleTextChange} placeholder="Enter confirm your password" />

            {/* GPS Setting */}
            <CheckboxField name='isGpsEnabled' label='Enable GPS Location' checked={formData.isGpsEnabled} onChange={handleCheckboxChange} />
            {/* Gender */}
            <RadioGroupField name='gender' label='Gender' value={formData.gender} options={GENDER_OPTIONS} onChange={(value) => handleRadioChange('gender', value)} orientation='horizontal' />

            {/* Sexual Orientation */}
            <RadioGroupField name='sexual_orientation' label='Sexual Orientation' value={formData.sexual_orientation} options={ORIENTATION_OPTIONS} onChange={(value) => handleRadioChange('sexual_orientation', value)} orientation='vertical' capitalize />

            <SelectField
              name="prefecture"
              label="Prefecture"
              value={formData.eria}
              options={PREFECTURES}
              onChange={(value) => setFormData({ ...formData, eria: value })}
              placeholder="Select Prefecture"
              errorMessage="Please select your prefecture"
              selectGroupLabel="都道府県を選択してください"
            />

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
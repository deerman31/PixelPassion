// app/dashboard/page.tsx
'use client'

import { Header } from '../components/Header'
import * as Form from '@radix-ui/react-form'
import * as AlertDialog from '@radix-ui/react-alert-dialog'

import { FormTextField } from '../components/FormTextField'
import { CheckboxField } from '../components/CheckboxField'
import { RadioGroupField } from '../components/RadioField'
import { useSettingForm } from './useSettingForm'
import { GENDER_OPTIONS, ORIENTATION_OPTIONS, PREFECTURES } from './formOptions'
import { SelectField } from '../components/SelectField'

export default function Page() {
    const {
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
    } = useSettingForm()

    return (
        <div className="min-h-screen bg-black">
            <Header />
            <main className="pt-24 pb-16 px-4">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8">
                    <Form.Root onSubmit={handleUsernameSubmit} className="space-y-4">
                        {/* Username */}
                        <FormTextField name='username' label='Username' value={usernameformData.username} onChange={handleUsernameChange} placeholder='Enter your username' />
                        {/* Submit Button */}
                        <Form.Submit asChild>
                            <button
                                type="submit"
                                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                            >
                                Update Username
                            </button>
                        </Form.Submit>
                    </Form.Root>
                    <Form.Root onSubmit={handleEmailSubmit} className="space-y-4">
                        {/* Username */}
                        <FormTextField name='email' label='Email' value={emailFormData.email} onChange={handleEmailChange} placeholder='Enter your email' />
                        {/* Submit Button */}
                        <Form.Submit asChild>
                            <button
                                type="submit"
                                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                            >
                                Update Email
                            </button>
                        </Form.Submit>
                    </Form.Root>
                    <Form.Root onSubmit={handleFullnameSubmit} className="space-y-4">
                        <FormTextField name='firstname' label='Firstname' value={fullnameFormData.firstname} onChange={handleFullnameChange} placeholder='Enter your firstname' />
                        <FormTextField name='lastname' label='Lastname' value={fullnameFormData.lastname} onChange={handleFullnameChange} placeholder='Enter your lastname' />
                        <Form.Submit asChild>
                            <button
                                type="submit"
                                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                            >
                                Update Fullname
                            </button>
                        </Form.Submit>
                    </Form.Root>
                    <Form.Root onSubmit={handleGpsSubmit} className="space-y-4">
                        <CheckboxField name='isGpsEnabled' label='Enable GPS Location' checked={gpsFormData.isGpsEnabled} onChange={handleGpsCheckboxChange} />
                        <Form.Submit asChild>
                            <button
                                type="submit"
                                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                            >
                                Update GpsEnabled
                            </button>
                        </Form.Submit>
                    </Form.Root>

                    <Form.Root onSubmit={handleGenderSubmit} className="space-y-4">
                        <RadioGroupField name='gender' label='Gender' value={genderFormData.gender} options={GENDER_OPTIONS} onChange={(value) => handleGenderRadioChange('gender', value)} orientation='horizontal' />
                        <Form.Submit asChild>
                            <button
                                type="submit"
                                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                            >
                                Update Gender
                            </button>
                        </Form.Submit>
                    </Form.Root>

                    <Form.Root onSubmit={handleSexualSubmit} className="space-y-4">
                        <RadioGroupField name='sexual_orientation' label='Sexual Orientation' value={sexualFormData.sexual_orientation} options={ORIENTATION_OPTIONS} onChange={(value) => handleSexualRadioChange('sexual_orientation', value)} orientation='vertical' capitalize />
                        <Form.Submit asChild>
                            <button
                                type="submit"
                                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                            >
                                Update Sexual Orientation
                            </button>
                        </Form.Submit>
                    </Form.Root>

                    <Form.Root onSubmit={handleEriaSubmit} className="space-y-4">
                        <SelectField
                            name="prefecture"
                            label="Prefecture"
                            value={eriaFormData.eria}
                            options={PREFECTURES}
                            onChange={(value) => setEriaFormData({ ...eriaFormData, eria: value })}
                            placeholder="Select Prefecture"
                            errorMessage="Please select your prefecture"
                            selectGroupLabel="都道府県を選択してください"
                        />
                        <Form.Submit asChild>
                            <button
                                type="submit"
                                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                            >
                                Update Eria
                            </button>
                        </Form.Submit>
                    </Form.Root>

                    {/* Image Upload Link Button */}
                    <div className="mt-8">
                        <Form.Root className="space-y-4">
                            <Form.Submit asChild>
                                <a
                                    href="/setting/image_upload"
                                    className="block w-full bg-emerald-600 text-white text-center py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                                >
                                    Upload Profile Image
                                </a>
                            </Form.Submit>
                        </Form.Root>
                    </div>

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
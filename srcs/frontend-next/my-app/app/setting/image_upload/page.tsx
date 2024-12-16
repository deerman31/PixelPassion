'use client'

import { Header } from '../../components/Header'
import * as Form from '@radix-ui/react-form'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Upload } from 'lucide-react'
import { getSessionAccessToken } from '@/app/utils/veridy_token'

// Custom type for accepted image file types
type AcceptedImageTypes = 'image/jpeg' | 'image/png' | 'image/gif'

// Interface for file validation
interface FileValidation {
    maxSize: number;
    acceptedTypes: AcceptedImageTypes[];
}

// Type for upload state
type UploadState = {
    selectedFile: File | null;
    previewUrl: string | null;
    uploading: boolean;
    error: string | null;
}

// Constants
const FILE_VALIDATION: FileValidation = {
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedTypes: ['image/jpeg', 'image/png', 'image/gif']
}

export default function Page(): JSX.Element {
    // State with explicit types
    const [uploadState, setUploadState] = useState<UploadState>({
        selectedFile: null,
        previewUrl: null,
        uploading: false,
        error: null
    })

    const validateFile = (file: File): string | null => {
        if (file.size > FILE_VALIDATION.maxSize) {
            return 'File size must be less than 5MB'
        }

        if (!FILE_VALIDATION.acceptedTypes.includes(file.type as AcceptedImageTypes)) {
            return 'Please select a valid image file (JPEG, PNG, or GIF)'
        }

        return null
    }

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>): void => {
        const files = event.target.files

        if (!files || files.length === 0) {
            return
        }

        const file = files[0]
        const validationError = validateFile(file)

        if (validationError) {
            setUploadState(prev => ({
                ...prev,
                error: validationError
            }))
            return
        }

        // Create preview URL
        const url = URL.createObjectURL(file)

        setUploadState({
            selectedFile: file,
            previewUrl: url,
            uploading: false,
            error: null
        })
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        if (!uploadState.selectedFile) {
            setUploadState(prev => ({
                ...prev,
                error: 'Please select an image to upload'
            }))
            return
        }

        setUploadState(prev => ({
            ...prev,
            uploading: true,
            error: null
        }))

        try {
            const formData = new FormData()
            formData.append('image', uploadState.selectedFile)

            const accessToken = getSessionAccessToken();
            const response = await fetch('/api/update/image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: formData,
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            // Clear form and preview after successful upload
            setUploadState({
                selectedFile: null,
                previewUrl: null,
                uploading: false,
                error: null
            })

            // Redirect after successful upload
            window.location.href = '/setting/image_upload'

        } catch (err) {
            let err_messeage = "";
            if (err instanceof Error) {
                err_messeage = err.message
            } else {
                err_messeage = 'Failed to upload image. Please try again.'
            }
            setUploadState(prev => ({
                ...prev,
                uploading: false,
                error: err_messeage
            }))
        }
    }

    return (
        <div className="min-h-screen bg-black">
            <Header />
            <main className="pt-24 pb-16 px-4">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8">
                    <Form.Root className="space-y-6" onSubmit={handleSubmit}>
                        {/* File Input Section */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Upload Image
                            </label>

                            {/* Preview Section */}
                            {uploadState.previewUrl && (
                                <div className="mt-2 relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        src={uploadState.previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* File Input */}
                            <div className="mt-2">
                                <label className="block w-full cursor-pointer">
                                    <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="mt-2">
                                            <span className="text-sm text-gray-600">
                                                Click to upload or drag and drop
                                            </span>
                                        </div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            PNG, JPG, GIF up to 5MB
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept={FILE_VALIDATION.acceptedTypes.join(',')}
                                        onChange={handleFileSelect}
                                    />
                                </label>
                            </div>

                            {/* Error Message */}
                            {uploadState.error && (
                                <div className="text-red-500 text-sm mt-2">
                                    {uploadState.error}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Form.Submit asChild>
                            <button
                                type="submit"
                                disabled={uploadState.uploading || !uploadState.selectedFile}
                                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploadState.uploading ? 'Uploading...' : 'Upload Image'}
                            </button>
                        </Form.Submit>

                        {/* 42Tokyo Link */}
                        <div className="mt-4">
                            <a
                                href="/setting/image_upload"
                                className="block w-full bg-emerald-600 text-white text-center py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                            >
                                42Tokyo
                            </a>
                        </div>
                    </Form.Root>
                </div>
            </main>
        </div>
    )
}
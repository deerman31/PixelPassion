'use client'

import { Header } from '../../components/Header'
import * as Form from '@radix-ui/react-form'
import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
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
    currentImageUrl: string | null;  // 現在の画像URL用の新しいstate
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
        currentImageUrl: null,  // 初期値を追加
        uploading: false,
        error: null
    })

    // 現在の画像を取得するuseEffect
    useEffect(() => {
        const fetchCurrentImage = async () => {
            try {
                const accessToken = getSessionAccessToken();
                const response = await fetch('/api/get/image', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch current image');
                }

                const data = await response.json();
                console.log('Fetched image data:', data); // デバッグ用

                setUploadState(prev => ({
                    ...prev,
                    currentImageUrl: data.image  // currentImage ではなく currentImageUrl に修正
                }));
            } catch (err) {
                console.error('Error fetching current image:', err);
                setUploadState(prev => ({
                    ...prev,
                    error: 'Failed to load current image'
                }));
            }
        };

        fetchCurrentImage();
    }, []);

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

        setUploadState(prev => ({
            ...prev,
            selectedFile: file,
            previewUrl: url,
            error: null
        }))
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

            // アップロード成功後、現在の画像を更新
            const data = await response.json();
            console.log('Upload response:', data); // デバッグ用

            setUploadState({
                selectedFile: null,
                previewUrl: null,
                currentImageUrl: data.image,  // 新しい画像URLで更新
                uploading: false,
                error: null
            })

        } catch (err) {
            let err_message = "";
            if (err instanceof Error) {
                err_message = err.message
            } else {
                err_message = 'Failed to upload image. Please try again.'
            }
            setUploadState(prev => ({
                ...prev,
                uploading: false,
                error: err_message
            }))
        }
    }

    return (
        <div className="min-h-screen bg-black">
            <Header />
            <main className="pt-24 pb-16 px-4">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8">
                    {/* 現在の画像表示セクション */}
                    {uploadState.currentImageUrl && !uploadState.previewUrl && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                                Current Image
                            </h3>
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                                <img
                                    src={uploadState.currentImageUrl}
                                    alt="Current"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}

                    <Form.Root className="space-y-6" onSubmit={handleSubmit}>
                        {/* File Input Section */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Upload New Image
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
                    </Form.Root>
                </div>
            </main>
        </div>
    )
}
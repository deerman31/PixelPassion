// useImageUpload.ts
// useImageUpload.ts
import { useState } from "react";
import { makeAuthenticatedRequest } from "./utils";

// Custom type for accepted image file types
type AcceptedImageTypes = "image/jpeg" | "image/png" | "image/gif";

// Interface for file validation
interface FileValidation {
    maxSize: number;
    acceptedTypes: AcceptedImageTypes[];
}

// Type for upload state
interface UploadState {
    selectedFile: File | null;
    previewUrl: string | null;
    uploading: boolean;
    error: string | null;
}

// Constants
const FILE_VALIDATION: FileValidation = {
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedTypes: ["image/jpeg", "image/png", "image/gif"],
};

interface UploadResponse {
    image: string;
}

export const useImageUpload = (onUploadSuccess?: (imageUrl: string) => void) => {
    const [uploadState, setUploadState] = useState<UploadState>({
        selectedFile: null,
        previewUrl: null,
        uploading: false,
        error: null,
    });

    const validateFile = (file: File): string | null => {
        if (file.size > FILE_VALIDATION.maxSize) {
            return "File size must be less than 5MB";
        }

        if (!FILE_VALIDATION.acceptedTypes.includes(file.type as AcceptedImageTypes)) {
            return "Please select a valid image file (JPEG, PNG, or GIF)";
        }

        return null;
    };

    const upload = async (formData: FormData): Promise<void> => {
        setUploadState(prev => ({
            ...prev,
            uploading: true,
            error: null,
        }));

        try {
            const data = await makeAuthenticatedRequest<UploadResponse>("/api/update/image", {
                method: "POST",
                body: formData,
            });

            if (data && data.image) {
                onUploadSuccess?.(data.image);
            }

            setUploadState({
                selectedFile: null,
                previewUrl: null,
                uploading: false,
                error: null,
            });
        } catch (err) {
            setUploadState(prev => ({
                ...prev,
                uploading: false,
                error: err instanceof Error ? err.message : "Failed to upload image"
            }));
        }
    };

    const handleFileSelect = (file: File | null) => {
        if (!file) {
            setUploadState(prev => ({
                ...prev,
                selectedFile: null,
                previewUrl: null,
                error: null,
            }));
            return;
        }

        const validationError = validateFile(file);
        if (validationError) {
            setUploadState(prev => ({
                ...prev,
                error: validationError,
            }));
            return;
        }

        const url = URL.createObjectURL(file);
        setUploadState(prev => ({
            ...prev,
            selectedFile: file,
            previewUrl: url,
            error: null,
        }));
    };

    return {
        uploadState,
        handleFileSelect,
        upload,
    };
};
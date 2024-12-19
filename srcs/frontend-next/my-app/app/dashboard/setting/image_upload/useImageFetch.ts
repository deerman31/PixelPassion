import { useEffect, useState } from "react";
import { makeAuthenticatedRequest } from "./utils";

interface ImageFetchState {
    currentImageUrl: string | null;
    loading: boolean;
    error: string | null;
}

interface ImageResponse {
    image: string;
}

export const useImageFetch = () => {
    const [state, setState] = useState<ImageFetchState>({
        currentImageUrl: null,
        loading: true,
        error: null,
    });

    const fetchCurrentImage = async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const data = await makeAuthenticatedRequest<ImageResponse>("/api/get/image");
            setState(prev => ({
                ...prev,
                currentImageUrl: data.image,
                loading: false,
            }));
        } catch (err) {
            console.error("Error fetching current image:", err);
            setState(prev => ({
                ...prev,
                loading: false,
                error: err instanceof Error ? err.message : "Failed to load current image"
            }));
        }
    };
    useEffect(() => {
        fetchCurrentImage();
    }, []);
    return {
        ...state,
        refetch: fetchCurrentImage,
    };
};
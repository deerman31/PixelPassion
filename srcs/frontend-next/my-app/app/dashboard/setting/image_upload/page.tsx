"use client";

import { Header } from "../../../components/Header";
import * as Form from "@radix-ui/react-form";
import { type ChangeEvent, type FormEvent } from "react";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useImageUpload } from "./useImageUpload";
import { useImageFetch } from "./useImageFetch";

export default function Page(): JSX.Element {
    const { currentImageUrl, loading: fetchLoading, error: fetchError, refetch } = useImageFetch();
    const { uploadState, handleFileSelect, upload } = useImageUpload(() => {
        refetch();
    });

    const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const files = event.target.files;
        handleFileSelect(files ? files[0] : null);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        if (!uploadState.selectedFile) {
            return;
        }

        const formData = new FormData();
        formData.append("image", uploadState.selectedFile);
        await upload(formData);
    };

    if (fetchLoading) {
        return <div>Loading...</div>;
    }

    if (fetchError) {
        return <div>Error: {fetchError}</div>;
    }

    return (
        <div className="min-h-screen bg-black">
            <Header />
            <main className="pt-24 pb-16 px-4">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8">
                    {currentImageUrl && !uploadState.previewUrl && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                                Current Image
                            </h3>
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                    src={currentImageUrl}
                                    alt="Current profile image"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    )}

                    <Form.Root className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Upload New Image
                            </label>

                            {uploadState.previewUrl && (
                                <div className="mt-2 relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                                    <Image
                                        src={uploadState.previewUrl}
                                        alt="Preview of selected image"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            )}

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
                                        accept="image/jpeg,image/png,image/gif"
                                        onChange={handleFileInputChange}
                                    />
                                </label>
                            </div>

                            {uploadState.error && (
                                <div className="text-red-500 text-sm mt-2">
                                    {uploadState.error}
                                </div>
                            )}
                        </div>

                        <Form.Submit asChild>
                            <button
                                type="submit"
                                disabled={uploadState.uploading || !uploadState.selectedFile}
                                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploadState.uploading ? "Uploading..." : "Upload Image"}
                            </button>
                        </Form.Submit>
                    </Form.Root>
                </div>
            </main>
        </div>
    );
}
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { X, ImageIcon } from 'lucide-react';

interface ImagePreviewProps {
    imageUrl: string;
    onRemove?: () => void;
    className?: string;
}

export default function ImagePreview({ imageUrl, onRemove, className = '' }: ImagePreviewProps) {
    const [error, setError] = useState(false);
    const [showFullscreen, setShowFullscreen] = useState(false);

    if (!imageUrl || imageUrl.trim() === '') {
        return (
            <div className={`flex items-center justify-center bg-cream-dark border-2 border-dashed border-primary/20 ${className}`}>
                <div className="text-center p-4">
                    <ImageIcon className="w-8 h-8 text-primary/30 mx-auto mb-2" />
                    <p className="text-caption text-primary/50">No image</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex items-center justify-center bg-red-50 border border-red-200 ${className}`}>
                <div className="text-center p-4">
                    <p className="text-sm text-red-600">Failed to load image</p>
                    <p className="text-xs text-red-400 mt-1 break-all">{imageUrl}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={`relative group ${className}`}>
                <Image
                    src={imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                    onError={() => setError(true)}
                    unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                        onClick={() => setShowFullscreen(true)}
                        className="px-4 py-2 bg-white/90 text-primary text-sm hover:bg-white transition-colors"
                    >
                        View Full
                    </button>
                </div>
                {onRemove && (
                    <button
                        onClick={onRemove}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {showFullscreen && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setShowFullscreen(false)}
                >
                    <button
                        onClick={() => setShowFullscreen(false)}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <div className="max-w-7xl max-h-full">
                        <Image
                            src={imageUrl}
                            alt="Full preview"
                            width={1920}
                            height={1080}
                            className="max-w-full max-h-[90vh] object-contain"
                            unoptimized
                        />
                    </div>
                </div>
            )}
        </>
    );
}














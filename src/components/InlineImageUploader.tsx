'use client';

import { useState, useRef } from 'react';
import { Upload, X, Eye, ImageIcon, Check } from 'lucide-react';
import { api } from '@/lib/api';

interface InlineImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    folder?: string;
    label?: string;
    className?: string;
    previewHeight?: string;
}

export default function InlineImageUploader({
    value,
    onChange,
    folder = 'admin',
    label,
    className = '',
    previewHeight = 'h-32',
}: InlineImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [justUploaded, setJustUploaded] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (!file) return;
        setUploading(true);
        setUploadError('');
        try {
            const res = await api.admin.uploadImage(file, folder);
            const url = res.data?.url || '';
            if (!url) throw new Error('No URL returned');
            onChange(url);
            setJustUploaded(true);
            setTimeout(() => setJustUploaded(false), 2500);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Upload failed';
            setUploadError(msg);
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file?.type.startsWith('image/')) handleFile(file);
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="block text-caption uppercase tracking-widest text-primary/70">{label}</label>
            )}

            {/* Image Preview Area */}
            <div
                className={`relative ${previewHeight} bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden group`}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
            >
                {value ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={e => { e.currentTarget.style.display = 'none'; }}
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-800 text-xs font-semibold rounded-lg hover:bg-amber-50 transition-colors"
                            >
                                <Upload size={12} /> Change
                            </button>
                            <a
                                href={value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-800 text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                <Eye size={12} /> View
                            </a>
                            <button
                                type="button"
                                onClick={() => onChange('')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors"
                            >
                                <X size={12} /> Remove
                            </button>
                        </div>
                        {justUploaded && (
                            <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                <Check size={10} /> Uploaded!
                            </div>
                        )}
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
                    >
                        <ImageIcon size={28} />
                        <span className="text-xs font-medium">Click or drag to upload image</span>
                    </button>
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs text-gray-600 font-medium">Uploading...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* URL Input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="Paste image URL or upload above"
                    className="flex-1 px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-amber-400 bg-white rounded"
                />
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-semibold rounded transition-colors whitespace-nowrap"
                >
                    <Upload size={13} />
                    {uploading ? 'Uploading…' : 'Upload'}
                </button>
            </div>

            {uploadError && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                    <X size={11} /> {uploadError}
                </p>
            )}

            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                    e.target.value = '';
                }}
            />
        </div>
    );
}

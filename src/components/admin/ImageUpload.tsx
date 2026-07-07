"use client";

import React, { useState, useRef } from "react";
import api from "@/lib/api";
import { resolveImage } from "@/lib/asset-map";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  aspectRatio?: string;
}

export function ImageUpload({ value, onChange, className = "", aspectRatio = "aspect-video" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      setPreview(reader.result as string);
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("image", file, file.name || "image.jpg");
        const { data: res } = await api.post("/admin/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        onChange(res.url);
        setPreview(null);
      } catch (err: any) {
        alert(err.response?.data?.message || "Upload failed");
        setPreview(null);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const displaySrc = preview || (value ? resolveImage(value) : null);

  return (
    <div className={`relative group w-full rounded-xl border-2 border-dashed border-white/10 overflow-hidden flex flex-col items-center justify-center transition-all hover:border-amber-500/30 ${aspectRatio} ${className}`}>
      {!displaySrc && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-6 text-center hover:bg-white/[0.02] transition-colors"
        >
          <div className="w-12 h-12 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Click to upload</p>
          <p className="text-[10px] text-zinc-700 mt-1">PNG, JPG or WebP · max 5MB</p>
        </div>
      )}

      {displaySrc && (
        <div className="relative w-full h-full">
          <img src={displaySrc} className="w-full h-full object-contain" alt="Preview" />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white/90 text-black text-xs font-semibold hover:bg-white transition-colors"
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={clear}
              className="w-8 h-8 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-500 transition-colors absolute top-2 right-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-white font-semibold uppercase tracking-wider">Uploading...</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={isUploading}
      />
    </div>
  );
}

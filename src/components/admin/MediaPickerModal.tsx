'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Upload, Check, Image as ImageIcon } from 'lucide-react';
import { MediaItem } from '@/types/admin';
import { getMediaItems, uploadMediaItem } from '@/lib/admin/mediaService';

interface MediaPickerModalProps {
  isOpen: boolean;
  onSelect: (imageUrl: string, altText?: string) => void;
  onClose: () => void;
}

export function MediaPickerModal({ isOpen, onSelect, onClose }: MediaPickerModalProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    getMediaItems().then((res) => {
      if (mounted) {
        setItems(res);
        setSelectedId(null);
        setUploadError(null);
      }
    });

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const result = await uploadMediaItem(file, file.name.replace(/\.[^/.]+$/, ''));
    setIsUploading(false);

    if (result.success && result.item) {
      const refreshed = await getMediaItems();
      setItems(refreshed);
      setSelectedId(result.item.id);
    } else {
      setUploadError(result.error || 'Failed to process image');
    }
  };

  const handleConfirm = () => {
    const target = items.find(i => i.id === selectedId);
    if (target) {
      onSelect(target.url, target.altText);
      onClose();
    }
  };

  const selectedItem = items.find(i => i.id === selectedId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#111522] border border-[#272B3A] rounded-2xl flex flex-col max-h-[85vh] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#272B3A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Media Library Picker</h3>
              <p className="text-xs text-[#A1A1AA]">Select an existing image or upload an asset for this article</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#171C2B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload bar */}
        <div className="p-4 bg-[#171C2B]/50 border-b border-[#272B3A] flex flex-wrap items-center justify-between gap-3">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-xs font-semibold transition-colors shadow-sm shadow-[#8B5CF6]/30">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Asset</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>

          {isUploading && <span className="text-xs text-[#38BDF8] animate-pulse">Processing file...</span>}
          {uploadError && <span className="text-xs text-red-400">{uploadError}</span>}
          <span className="text-xs text-[#A1A1AA]">Supports JPEG, PNG, WebP, AVIF, SVG (max 10MB)</span>
        </div>

        {/* Gallery Grid */}
        <div className="p-5 overflow-y-auto flex-grow">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map(item => {
              const isSelected = item.id === selectedId;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`group relative aspect-video rounded-xl overflow-hidden border cursor-pointer bg-[#090B12] transition-all duration-200 ${
                    isSelected
                      ? 'border-[#8B5CF6] ring-2 ring-[#8B5CF6]/40 shadow-lg'
                      : 'border-[#272B3A] hover:border-[#8B5CF6]/50'
                  }`}
                >
                  <Image
                    src={item.url}
                    alt={item.altText || item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                    <p className="text-[11px] font-medium text-[#F8FAFC] truncate">{item.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info & confirm */}
        <div className="p-4 border-t border-[#272B3A] bg-[#111522] flex items-center justify-between">
          <div className="text-xs text-[#A1A1AA] truncate max-w-sm">
            {selectedItem ? (
              <span>Selected: <strong className="text-[#F8FAFC]">{selectedItem.name}</strong></span>
            ) : (
              <span>No image selected</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#171C2B] text-[#A1A1AA] hover:text-[#F8FAFC] border border-[#272B3A] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedId}
              onClick={handleConfirm}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#8B5CF6] hover:bg-[#7c3aed] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#8B5CF6]/20"
            >
              Select Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

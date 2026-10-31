'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Upload,
  Trash2,
  Copy,
  Check,
  FileImage,
  AlertCircle,
  Eye,
  Info,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import {
  getMediaItems,
  uploadMediaItem,
  deleteMediaItem,
} from '@/lib/admin/mediaService';
import { MediaItem } from '@/types/admin';

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Upload UI state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Selected item modal / detail state
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const refreshMedia = async () => {
    setIsLoading(true);
    const data = await getMediaItems();
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    getMediaItems().then((data) => {
      if (mounted) {
        setItems(data);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    setUploadError(null);

    const result = await uploadMediaItem(
      file,
      file.name.replace(/\.[^/.]+$/, ''),
      (prog) => setUploadProgress(prog)
    );

    setIsUploading(false);

    if (result.success) {
      await refreshMedia();
    } else {
      setUploadError(result.error || 'Failed to upload image');
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteMediaItem(deleteTarget.id);
    if (activeItem?.id === deleteTarget.id) {
      setActiveItem(null);
    }
    setDeleteTarget(null);
    await refreshMedia();
  };

  return (
    <AdminLayout pageTitle="Media Library">
      <div className="space-y-6">
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC]">
              Asset &amp; Image Repository
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA]">
              Manage featured article thumbnails, diagram blueprints, and inline editorial media.
            </p>
          </div>

          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#8B5CF6]/20 self-start sm:self-auto">
            <Upload className="w-4 h-4" />
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Upload Progress / Error bar */}
        {isUploading && (
          <div className="p-4 rounded-xl bg-[#111522] border border-[#38BDF8]/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#38BDF8]">
              <span>Processing and validating asset format...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#171C2B] rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-[#8B5CF6] to-[#38BDF8] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {uploadError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Notice on Cloud Storage architecture */}
        <div className="p-4 rounded-xl bg-[#111522] border border-[#272B3A] flex items-start gap-3 text-xs text-[#A1A1AA]">
          <Info className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#F8FAFC]">Supabase Storage Ready:</span>{' '}
            Media operations are architected around the dedicated `article-images` bucket. While in unlinked mode, local project SVGs and browser object previews are displayed. Connecting Supabase in Phase 3/Settings enables direct bucket uploads.
          </div>
        </div>

        {/* Media Grid */}
        <div className="bg-[#111522] border border-[#272B3A] rounded-2xl p-6 shadow-xl">
          {isLoading ? (
            <div className="py-16 text-center text-[#A1A1AA] text-sm">
              Loading media library assets...
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-video rounded-xl overflow-hidden border border-[#272B3A] hover:border-[#8B5CF6] bg-[#090B12] transition-all duration-200"
                >
                  <Image
                    src={item.url}
                    alt={item.altText || item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <p className="text-[10px] text-[#F8FAFC] font-semibold truncate">
                      {item.name}
                    </p>

                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(item.url)}
                        className="p-1 rounded bg-[#171C2B] hover:bg-[#8B5CF6] text-white transition-colors"
                        title="Copy asset path"
                      >
                        {copiedUrl === item.url ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveItem(item)}
                        className="p-1 rounded bg-[#171C2B] hover:bg-[#38BDF8] text-white transition-colors"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="p-1 rounded bg-[#171C2B] hover:bg-red-600 text-white transition-colors"
                        title="Delete asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-[#A1A1AA]">
              <FileImage className="w-10 h-10 text-[#272B3A] mx-auto mb-2" />
              <p className="font-semibold text-[#F8FAFC]">No Media Assets Uploaded</p>
              <p className="text-xs text-[#A1A1AA] mt-1">
                Upload your first image asset using the button above.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Asset Details Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#111522] border border-[#272B3A] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#F8FAFC] pb-2 border-b border-[#272B3A]">
              Asset Metadata &amp; Preview
            </h3>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-[#090B12] border border-[#272B3A]">
              <Image
                src={activeItem.url}
                alt={activeItem.altText}
                fill
                className="object-contain"
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#272B3A]">
                <span className="text-[#A1A1AA]">File Name:</span>
                <span className="font-mono text-[#F8FAFC]">{activeItem.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#272B3A]">
                <span className="text-[#A1A1AA]">Path / URL:</span>
                <span className="font-mono text-[#38BDF8] truncate max-w-xs">{activeItem.url}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#272B3A]">
                <span className="text-[#A1A1AA]">File Size:</span>
                <span className="text-[#F8FAFC]">{(activeItem.sizeBytes / 1024).toFixed(1)} KB</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#272B3A]">
                <span className="text-[#A1A1AA]">MIME Type:</span>
                <span className="text-[#F8FAFC]">{activeItem.mimeType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#272B3A]">
                <span className="text-[#A1A1AA]">Default Alt Text:</span>
                <span className="text-[#F8FAFC] max-w-sm truncate">{activeItem.altText}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleCopy(activeItem.url)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#171C2B] hover:bg-[#8B5CF6] text-white border border-[#272B3A] transition-colors"
              >
                Copy URL
              </button>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#8B5CF6] text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Confirm Asset Deletion"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Any articles referencing this asset URL will need a new image.`}
        confirmLabel="Delete Asset"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}

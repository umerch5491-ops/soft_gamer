import { MediaItem } from '@/types/admin';

const LOCAL_STORAGE_MEDIA_KEY = 'softgamer_admin_demo_media';

const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'med-001',
    name: 'placeholder-tech.svg',
    url: '/images/articles/placeholder-tech.svg',
    altText: 'Futuristic technical blueprint illustrating digital mesh shading and GPU computing nodes',
    sizeBytes: 15420,
    mimeType: 'image/svg+xml',
    uploadedAt: '2026-10-28T14:30:00Z',
  },
  {
    id: 'med-002',
    name: 'placeholder-pc.svg',
    url: '/images/articles/placeholder-pc.svg',
    altText: 'Modern dark gaming PC rig interior with subtle violet illumination',
    sizeBytes: 12840,
    mimeType: 'image/svg+xml',
    uploadedAt: '2026-10-27T11:00:00Z',
  },
  {
    id: 'med-003',
    name: 'placeholder-mobile.svg',
    url: '/images/articles/placeholder-mobile.svg',
    altText: 'Sleek dark handheld gaming device displaying responsive tactical controls',
    sizeBytes: 11950,
    mimeType: 'image/svg+xml',
    uploadedAt: '2026-10-26T16:45:00Z',
  },
  {
    id: 'med-004',
    name: 'placeholder-console.svg',
    url: '/images/articles/placeholder-console.svg',
    altText: 'Next-gen gaming console controller resting on a minimalist dark obsidian desk',
    sizeBytes: 13200,
    mimeType: 'image/svg+xml',
    uploadedAt: '2026-10-25T13:20:00Z',
  },
  {
    id: 'med-005',
    name: 'placeholder-guide.svg',
    url: '/images/articles/placeholder-guide.svg',
    altText: 'Detailed tactical map with waypoint markers and supply caches in dark blueprint styling',
    sizeBytes: 14100,
    mimeType: 'image/svg+xml',
    uploadedAt: '2026-10-24T18:00:00Z',
  },
  {
    id: 'med-006',
    name: 'placeholder-review.svg',
    url: '/images/articles/placeholder-review.svg',
    altText: 'Atmospheric fantasy fortress illuminated by ethereal moonlight and twilight fog',
    sizeBytes: 12450,
    mimeType: 'image/svg+xml',
    uploadedAt: '2026-10-23T15:10:00Z',
  },
  {
    id: 'med-007',
    name: 'og-default.svg',
    url: '/images/og-default.svg',
    altText: 'Soft Gamer social preview and meta branding banner',
    sizeBytes: 18400,
    mimeType: 'image/svg+xml',
    uploadedAt: '2026-10-20T12:00:00Z',
  },
];

export async function getMediaItems(): Promise<MediaItem[]> {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(LOCAL_STORAGE_MEDIA_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MEDIA_ITEMS;
      }
    }
    localStorage.setItem(LOCAL_STORAGE_MEDIA_KEY, JSON.stringify(INITIAL_MEDIA_ITEMS));
  }
  return INITIAL_MEDIA_ITEMS;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];
  if (!allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file format (${file.type}). Allowed formats: JPEG, PNG, WebP, AVIF, SVG.`,
    };
  }

  // 10 MB limit
  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is 10MB.`,
    };
  }

  return { valid: true };
}

export async function uploadMediaItem(
  file: File,
  altText: string,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; item?: MediaItem; error?: string }> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Simulate progress
  if (onProgress) {
    onProgress(30);
    await new Promise(r => setTimeout(r, 200));
    onProgress(70);
    await new Promise(r => setTimeout(r, 200));
    onProgress(100);
  }

  // In demo mode without live Supabase storage bucket, create an object URL or base64 preview
  const previewUrl = URL.createObjectURL(file);
  const newItem: MediaItem = {
    id: 'med-' + Date.now(),
    name: file.name,
    url: previewUrl,
    altText: altText || file.name.replace(/\.[^/.]+$/, ''),
    sizeBytes: file.size,
    mimeType: file.type,
    uploadedAt: new Date().toISOString(),
  };

  const current = await getMediaItems();
  current.unshift(newItem);
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_MEDIA_KEY, JSON.stringify(current));
  }

  return { success: true, item: newItem };
}

export async function deleteMediaItem(id: string): Promise<{ success: boolean; error?: string }> {
  const current = await getMediaItems();
  const filtered = current.filter(m => m.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_MEDIA_KEY, JSON.stringify(filtered));
  }
  return { success: true };
}


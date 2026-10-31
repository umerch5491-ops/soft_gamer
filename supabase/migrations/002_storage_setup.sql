-- Soft Gamer: Phase 2 Storage Setup
-- Migration 002: Article Images Dedicated Storage Bucket & Policies

-- 1. Create a dedicated storage bucket for article featured images and inline assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'article-images',
    'article-images',
    true,
    10485760, -- 10MB maximum file size
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];

-- 2. Storage Object RLS Policies

-- Anyone can read public article images
CREATE POLICY "Public read article images"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'article-images');

-- Only authenticated staff/editors can upload images to the article-images bucket
CREATE POLICY "Staff upload article images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'article-images');

-- Only authenticated staff/editors can update image objects
CREATE POLICY "Staff update article images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'article-images')
    WITH CHECK (bucket_id = 'article-images');

-- Only authenticated staff/editors can delete image objects
CREATE POLICY "Staff delete article images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'article-images');


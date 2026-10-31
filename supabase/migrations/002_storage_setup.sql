-- Soft Gamer: Phase 2 Storage Setup
-- Migration 002: Article Images Dedicated Storage Bucket & Hardened RLS Policies

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

-- 2. Storage Object RLS Policies (Idempotent and strictly restricted to verified staff)

-- Anyone (public visitors + authenticated readers) can read public article images
DROP POLICY IF EXISTS "Public read article images" ON storage.objects;
CREATE POLICY "Public read article images"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'article-images');

-- Only verified staff (Admin or Editor) can upload images to the article-images bucket
DROP POLICY IF EXISTS "Staff upload article images" ON storage.objects;
CREATE POLICY "Staff upload article images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'article-images' AND
        public.is_staff()
    );

-- Only verified staff (Admin or Editor) can update image objects
DROP POLICY IF EXISTS "Staff update article images" ON storage.objects;
CREATE POLICY "Staff update article images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'article-images' AND
        public.is_staff()
    )
    WITH CHECK (
        bucket_id = 'article-images' AND
        public.is_staff()
    );

-- Only verified staff (Admin or Editor) can delete image objects
DROP POLICY IF EXISTS "Staff delete article images" ON storage.objects;
CREATE POLICY "Staff delete article images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'article-images' AND
        public.is_staff()
    );

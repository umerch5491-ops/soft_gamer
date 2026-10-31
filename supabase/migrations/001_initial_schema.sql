-- Soft Gamer: Phase 2 Database Schema Migration
-- Migration 001: Tables, Relationships, Indexes & Row Level Security

-- Enable cryptographic UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. AUTHORS TABLE
CREATE TABLE IF NOT EXISTS public.authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    bio TEXT,
    avatar TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    featured_image TEXT NOT NULL,
    image_alt TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    author_id UUID NOT NULL REFERENCES public.authors(id) ON DELETE RESTRICT,
    seo_title TEXT,
    meta_description TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_status_published ON public.articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON public.articles(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_authors_slug ON public.authors(slug);

-- Full text search index over title, excerpt, and content
CREATE INDEX IF NOT EXISTS idx_articles_fts ON public.articles USING gin(
    to_tsvector('english', title || ' ' || excerpt || ' ' || content)
);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 5.1 Categories Policies
-- Everyone (anonymous + authenticated) can view categories
CREATE POLICY "Public categories read access"
    ON public.categories
    FOR SELECT
    USING (true);

-- Authenticated staff/editors only can modify categories (prepared for Phase 3)
CREATE POLICY "Staff insert categories"
    ON public.categories
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Staff update categories"
    ON public.categories
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Staff delete categories"
    ON public.categories
    FOR DELETE
    TO authenticated
    USING (true);

-- 5.2 Authors Policies
-- Everyone can view authors
CREATE POLICY "Public authors read access"
    ON public.authors
    FOR SELECT
    USING (true);

-- Authenticated staff/editors only can modify authors
CREATE POLICY "Staff insert authors"
    ON public.authors
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Staff update authors"
    ON public.authors
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Staff delete authors"
    ON public.authors
    FOR DELETE
    TO authenticated
    USING (true);

-- 5.3 Articles Policies
-- STRICT PRIVACY: Public users can ONLY read published articles whose publish date is not in the future.
-- Drafts and scheduled articles are strictly hidden from anonymous/public readers.
CREATE POLICY "Public published articles read access"
    ON public.articles
    FOR SELECT
    USING (
        status = 'published' AND published_at <= NOW()
    );

-- Authenticated staff/editors can view ALL articles (including drafts and scheduled)
CREATE POLICY "Staff full articles select"
    ON public.articles
    FOR SELECT
    TO authenticated
    USING (true);

-- Authenticated staff/editors can create, edit, and delete articles
CREATE POLICY "Staff insert articles"
    ON public.articles
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Staff update articles"
    ON public.articles
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Staff delete articles"
    ON public.articles
    FOR DELETE
    TO authenticated
    USING (true);


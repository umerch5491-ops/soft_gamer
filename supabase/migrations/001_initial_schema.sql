-- Soft Gamer: Phase 2 Database Schema Migration
-- Migration 001: Tables, Relationships, Indexes & Hardened Row Level Security (RLS)

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

-- 4. STAFF ROLES TABLE (Role-Based Access Control)
-- Prevents ordinary authenticated users from gaining admin/editor privileges.
-- Stores explicit staff assignments decoupled from user-editable client metadata.
CREATE TABLE IF NOT EXISTS public.staff_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'editor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT staff_roles_user_id_key UNIQUE (user_id)
);

-- 5. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_status_published ON public.articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON public.articles(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_authors_slug ON public.authors(slug);
CREATE INDEX IF NOT EXISTS idx_staff_roles_user_id ON public.staff_roles(user_id);

-- Full text search index over title, excerpt, and content
CREATE INDEX IF NOT EXISTS idx_articles_fts ON public.articles USING gin(
    to_tsvector('english', title || ' ' || excerpt || ' ' || content)
);

-- 6. SECURITY HELPER FUNCTIONS (SECURITY DEFINER with strict search_path)
-- Ensures role checks only inspect secure server-managed app_metadata or the staff_roles table,
-- completely ignoring user-editable raw_user_meta_data to prevent privilege escalation.

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
BEGIN
  -- 1. Check secure JWT app_metadata (managed exclusively by server/admin, unalterable by client)
  IF coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('admin', 'editor') THEN
    RETURN TRUE;
  END IF;

  -- 2. Check explicitly assigned staff_roles database table
  IF EXISTS (
    SELECT 1 FROM public.staff_roles
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  ) THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
BEGIN
  -- 1. Check secure JWT app_metadata
  IF coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin' THEN
    RETURN TRUE;
  END IF;

  -- 2. Check explicitly assigned staff_roles database table
  IF EXISTS (
    SELECT 1 FROM public.staff_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$;

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_roles ENABLE ROW LEVEL SECURITY;

-- 7.1 Staff Roles Policies
-- Only confirmed administrators can view or alter staff assignments
DROP POLICY IF EXISTS "Admins can manage staff roles" ON public.staff_roles;
CREATE POLICY "Admins can manage staff roles"
    ON public.staff_roles
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Users can view their own staff role" ON public.staff_roles;
CREATE POLICY "Users can view their own staff role"
    ON public.staff_roles
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- 7.2 Categories Policies
-- Everyone (anonymous + authenticated) can view categories
DROP POLICY IF EXISTS "Public categories read access" ON public.categories;
CREATE POLICY "Public categories read access"
    ON public.categories
    FOR SELECT
    USING (true);

-- Only verified staff can insert/update/delete categories
DROP POLICY IF EXISTS "Staff insert categories" ON public.categories;
CREATE POLICY "Staff insert categories"
    ON public.categories
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "Staff update categories" ON public.categories;
CREATE POLICY "Staff update categories"
    ON public.categories
    FOR UPDATE
    TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "Staff delete categories" ON public.categories;
CREATE POLICY "Staff delete categories"
    ON public.categories
    FOR DELETE
    TO authenticated
    USING (public.is_staff());

-- 7.3 Authors Policies
-- Everyone can view authors
DROP POLICY IF EXISTS "Public authors read access" ON public.authors;
CREATE POLICY "Public authors read access"
    ON public.authors
    FOR SELECT
    USING (true);

-- Only verified staff can insert/update/delete authors
DROP POLICY IF EXISTS "Staff insert authors" ON public.authors;
CREATE POLICY "Staff insert authors"
    ON public.authors
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "Staff update authors" ON public.authors;
CREATE POLICY "Staff update authors"
    ON public.authors
    FOR UPDATE
    TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "Staff delete authors" ON public.authors;
CREATE POLICY "Staff delete authors"
    ON public.authors
    FOR DELETE
    TO authenticated
    USING (public.is_staff());

-- 7.4 Articles Policies
-- STRICT PRIVACY & ZERO EMBARGO LEAKAGE:
-- Anonymous visitors and regular authenticated users can ONLY read published articles with published_at <= NOW().
-- Drafts, review embargos, and scheduled articles are strictly hidden unless the user is confirmed staff.
DROP POLICY IF EXISTS "Public published articles read access" ON public.articles;
DROP POLICY IF EXISTS "Staff full articles select" ON public.articles;
DROP POLICY IF EXISTS "Public and reader articles read access" ON public.articles;
CREATE POLICY "Public and reader articles read access"
    ON public.articles
    FOR SELECT
    USING (
        (status = 'published' AND published_at <= NOW())
        OR
        public.is_staff()
    );

-- Only verified staff (Admin or Editor) can insert, edit, or delete articles
DROP POLICY IF EXISTS "Staff insert articles" ON public.articles;
CREATE POLICY "Staff insert articles"
    ON public.articles
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "Staff update articles" ON public.articles;
CREATE POLICY "Staff update articles"
    ON public.articles
    FOR UPDATE
    TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "Staff delete articles" ON public.articles;
CREATE POLICY "Staff delete articles"
    ON public.articles
    FOR DELETE
    TO authenticated
    USING (public.is_staff());

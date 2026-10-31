# Soft Gamer — Supabase Database & Storage Setup Guide

This directory contains the database migrations, Row Level Security (RLS) policies, storage bucket configurations, and initial editorial seed data for **Soft Gamer Phase 2**.

---

## 1. Prerequisites

1. Create an account and a new project at [supabase.com](https://supabase.com).
2. Note your **Project URL** and **anon / publishable API key** from:
   `Project Settings -> API -> Project API keys`.

---

## 2. Step-by-Step SQL Execution

In your Supabase project dashboard, navigate to the **SQL Editor** (`New query`) and execute the files in order:

### Step 2.1: Schema, Indexes & Row Level Security
Copy the entire content of [`supabase/migrations/001_initial_schema.sql`](file:///d:/Ali/umer_game_website/supabase/migrations/001_initial_schema.sql) and click **Run**.
This creates:
- `categories` table with UUID keys and unique slugs.
- `authors` table with bios and avatar fields.
- `articles` table with foreign key constraints, status checks (`draft`, `published`, `scheduled`), and tags.
- B-tree and Full-Text Search (GIN) indexes.
- RLS policies ensuring public users can **only** read published articles whose publication date is `<= NOW()`. Drafts and scheduled articles remain strictly private.

### Step 2.2: Article Images Storage Bucket
Copy the entire content of [`supabase/migrations/002_storage_setup.sql`](file:///d:/Ali/umer_game_website/supabase/migrations/002_storage_setup.sql) and click **Run**.
This creates:
- The public `article-images` storage bucket (10MB limit, allowed image mime types).
- Public read access for images.
- Authenticated-only restrictions for uploading, updating, and deleting images.

### Step 2.3: Initial Seed Data (Optional but Recommended)
Copy the entire content of [`supabase/seed.sql`](file:///d:/Ali/umer_game_website/supabase/seed.sql) and click **Run**.
This populates:
- The 6 primary editorial hubs (Gaming News, PC Gaming, Mobile Gaming, Console Gaming, Game Guides, Reviews).
- The editorial staff profiles.
- Verified launch articles mapped correctly with foreign keys.

---

## 3. Environment Variables Configuration

In your project root, add your credentials to `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-publishable-key>
```

When deployed to Vercel, enter these same variables under **Project Settings -> Environment Variables**.

---

## 4. Security Architecture Summary

- **Public Access:** Unauthenticated readers can only execute `SELECT` on published articles with `published_at <= NOW()`.
- **Draft & Scheduled Protection:** Drafts and future scheduled articles are filtered at both the database RLS level and the Next.js Data Access Layer (DAL).
- **Service-Role Safety:** Public website code utilizes solely the anonymous publishable key; the `service_role` key is never exposed to the client or public pages.
- **Phase 3 Readiness:** Write policies (`INSERT`, `UPDATE`, `DELETE`) require `authenticated` user roles, preparing the schema for the custom admin dashboard in Phase 3.


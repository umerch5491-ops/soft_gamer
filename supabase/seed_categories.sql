-- Seed structural categories (required for article FK constraints)
-- Safe to run multiple times (ON CONFLICT DO NOTHING)
INSERT INTO public.categories (name, slug, description) VALUES
  ('Gaming News',    'gaming-news',    'Industry news and announcements.'),
  ('PC Gaming',      'pc-gaming',      'PC hardware, software, and gaming rigs.'),
  ('Mobile Gaming',  'mobile-gaming',  'Mobile and handheld gaming.'),
  ('Console Gaming', 'console-gaming', 'Console ecosystem coverage.'),
  ('Game Guides',    'game-guides',    'Walkthroughs, tips, and strategies.'),
  ('Reviews',        'reviews',        'Editorial game and hardware reviews.')
ON CONFLICT (slug) DO NOTHING;

-- Seed one minimal author for the admin user
INSERT INTO public.authors (name, slug, bio)
VALUES ('Soft Gamer Editor', 'soft-gamer-editor', 'Editorial Staff')
ON CONFLICT (slug) DO NOTHING;

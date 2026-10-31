-- Soft Gamer: Phase 2 Seed Data
-- Inserts initial editorial categories, authors, and launch articles

DO $$
DECLARE
    cat_news UUID;
    cat_pc UUID;
    cat_mobile UUID;
    cat_console UUID;
    cat_guides UUID;
    cat_reviews UUID;

    auth_elena UUID;
    auth_marcus UUID;
    auth_kaito UUID;
    auth_sarah UUID;
    auth_david UUID;
BEGIN
    -- 1. Insert Categories
    INSERT INTO public.categories (name, slug, description)
    VALUES ('Gaming News', 'gaming-news', 'Fresh updates, industry shifts, studio announcements, and major headlines across gaming.')
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO cat_news;

    INSERT INTO public.categories (name, slug, description)
    VALUES ('PC Gaming', 'pc-gaming', 'Hardware insights, Steam highlights, system benchmarks, and tactical PC experiences.')
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO cat_pc;

    INSERT INTO public.categories (name, slug, description)
    VALUES ('Mobile Gaming', 'mobile-gaming', 'Handheld updates, cross-platform gems, touch controllers, and iOS/Android analysis.')
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO cat_mobile;

    INSERT INTO public.categories (name, slug, description)
    VALUES ('Console Gaming', 'console-gaming', 'PlayStation 5, Xbox Series X|S, and Nintendo ecosystem breakthroughs and exclusives.')
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO cat_console;

    INSERT INTO public.categories (name, slug, description)
    VALUES ('Game Guides', 'game-guides', 'Comprehensive walkthroughs, build recommendations, mechanics breakdowns, and progression tips.')
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO cat_guides;

    INSERT INTO public.categories (name, slug, description)
    VALUES ('Reviews', 'reviews', 'Editorial impressions, performance breakdowns, and gameplay critiques without fabricated scores.')
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO cat_reviews;

    -- 2. Insert Authors
    INSERT INTO public.authors (name, slug, bio, avatar)
    VALUES ('Elena Rostova', 'elena-rostova', 'Senior Tech & Hardware Editor', NULL)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO auth_elena;

    INSERT INTO public.authors (name, slug, bio, avatar)
    VALUES ('Marcus Vance', 'marcus-vance', 'Competitive Hardware Analyst', NULL)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO auth_marcus;

    INSERT INTO public.authors (name, slug, bio, avatar)
    VALUES ('Kaito Tanaka', 'kaito-tanaka', 'Mobile & Handheld Specialist', NULL)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO auth_kaito;

    INSERT INTO public.authors (name, slug, bio, avatar)
    VALUES ('Sarah Jenkins', 'sarah-jenkins', 'Console Ecosystem Reporter', NULL)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO auth_sarah;

    INSERT INTO public.authors (name, slug, bio, avatar)
    VALUES ('David Ortiz', 'david-ortiz', 'Senior Guides Editor', NULL)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO auth_david;

    -- 3. Insert Editorial Articles
    INSERT INTO public.articles (
        title, slug, excerpt, content, featured_image, image_alt,
        category_id, author_id, seo_title, meta_description, tags,
        status, featured, published_at
    )
    VALUES
    (
        'Next-Generation Graphics Pipelines: How Mesh Shading Transforms Open-World Rendering',
        'next-gen-graphics-mesh-shading-open-world',
        'An editorial deep-dive into how modern rendering architectures handle massive geometric density and dynamic LODs in ambitious virtual worlds.',
        'Modern game engines are undergoing a silent revolution in geometry processing. For decades, the traditional graphics pipeline relied on fixed-function primitive assembly and hull/domain tessellation stages that struggled with highly dynamic geometric budgets.

### The Problem With Traditional Primitive Processing
When rendering complex scenes with millions of triangles, conventional hardware pipelines suffered from bottlenecks at the vertex fetch and geometry transformation stages. The CPU-GPU boundary frequently became saturated managing draw calls and dynamic level-of-detail (LOD) swaps.

### How Mesh Shaders Change the Equation
Mesh shaders replace the old fixed-function stages with a cooperative thread group model reminiscent of compute shaders. By breaking geometry down into micro-meshes or "meshlets" (typically 64 vertices and 126 triangles):
- Geometry amplification happens entirely on the GPU.
- Early frustum, cone, and backface culling occur before vertices are even processed.
- Memory bandwidth consumption drops substantially in crowded open-world scenes.

### Looking Ahead to Future Architectures
As game developers standardize around these low-level paradigms, players can expect virtually pop-in-free vistas, photorealistic environmental clutter, and vastly improved frame pacing even in sprawling open-world titles.',
        '/images/articles/placeholder-tech.svg',
        'Futuristic technical blueprint illustrating digital mesh shading and GPU computing nodes',
        cat_news, auth_elena,
        'Next-Gen Graphics Pipelines: How Mesh Shading Transforms Rendering',
        'Editorial deep-dive exploring how modern GPU mesh shading pipelines optimize geometry culling and dynamic LODs in open-world games.',
        ARRAY['Tech Analysis', 'Graphics', 'PC Gaming', 'Unreal Engine'],
        'published', true, '2026-10-28 14:30:00+00'
    ),
    (
        'Balancing Competitive Frame Rates: Optimal BIOS and Windows Tweaks for PC Gaming',
        'optimizing-pc-gaming-frame-times-latency',
        'Explore essential operating system settings, frame-time stabilization techniques, and memory timings that reduce input latency.',
        'Achieving peak competitive responsiveness in fast-paced shooters requires more than just raw FPS; frame time consistency and click-to-photon latency are far more crucial.

### 1. Understanding 1% Lows vs Average Framerates
A title reporting 240 average FPS can feel stuttery if 1% low metrics dip below 80 FPS. Micro-stutters during intense firefights usually stem from background thread contention or memory latency spikes.

### 2. Operating System Optimizations
- Hardware-Accelerated GPU Scheduling (HAGS): Offloads high-frequency scheduling tasks directly to modern GPU memory controllers.
- Timer Resolution & Power Profiles: Ensuring stable power delivery curves prevents clock ramping delays during sudden gameplay shifts.
- Exclusive Fullscreen Mode: Bypasses compositing layers to deliver frames directly to the display scanout.

### 3. Clean Driver Installations
Keeping background telemetry and overlay services to an absolute minimum remains one of the most reliable ways to sustain rock-solid frame times across demanding titles.',
        '/images/articles/placeholder-pc.svg',
        'Modern dark gaming PC rig interior with subtle violet illumination',
        cat_pc, auth_marcus,
        'Optimizing PC Gaming Latency: BIOS and Windows Frame-Time Tweaks',
        'Comprehensive guide to stabilizing 1% low framerates and minimizing system latency on PC gaming rigs.',
        ARRAY['PC Gaming', 'Optimization', 'Hardware', 'Latency'],
        'published', false, '2026-10-27 11:00:00+00'
    ),
    (
        'The Handheld Renaissance: Analyzing the Evolution of Mobile Silicon in Modern Gaming',
        'handheld-renaissance-mobile-silicon-gaming',
        'From custom ARM chipsets to integrated thermal solutions, discover how pocket devices run full-scale console quality games.',
        'Mobile gaming has grown beyond casual puzzle titles into a powerhouse ecosystem hosting console-caliber titles on pocket hardware.

### Architectural Leaps in Mobile APUs
Recent 3nm process nodes enable mobile chips to sustain sustained ray-tracing calculations and hardware-accelerated mesh shading under 8-watt thermal envelopes.

### Active Cooling vs Passive Throttling
While smartphones rely on vapor chambers, dedicated gaming handhelds introduce micro-fans and copper heatsinks that prevent thermal throttling during multi-hour raids.

### Cloud Synchronization and Cross-Progression
With seamless cloud saves and cross-play, gamers now experience unbroken continuity between their desktop workstations and commute devices.',
        '/images/articles/placeholder-mobile.svg',
        'Sleek dark handheld gaming device displaying responsive tactical controls',
        cat_mobile, auth_kaito,
        'The Handheld Gaming Renaissance: Mobile Silicon and APU Architecture',
        'Deep-dive into 3nm mobile APUs, vapor chamber thermal dissipation, and handheld console hardware design.',
        ARRAY['Mobile Gaming', 'Handhelds', 'Silicon', 'Hardware'],
        'published', false, '2026-10-26 16:45:00+00'
    ),
    (
        'Architectural Parity: How Current-Gen Consoles Shape Multiplatform Game Design',
        'current-gen-consoles-multiplatform-parity',
        'An investigation into unified storage APIs, hardware decompression blocks, and their influence on cross-platform development.',
        'The convergence of console hardware toward standard x86 architectures paired with dedicated hardware decompression chips has transformed multiplatform game engineering.

### DirectStorage and Fast Asset Streaming
Eliminating legacy loading screens is not just a quality-of-life perk; it fundamentally alters level design. Developers no longer need winding corridors or deliberate elevator rides to mask background disk reads.

### Scalable Ray-Tracing Budgets
Consoles have set the baseline target for global illumination and ambient occlusion. Understanding these constraints enables studios to scale graphics configurations effectively across tiers.',
        '/images/articles/placeholder-console.svg',
        'Next-gen gaming console controller resting on a minimalist dark obsidian desk',
        cat_console, auth_sarah,
        'Console Architectural Parity and Multiplatform Game Engineering',
        'How unified NVMe streaming pipelines and dedicated decompression blocks eliminate legacy level design constraints.',
        ARRAY['Console Gaming', 'PlayStation', 'Xbox', 'Game Design'],
        'published', false, '2026-10-25 13:20:00+00'
    ),
    (
        'Mastering Resource Economy in Tactical Survival Titles: A Comprehensive Guide',
        'tactical-survival-resource-economy-guide',
        'Learn inventory management algorithms, risk-to-reward pathing, and craft prioritization in unforgiving tactical survival titles.',
        'Survival in high-stakes tactical environments depends more on sound risk calculation and resource conservation than quick reflex shooting alone.

### Phase 1: High-Yield Scavenging Routes
Before entering contested sectors, survey extraction routes and prioritize perishable utility items over bulky low-tier salvage. Always leave minimum stamina reserves for evasive maneuvers.

### Phase 2: Weight and Stamina Budgeting
Every kilogram carried degrades movement acceleration and increases footstep audio signatures. Maintaining a light loadout ensures optimal positioning during spontaneous ambushes.

### Phase 3: Base Upgrades and Crafting Efficiency
Focus early materials on passive recovery stations and ammunition workbenches. Maximizing yield per component yields compounding survival advantages over lengthy campaigns.',
        '/images/articles/placeholder-guide.svg',
        'Detailed tactical map with waypoint markers and supply caches in dark blueprint styling',
        cat_guides, auth_david,
        'Mastering Resource Economy in Tactical Survival Games',
        'Tactical progression walkthrough focusing on inventory budgeting, extraction pathing, and craft prioritization.',
        ARRAY['Game Guides', 'Tactical', 'Survival', 'Walkthrough'],
        'published', false, '2026-10-24 18:00:00+00'
    ),
    (
        'Aethelgard Chronicles: Gameplay Analysis, Combat Rhythm, and World Building',
        'aethelgard-chronicles-critique-gameplay-analysis',
        'An editorial critique exploring whether the atmospheric open-world epic strikes the delicate balance between methodical combat and narrative pacing.',
        '*Editorial Note: This analysis reflects structured editorial critique and mechanics examination without fabricated commercial review scores.*

### Combat Mechanics & Stagger Systems
Aethelgard Chronicles introduces a hybrid poise meter that demands deliberate timing. Rather than rewarding button mashing, encounters reward patience, parry execution, and posture disruption.

### World Architecture and Visual Direction
The kingdom shattered gothic towers and subterranean aqueducts exhibit remarkable environmental storytelling. Lighting design leans into high dynamic range contrasts, with torchlight casting long, moody shadows across damp masonry.

### Soundscape and Spatial Audio
Footsteps echo realistically across vaulted stone corridors, providing critical directional cues during stealth segments. The orchestral score remains subdued, swelling only when monumental bosses enter the fray.',
        '/images/articles/placeholder-review.svg',
        'Atmospheric fantasy fortress illuminated by ethereal moonlight and twilight fog',
        cat_reviews, auth_elena,
        'Aethelgard Chronicles Review & Technical Analysis',
        'Editorial mechanics critique examining posture meters, HDR spatial lighting, and ambient world design.',
        ARRAY['Reviews', 'RPG', 'Game Critique', 'Action Adventure'],
        'published', false, '2026-10-23 15:10:00+00'
    )
    ON CONFLICT (slug) DO NOTHING;
END $$;


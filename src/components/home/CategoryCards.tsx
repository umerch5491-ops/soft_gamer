import Link from 'next/link';
import { Monitor, Smartphone, Gamepad2, Compass, Award, Newspaper } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { CategorySlug } from '@/types/article';

const CATEGORY_ICONS: Record<CategorySlug, React.ComponentType<{ className?: string }>> = {
  'gaming-news': Newspaper,
  'pc-gaming': Monitor,
  'mobile-gaming': Smartphone,
  'console-gaming': Gamepad2,
  'game-guides': Compass,
  'reviews': Award,
};

export function CategoryCards() {
  const categories = Object.values(CATEGORIES);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((cat) => {
        const Icon = CATEGORY_ICONS[cat.slug] || Newspaper;
        return (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="group relative bg-[#171C2B] border border-[#272B3A] rounded-xl p-5 hover:border-[#8B5CF6] transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(139,92,246,0.15)]"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${cat.badgeColor}15`, color: cat.badgeColor }}
            >
              <Icon className="w-6 h-6" />
            </div>

            <h3 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors mb-1">
              {cat.name}
            </h3>

            <span className="text-[11px] text-[#A1A1AA] line-clamp-1">
              Explore →
            </span>
          </Link>
        );
      })}
    </div>
  );
}


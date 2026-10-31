import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { Article } from '@/types/article';
import { formatDate } from '@/lib/constants';

interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <section className="relative rounded-2xl overflow-hidden bg-[#111522] border border-[#272B3A] p-4 sm:p-6 lg:p-8 hover:border-[#8B5CF6]/50 transition-all duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Large Media */}
        <div className="lg:col-span-7 relative aspect-video rounded-xl overflow-hidden bg-[#090B12]">
          <Image
            src={article.featuredImage}
            alt={article.imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md bg-[#8B5CF6] text-[#F8FAFC] shadow-lg shadow-[#8B5CF6]/30">
              Featured Story
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-xs text-[#A1A1AA] mb-3">
            <span className="px-2.5 py-0.5 rounded bg-[#171C2B] text-[#38BDF8] border border-[#272B3A] font-medium">
              {article.categoryName}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
              {formatDate(article.publishedAt)}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
              {article.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F8FAFC] leading-tight mb-4 hover:text-[#38BDF8] transition-colors">
            <Link href={`/articles/${article.slug}`}>
              {article.title}
            </Link>
          </h1>

          <p className="text-[#A1A1AA] text-sm sm:text-base leading-relaxed mb-6">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-[#272B3A]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#171C2B] border border-[#272B3A] flex items-center justify-center text-[#8B5CF6]">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#F8FAFC]">{article.author.name}</p>
                <p className="text-[11px] text-[#A1A1AA]">{article.author.role}</p>
              </div>
            </div>

            <Link
              href={`/articles/${article.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B5CF6] text-[#F8FAFC] font-semibold text-xs sm:text-sm hover:bg-[#7c3aed] transition-colors group shadow-md shadow-[#8B5CF6]/20"
            >
              <span>Read Article</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


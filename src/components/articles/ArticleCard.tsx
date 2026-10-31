import Link from 'next/link';
import Image from 'next/image';
import { Clock, Calendar, User } from 'lucide-react';
import { Article } from '@/types/article';
import { formatDate } from '@/lib/constants';

interface ArticleCardProps {
  article: Article;
  priority?: boolean;
}

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  return (
    <article className="group bg-[#171C2B] border border-[#272B3A] rounded-xl overflow-hidden hover:border-[#8B5CF6]/50 transition-all duration-300 flex flex-col h-full hover:shadow-[0_4px_20px_rgba(139,92,246,0.12)]">
      {/* Featured Thumbnail */}
      <Link href={`/articles/${article.slug}`} className="relative block aspect-video overflow-hidden bg-[#111522]">
        <Image
          src={article.featuredImage}
          alt={article.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#090B12]/85 text-[#F8FAFC] border border-[#272B3A] backdrop-blur-xs">
            {article.categoryName}
          </span>
        </div>
      </Link>

      {/* Content Meta & Body */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Date and Read Time */}
        <div className="flex items-center gap-3 text-xs text-[#A1A1AA] mb-2.5">
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

        {/* Title */}
        <h3 className="text-lg font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors line-clamp-2 mb-2 leading-snug">
          <Link href={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-[#A1A1AA] line-clamp-2 mb-4 leading-relaxed flex-grow">
          {article.excerpt}
        </p>

        {/* Author Footer */}
        <div className="pt-3 border-t border-[#272B3A] flex items-center justify-between text-xs text-[#A1A1AA]">
          <span className="inline-flex items-center gap-1.5 font-medium text-[#F8FAFC]">
            <User className="w-3.5 h-3.5 text-[#8B5CF6]" />
            {article.author.name}
          </span>
          <Link
            href={`/articles/${article.slug}`}
            className="text-[#38BDF8] hover:text-[#8B5CF6] font-semibold transition-colors flex items-center gap-1"
          >
            Read <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}


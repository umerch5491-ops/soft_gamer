import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs md:text-sm text-[#A1A1AA]">
        <li>
          <Link href="/" className="hover:text-[#F8FAFC] transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-[#272B3A]" />
              {isLast || !item.href ? (
                <span className="text-[#F8FAFC] font-medium truncate max-w-[200px] md:max-w-md">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-[#F8FAFC] transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}


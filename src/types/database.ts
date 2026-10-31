export type ArticleStatus = 'draft' | 'published' | 'scheduled';

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at?: string;
}

export interface DbAuthor {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  avatar?: string;
  created_at?: string;
}

export interface DbArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  image_alt: string;
  category_id: string;
  author_id: string;
  seo_title?: string | null;
  meta_description?: string | null;
  tags: string[];
  status: ArticleStatus;
  featured: boolean;
  published_at: string;
  updated_at?: string | null;
  created_at?: string;
  // Joined relation fields
  category?: DbCategory | null;
  author?: DbAuthor | null;
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: DbCategory;
        Insert: Omit<DbCategory, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<DbCategory, 'id'>>;
        Relationships: [];
      };
      authors: {
        Row: DbAuthor;
        Insert: Omit<DbAuthor, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<DbAuthor, 'id'>>;
        Relationships: [];
      };
      articles: {
        Row: DbArticle;
        Insert: Omit<DbArticle, 'id' | 'created_at' | 'category' | 'author'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<DbArticle, 'id' | 'category' | 'author'>>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}


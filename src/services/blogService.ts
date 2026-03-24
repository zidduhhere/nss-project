import supabase from "@/services/supabase";
import { handleSupabaseError } from "@/services/errors";
import {
  PaginationParams,
  resolvePagination,
  buildPaginatedResult,
  PaginatedResult,
} from "@/services/pagination";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  author_name: string;
  category: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export const blogService = {
  getPublishedPosts: async (
    pagination?: PaginationParams
  ): Promise<PaginatedResult<BlogPost>> => {
    const { page, pageSize, from, to } = resolvePagination(pagination);

    const { data, error, count } = await supabase
      .from("blog_posts")
      .select("*", { count: "exact" })
      .eq("published", true)
      .order("published_at", { ascending: false })
      .range(from, to);

    if (error) handleSupabaseError(error, "Failed to fetch blog posts");
    return buildPaginatedResult(
      (data as BlogPost[]) || [],
      count ?? 0,
      page,
      pageSize
    );
  },

  getPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      handleSupabaseError(error, "Failed to fetch blog post");
    }
    return data as BlogPost;
  },

  getPostsByCategory: async (
    category: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<BlogPost>> => {
    const { page, pageSize, from, to } = resolvePagination(pagination);

    const { data, error, count } = await supabase
      .from("blog_posts")
      .select("*", { count: "exact" })
      .eq("published", true)
      .eq("category", category)
      .order("published_at", { ascending: false })
      .range(from, to);

    if (error) handleSupabaseError(error, "Failed to fetch blog posts");
    return buildPaginatedResult(
      (data as BlogPost[]) || [],
      count ?? 0,
      page,
      pageSize
    );
  },

  getCategories: async (): Promise<string[]> => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("category")
      .eq("published", true);

    if (error) handleSupabaseError(error, "Failed to fetch categories");

    const categories = Array.from(
      new Set(data?.map((d) => d.category).filter(Boolean))
    ) as string[];
    return categories.sort();
  },
};

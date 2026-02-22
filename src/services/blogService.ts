import supabase from "@/services/supabase";

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

/**
 * Blog Service - Handles fetching blog posts from Supabase
 */
export const blogService = {
  /**
   * Get all published blog posts, ordered by published date
   */
  getPublishedPosts: async (): Promise<BlogPost[]> => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;

      return (data as BlogPost[]) || [];
    } catch (error: any) {
      console.error("Error fetching blog posts:", error);
      throw new Error(error.message || "Failed to fetch blog posts");
    }
  },

  /**
   * Get a single blog post by slug
   */
  getPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null; // Not found
        throw error;
      }

      return data as BlogPost;
    } catch (error: any) {
      console.error("Error fetching blog post:", error);
      throw new Error(error.message || "Failed to fetch blog post");
    }
  },

  /**
   * Get blog posts by category
   */
  getPostsByCategory: async (category: string): Promise<BlogPost[]> => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .eq("category", category)
        .order("published_at", { ascending: false });

      if (error) throw error;

      return (data as BlogPost[]) || [];
    } catch (error: any) {
      console.error("Error fetching blog posts by category:", error);
      throw new Error(error.message || "Failed to fetch blog posts");
    }
  },

  /**
   * Get unique categories from published posts
   */
  getCategories: async (): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("category")
        .eq("published", true);

      if (error) throw error;

      const categories = Array.from(
        new Set(data?.map((d) => d.category).filter(Boolean))
      ) as string[];
      return categories.sort();
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      throw new Error(error.message || "Failed to fetch categories");
    }
  },
};

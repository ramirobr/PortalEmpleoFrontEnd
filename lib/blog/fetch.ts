import { fetchApi } from "@/lib/apiClient";
import { Blog, BlogResponse, BlogResumen, BlogsResponse } from "@/types/blog";

export async function getPublicBlogs(): Promise<BlogResumen[] | null> {
  const res = await fetchApi<BlogsResponse>("/Blog/public");
  return res?.data ?? null;
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const res = await fetchApi<BlogResponse>(`/Blog/public/${slug}`);
  return res?.data ?? null;
}

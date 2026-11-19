import { supabase } from "./supabase";

export const BLOG_IMAGE_BUCKET = "blog-images";
export const BLOG_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const BLOG_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function fetchPublishedBlogPosts() {
  if (!supabase) return { data: [], error: new Error("Blog service is not configured.") };
  return supabase.from("blog_posts").select("id,title,slug,excerpt,content,featured_image_url,author,category,tags,seo_title,seo_description,status,published_at,created_at,updated_at").eq("status", "published").order("published_at", { ascending: false });
}

export async function fetchPublishedBlogPost(slug) {
  if (!supabase) return { data: null, error: new Error("Blog service is not configured.") };
  return supabase.from("blog_posts").select("id,title,slug,excerpt,content,featured_image_url,author,category,tags,seo_title,seo_description,status,published_at,created_at,updated_at").eq("slug", slug).eq("status", "published").maybeSingle();
}

export async function fetchAdminBlogPosts() {
  if (!supabase) return { data: [], error: new Error("Blog service is not configured.") };
  return supabase.from("blog_posts").select("*").order("updated_at", { ascending: false });
}

export async function saveBlogPost(post, existingPost) {
  if (!supabase) return { data: null, error: new Error("Blog service is not configured.") };
  const publishedAt = post.status === "published" ? (existingPost?.published_at || new Date().toISOString()) : null;
  const values = { ...post, published_at: publishedAt, updated_at: new Date().toISOString() };
  const request = existingPost
    ? supabase.from("blog_posts").update(values).eq("id", existingPost.id).select().single()
    : supabase.from("blog_posts").insert(values).select().single();
  return request;
}

export async function deleteBlogPost(id) {
  if (!supabase) return { error: new Error("Blog service is not configured.") };
  return supabase.from("blog_posts").delete().eq("id", id);
}

export async function uploadBlogImage(file) {
  if (!supabase) throw new Error("Blog service is not configured.");
  if (!BLOG_IMAGE_TYPES.includes(file.type)) throw new Error("Choose a JPG, PNG, WebP or GIF image.");
  if (file.size > BLOG_IMAGE_MAX_BYTES) throw new Error("Images must be 5 MB or smaller.");
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-").replace(/^-+|-+$/g, "");
  const path = `${crypto.randomUUID()}-${safeName || "featured-image"}`;
  const { error } = await supabase.storage.from(BLOG_IMAGE_BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return supabase.storage.from(BLOG_IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

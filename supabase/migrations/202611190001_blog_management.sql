-- Blog content is managed through the existing Adsrow admin grant.
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  featured_image_url text,
  author text not null default 'Adsrow Team',
  category text not null default 'General',
  tags text[] not null default '{}',
  seo_title text,
  seo_description text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_order_idx
  on public.blog_posts (published_at desc) where status = 'published';

alter table public.blog_posts enable row level security;
revoke all on public.blog_posts from anon, authenticated;
grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;

drop policy if exists "Public can read published blog posts" on public.blog_posts;
create policy "Public can read published blog posts"
  on public.blog_posts for select to anon, authenticated
  using (status = 'published');

drop policy if exists "Admins can read all blog posts" on public.blog_posts;
create policy "Admins can read all blog posts"
  on public.blog_posts for select to authenticated
  using (public.is_current_user_admin());

drop policy if exists "Admins can create blog posts" on public.blog_posts;
create policy "Admins can create blog posts"
  on public.blog_posts for insert to authenticated
  with check (public.is_current_user_admin());

drop policy if exists "Admins can update blog posts" on public.blog_posts;
create policy "Admins can update blog posts"
  on public.blog_posts for update to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

drop policy if exists "Admins can delete blog posts" on public.blog_posts;
create policy "Admins can delete blog posts"
  on public.blog_posts for delete to authenticated
  using (public.is_current_user_admin());

-- Reuse an existing bucket with this name if present; otherwise create it.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-images', 'blog-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view blog images" on storage.objects;
create policy "Public can view blog images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'blog-images');

drop policy if exists "Admins can upload blog images" on storage.objects;
create policy "Admins can upload blog images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'blog-images' and public.is_current_user_admin());

drop policy if exists "Admins can update blog images" on storage.objects;
create policy "Admins can update blog images"
  on storage.objects for update to authenticated
  using (bucket_id = 'blog-images' and public.is_current_user_admin())
  with check (bucket_id = 'blog-images' and public.is_current_user_admin());

drop policy if exists "Admins can delete blog images" on storage.objects;
create policy "Admins can delete blog images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'blog-images' and public.is_current_user_admin());

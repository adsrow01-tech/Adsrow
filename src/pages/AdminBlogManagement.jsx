import { useEffect, useMemo, useState } from "react";
import { ImagePlus, Plus, RefreshCw, Trash2 } from "lucide-react";
import { deleteBlogPost, fetchAdminBlogPosts, saveBlogPost, uploadBlogImage } from "../lib/blog";

const EMPTY_POST = { title: "", slug: "", excerpt: "", content: "", featured_image_url: "", author: "Adsrow Team", category: "General", tags: [], seo_title: "", seo_description: "", status: "draft" };
const slugify = (value) => value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const errorText = (error) => /duplicate key|already exists/i.test(error?.message || "") ? "That URL slug is already in use. Choose another slug." : error?.message || "The blog post could not be saved. Please try again.";

export default function AdminBlogManagement({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_POST);
  const [slugEdited, setSlugEdited] = useState(false);
  const [busy, setBusy] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function reload() {
    setLoading(true);
    const result = await fetchAdminBlogPosts();
    setPosts(result.data || []);
    setLoadError(result.error ? "Blog posts could not be loaded. Apply the blog management migration, then retry." : "");
    setLoading(false);
  }
  useEffect(() => { void reload(); }, []);

  const visiblePosts = useMemo(() => filter === "all" ? posts : posts.filter((post) => post.status === filter), [filter, posts]);
  function startNew() {
    setEditingId(null); setForm({ ...EMPTY_POST, author: user?.user_metadata?.full_name || "Adsrow Team" });
    setSlugEdited(false); setMessage(""); setError("");
  }
  function editPost(post) {
    setEditingId(post.id); setForm({ ...EMPTY_POST, ...post, featured_image_url: post.featured_image_url || "", tags: post.tags || [] });
    setSlugEdited(true); setMessage(""); setError("");
  }
  function changeField(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "title" && !slugEdited) next.slug = slugify(value);
      return next;
    });
  }

  async function persist(status = form.status) {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      setError("Add a title, URL slug and main content before saving."); return;
    }
    setBusy(true); setError(""); setMessage("");
    const existingPost = posts.find((post) => post.id === editingId);
    const payload = {
      title: form.title.trim(), slug: slugify(form.slug), excerpt: form.excerpt.trim(), content: form.content.trim(),
      featured_image_url: form.featured_image_url.trim() || null, author: form.author.trim() || "Adsrow Team",
      category: form.category.trim() || "General", tags: Array.isArray(form.tags) ? form.tags : form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      seo_title: form.seo_title.trim() || null, seo_description: form.seo_description.trim() || null, status,
    };
    const result = await saveBlogPost(payload, existingPost);
    setBusy(false);
    if (result.error) { setError(errorText(result.error)); return; }
    setEditingId(result.data.id); setForm({ ...EMPTY_POST, ...result.data, featured_image_url: result.data.featured_image_url || "", tags: result.data.tags || [] });
    setSlugEdited(true); setMessage(status === "published" ? "Post published." : "Draft saved.");
    await reload();
  }

  async function onSubmit(event) {
    event.preventDefault();
    const intent = event.nativeEvent.submitter?.value;
    await persist(intent === "draft" ? "draft" : intent === "published" ? "published" : form.status);
  }
  async function unpublish() { await persist("draft"); }
  async function removePost(post = posts.find((item) => item.id === editingId)) {
    if (!post || !window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    setBusy(true); setError("");
    const result = await deleteBlogPost(post.id);
    setBusy(false);
    if (result.error) { setError(errorText(result.error)); return; }
    if (post.id === editingId) startNew();
    setMessage("Post deleted."); await reload();
  }
  async function handleImage(event) {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    setImageBusy(true); setError("");
    try { changeField("featured_image_url", await uploadBlogImage(file)); }
    catch (uploadError) { setError(errorText(uploadError)); }
    finally { setImageBusy(false); }
  }

  return <section className="admin-blog">
    <div className="admin-page-head"><div><h1>Blog Management</h1><p>Create and manage published Adsrow articles.</p></div><button className="button admin-refresh" type="button" onClick={startNew}><Plus size={16} /> New post</button></div>
    {loadError && <div className="admin-alert" role="alert"><div><strong>Blog storage is not ready.</strong><p>{loadError}</p></div><button type="button" className="button admin-refresh" onClick={reload}>Retry <RefreshCw size={15} /></button></div>}
    <div className="admin-blog-tabs" role="group" aria-label="Filter blog posts">
      {[['all', 'All posts'], ['published', 'Published'], ['draft', 'Drafts']].map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{label} <span>{value === "all" ? posts.length : posts.filter((post) => post.status === value).length}</span></button>)}
    </div>
    <div className="admin-blog-layout">
      <div className="admin-blog-list">
        {loading ? <div className="admin-empty">Loading posts…</div> : visiblePosts.length ? visiblePosts.map((post) => <article className="admin-blog-row" key={post.id}>
          {post.featured_image_url ? <img src={post.featured_image_url} alt="" /> : <div className="admin-blog-thumb">BLOG</div>}
          <div className="admin-blog-row-copy"><strong>{post.title}</strong><span>/{post.slug}</span><small>{post.category} · {post.author}</small></div>
          <span className={`admin-blog-status admin-blog-status-${post.status}`}>{post.status}</span>
          <button type="button" className="admin-link" onClick={() => editPost(post)}>Edit</button>
          <button type="button" className="admin-link admin-blog-delete" onClick={() => removePost(post)} aria-label={`Delete ${post.title}`}><Trash2 size={16} /></button>
        </article>) : <div className="admin-empty"><strong>No {filter === "all" ? "posts" : filter + " posts"} yet</strong><p>Use “New post” to start writing.</p></div>}
      </div>

      <form className="admin-panel admin-blog-editor" onSubmit={onSubmit}>
        <div className="admin-blog-editor-head"><div><h2>{editingId ? "Edit post" : "Create post"}</h2><p>Write, preview and publish an article.</p></div>{editingId && <button className="admin-link admin-blog-delete" type="button" disabled={busy} onClick={() => removePost()}><Trash2 size={15} /> Delete</button>}</div>
        <label>Blog title<input required maxLength={180} value={form.title} onChange={(event) => changeField("title", event.target.value)} /></label>
        <label>URL slug<div className="admin-blog-slug"><span>/blog/</span><input required maxLength={180} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={(event) => { setSlugEdited(true); changeField("slug", event.target.value); }} /></div></label>
        <label>Short description / excerpt<textarea rows={2} maxLength={320} value={form.excerpt} onChange={(event) => changeField("excerpt", event.target.value)} /></label>
        <label>Main blog content<textarea required rows={12} value={form.content} onChange={(event) => changeField("content", event.target.value)} placeholder="Write your article. Paragraphs and line breaks are preserved." /></label>
        <div className="admin-blog-image-field"><label>Featured image<input type="url" value={form.featured_image_url} onChange={(event) => changeField("featured_image_url", event.target.value)} placeholder="Upload or paste an image URL" /></label><label className="admin-blog-upload"><ImagePlus size={16} />{imageBusy ? "Uploading…" : "Upload image"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImage} disabled={imageBusy || busy} /></label></div>
        {form.featured_image_url && <img className="admin-blog-preview" src={form.featured_image_url} alt="Featured image preview" />}
        <div className="admin-blog-fields-two"><label>Author name<input maxLength={120} value={form.author} onChange={(event) => changeField("author", event.target.value)} /></label><label>Category<input maxLength={80} value={form.category} onChange={(event) => changeField("category", event.target.value)} /></label></div>
        <label>Tags <small>Separate tags with commas</small><input value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags} onChange={(event) => changeField("tags", event.target.value)} /></label>
        <label>SEO title<input maxLength={180} value={form.seo_title || ""} onChange={(event) => changeField("seo_title", event.target.value)} /></label>
        <label>SEO description<textarea rows={2} maxLength={320} value={form.seo_description || ""} onChange={(event) => changeField("seo_description", event.target.value)} /></label>
        <label>Publication status<select value={form.status} onChange={(event) => changeField("status", event.target.value)}><option value="draft">Draft</option><option value="published">Published</option></select></label>
        {error && <p className="form-status form-error" role="alert">{error}</p>}{message && <p className="form-status form-success" role="status">{message}</p>}
        <div className="admin-blog-actions"><button className="button admin-refresh" type="submit" value="draft" disabled={busy || imageBusy}>{busy ? "Saving…" : "Save Draft"}</button><button className="button" type="submit" value={form.status === "published" ? "current" : "published"} disabled={busy || imageBusy}>{form.status === "published" ? "Update" : "Publish"}</button>{editingId && form.status === "published" && <button className="admin-sort" type="button" onClick={unpublish} disabled={busy || imageBusy}>Unpublish</button>}</div>
        <small className="admin-blog-saved-by">Signed in as {user?.email}. Supabase verifies administrator access for every change.</small>
      </form>
    </div>
  </section>;
}

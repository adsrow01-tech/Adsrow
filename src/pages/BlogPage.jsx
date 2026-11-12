import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Search } from "lucide-react";

const articles = [
  { slug: "99-a-day-what-to-expect", category: "guides", label: "Guides", title: "₹99 a day: what a local business can really expect", excerpt: "Plays, reach and results from the Try It plan, explained simply.", visual: "₹99", tone: "blue", read: "4 min read" },
  { slug: "screen-ad-design-tips", category: "design", label: "Ad design", title: "5 rules for a 10-second screen ad that gets QR scans", excerpt: "One message, one offer, one action. How to design for a quick glance.", image: "/venues/cafe-display.jpg", alt: "Adsrow screen in a café", read: "5 min read" },
  { slug: "restaurants-dinner-decision", category: "local", label: "Local marketing", title: "Restaurants: how to win the \"what's for dinner?\" decision", excerpt: "Why apartment lift lobbies at 5–9 PM beat a billboard on the highway.", visual: "7 PM", tone: "orange", read: "4 min read" },
  { slug: "proof-of-play-explained", category: "results", label: "Results", title: "Proof of play, explained: how you know your ad really ran", excerpt: "What's in your report, and how QR scans and call tracking show results.", visual: "✓", tone: "green", read: "3 min read" },
  { slug: "choose-audience-pack", category: "guides", label: "Guides", title: "Neighbourhood, Dine-Out or Fitness? Choosing the right pack", excerpt: "Match your business to the audience most likely to buy from you.", image: "/venues/gym-display.jpg", alt: "Adsrow screen in a gym", read: "5 min read" },
  { slug: "host-a-screen-guide", category: "venues", label: "For venue partners", title: "Hosting a screen: a simple guide for RWAs and café owners", excerpt: "Installation, notices, content checks and what your committee should ask.", visual: "RWA", tone: "purple", read: "6 min read" },
];

const categories = [["all", "All"], ["guides", "Guides"], ["design", "Ad design"], ["local", "Local marketing"], ["results", "Results"], ["venues", "For venue partners"]];

function usePageMeta(title, description, path) {
  useEffect(() => {
    document.title = title;
    const setMeta = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let node = document.querySelector(selector);
      if (!node) { node = document.createElement("meta"); property ? node.setAttribute("property", name) : node.name = name; document.head.appendChild(node); }
      node.content = content;
    };
    setMeta("description", description);
    setMeta("robots", "index, follow");
    setMeta("og:title", title, true); setMeta("og:description", description, true); setMeta("og:type", "website", true); setMeta("og:url", `https://adsrow.com${path}`, true);
    setMeta("twitter:card", "summary_large_image"); setMeta("twitter:title", title); setMeta("twitter:description", description);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = `https://adsrow.com${path}`;
    return () => { document.title = "Adsrow | Local Digital Advertising"; };
  }, [title, description, path]);
}

function ArticleVisual({ article, featured = false }) {
  if (article.image) return <div className="blog-visual"><img src={article.image} alt={article.alt} width={featured ? 720 : 480} height={featured ? 405 : 270} loading={featured ? "eager" : "lazy"} /></div>;
  return <div className={`blog-visual blog-visual-${article.tone || "blue"}`} aria-hidden="true">{article.visual}</div>;
}

function ArticleCard({ article }) {
  return <article className="blog-card"><ArticleVisual article={article} /><div className="blog-card-body"><span className="blog-cat">{article.label}</span><h3>{article.title}</h3><p>{article.excerpt}</p><div className="blog-meta"><span>Adsrow Team</span><i /><span>Publication pending</span><i /><span>{article.read}</span></div></div></article>;
}

export function BlogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  usePageMeta("Blog | Adsrow · Local Advertising Ideas for Vijayawada Businesses", "Guides, ideas and local marketing tips for Vijayawada businesses from the Adsrow team.", "/blog");
  const filtered = useMemo(() => articles.filter((article) => (category === "all" || article.category === category) && (!query.trim() || `${article.title} ${article.excerpt} ${article.label}`.toLowerCase().includes(query.trim().toLowerCase()))), [category, query]);
  return <main className="blog-page">
    <section className="blog-hero"><div className="container"><div className="blog-hero-grid"><div><p className="eyebrow">The Adsrow blog</p><h1>Ideas to get your business <span>noticed locally.</span></h1><p className="blog-lead">Practical guides on screen advertising, ad design and reaching customers in Vijayawada, from the Adsrow team.</p></div><label className="blog-search"><Search size={20} aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search articles, e.g. QR codes" aria-label="Search articles" /></label></div><div className="blog-chips" role="group" aria-label="Filter by category">{categories.map(([value, label]) => <button type="button" key={value} aria-pressed={category === value} onClick={() => setCategory(value)}>{label}</button>)}</div></div></section>
    <section className="blog-featured"><div className="container"><article className="blog-feature-card"><ArticleVisual article={{ image: "/venues/residential-lobby.jpg", alt: "Adsrow screen beside a residential lift" }} featured /><div className="blog-feature-copy"><span className="blog-cat">Featured · Publication pending</span><h2>How lift-lobby advertising works, and why people actually watch it</h2><p>Where the screens sit, how often your ad plays, who sees it and how you know it ran. The complete approved article will be published here when available.</p><div className="blog-meta"><span>Adsrow Team</span><i /><span>Publication pending</span><i /><span>6 min read</span></div></div></article></div></section>
    <section className="blog-main"><div className="container blog-layout"><div><div className="blog-grid-head"><h2>Latest articles</h2><span>{filtered.length} {filtered.length === 1 ? "article" : "articles"}</span></div><div className="blog-grid">{filtered.length ? filtered.map((article) => <ArticleCard key={article.slug} article={article} />) : <p className="blog-empty">No articles match that yet. Try another word or category.</p>}</div></div><aside className="blog-sidebar"><div className="blog-side-box"><h3>Most read</h3><ol><li>How lift-lobby advertising works</li><li>5 rules for a 10-second screen ad</li><li>₹99 a day: what to expect</li></ol><p className="blog-pending-note">Article links will appear after approved content is published.</p></div><div className="blog-side-box blog-side-cta"><span className="eyebrow">Ready to try?</span><p>Put your business on screens near your customers from</p><b>₹99/day</b><p>Free ad design on your first campaign.</p><Link className="button" to="/packages#try-it">See the Try It plan ↗</Link></div></aside></div></section>
    <section className="blog-newsletter"><div className="container"><div className="blog-newsletter-box"><div><p className="eyebrow">Monthly local marketing tips</p><h2>One useful idea a month. <span>No spam.</span></h2><p>Ad design tips, festive season plans and new venues in Vijayawada, straight to your inbox.</p></div><div><label htmlFor="blog-news-email">Email address</label><div className="blog-news-form"><input id="blog-news-email" type="email" placeholder="Your email address" /><button type="button" className="button" onClick={(event) => { event.currentTarget.parentElement.parentElement.querySelector(".blog-news-status").textContent = "Newsletter signup is not available yet."; }}>Subscribe</button></div><small className="blog-news-status">Unsubscribe anytime. We never share your email.</small></div></div></div></section>
  </main>;
}

export function BlogArticlePage() {
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === slug);
  const title = article?.title || "Adsrow article";
  usePageMeta(`${title} | Adsrow`, article?.excerpt || "Adsrow article pending publication.", `/blog/${slug || ""}`);
  return <main className="blog-article-page"><div className="container blog-article"><Link className="blog-back" to="/blog">← Back to Blog</Link><p className="eyebrow">{article?.label || "Adsrow blog"}</p><h1>{title}</h1>{article ? <><div className="blog-article-meta">Adsrow Team · Publication date pending</div><ArticleVisual article={article} featured /><div className="blog-article-pending"><h2>Article pending publication</h2><p>The complete approved article content is not available in the current project. This page is intentionally marked pending rather than presenting placeholder content as a finished article.</p><Link className="button" to="/contact">Talk to Adsrow</Link></div></> : <div className="blog-article-pending"><h2>Article not found</h2><p>This article is not available.</p><Link className="button" to="/blog">Return to Blog</Link></div>}</div></main>;
}

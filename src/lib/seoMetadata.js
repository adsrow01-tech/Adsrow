export const SITE_ORIGIN = "https://adsrow.com";

export const seoRoutes = {
  "/": {
    title: "Adsrow | Local Digital Advertising",
    description: "Adsrow helps businesses reach local audiences through digital advertising screens.",
    indexable: true,
  },
  "/about": {
    title: "About Adsrow | Local Digital Advertising",
    description: "Learn how Adsrow helps businesses reach local audiences through digital screens.",
    indexable: true,
  },
  "/network": {
    title: "Adsrow Network | Digital Advertising Screens",
    description: "Explore Adsrow digital advertising screens across local venues and communities.",
    indexable: true,
  },
  "/packages": {
    title: "Packages | Adsrow",
    description: "Explore Adsrow campaign packages and audience options.",
    indexable: true,
  },
  "/how-it-works": {
    title: "How It Works | Adsrow",
    description: "See how Adsrow campaigns work from planning to proof of play.",
    indexable: true,
  },
  "/why-adsrow": {
    title: "Why Adsrow | Local Digital Advertising",
    description: "See why businesses use Adsrow to reach nearby customers.",
    indexable: true,
  },
  "/faqs": {
    title: "FAQs | Adsrow",
    description: "Answers to common questions about Adsrow advertising campaigns and screens.",
    indexable: true,
  },
  "/blog": {
    title: "Blog | Adsrow · Local Advertising Ideas for Vijayawada Businesses",
    description: "Guides, ideas and local marketing tips for Vijayawada businesses from the Adsrow team.",
    // The current cards are explicitly marked publication pending and contain
    // no complete articles, so keep this listing out of search until ready.
    indexable: false,
    robots: "noindex, follow",
  },
  "/contact": {
    title: "Contact Adsrow",
    description: "Contact the Adsrow team about local digital advertising campaigns and venue partnerships.",
    indexable: true,
  },
  "/host-a-screen": {
    title: "Host a Screen | Adsrow",
    description: "Join the Adsrow venue network and host a digital advertising screen.",
    indexable: true,
  },
  "/terms": {
    title: "Terms of Service | Adsrow",
    description: "Adsrow Terms of Service draft for legal review.",
    indexable: false,
    robots: "noindex, nofollow",
  },
  "/privacy": {
    title: "Privacy Policy | Adsrow",
    description: "Adsrow Privacy Policy draft for legal review.",
    indexable: false,
    robots: "noindex, nofollow",
  },
  "/refund-policy": {
    title: "Refund and Cancellation Policy | Adsrow",
    description: "Adsrow Refund and Cancellation Policy draft for legal review.",
    indexable: false,
    robots: "noindex, nofollow",
  },
};

export const prerenderedSeoPaths = Object.keys(seoRoutes);

export function getSeoMetadata(pathname) {
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const knownRoute = seoRoutes[normalizedPath];
  if (knownRoute) {
    return {
      ...knownRoute,
      robots: knownRoute.robots || (knownRoute.indexable ? "index, follow" : "noindex, nofollow"),
      canonical: `${SITE_ORIGIN}${normalizedPath === "/" ? "/" : `${normalizedPath}/`}`,
    };
  }

  const privateTitles = {
    "/login": "Sign in | Adsrow",
    "/signup": "Create an account | Adsrow",
    "/forgot-password": "Reset your password | Adsrow",
    "/reset-password": "Choose a new password | Adsrow",
    "/dashboard": "Account dashboard | Adsrow",
    "/admin": "Adsrow Admin · Internal",
  };
  const isPendingArticle = normalizedPath.startsWith("/blog/");
  const isPrivateRoute = Boolean(privateTitles[normalizedPath]);
  return {
    title: privateTitles[normalizedPath] || (isPendingArticle ? "Article pending publication | Adsrow" : "Page not found | Adsrow"),
    description: isPendingArticle
      ? "This Adsrow article is pending publication."
      : isPrivateRoute
        ? "Sign in to or manage your Adsrow advertising account."
        : "The requested Adsrow page could not be found.",
    robots: "noindex, nofollow",
    canonical: null,
    indexable: false,
  };
}

export function getPageStructuredData(pathname) {
  const page = getSeoMetadata(pathname);
  if (!page.indexable) return null;
  const website = {
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    name: "Adsrow",
    url: `${SITE_ORIGIN}/`,
    inLanguage: "en-IN",
  };
  const webpage = {
    "@type": "WebPage",
    "@id": `${page.canonical}#webpage`,
    url: page.canonical,
    name: page.title,
    description: page.description,
    isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
    inLanguage: "en-IN",
  };
  return { "@context": "https://schema.org", "@graph": [website, webpage] };
}

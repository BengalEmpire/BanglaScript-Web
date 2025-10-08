import { ReactNode } from "react";
import { Metadata } from "next";

// Interface for props
interface PlaygroundLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

// Default metadata values
const DEFAULT_TITLE = "BanglaScript Playground – Write Bangla Code";
const DEFAULT_DESCRIPTION =
  "Interactive BanglaScript editor. Write Bangla code and see JavaScript transpiled to JS in real-time.";
const DEFAULT_KEYWORDS = "BanglaScript, Bangla programming, code editor, JavaScript transpiler, interactive coding, programming tool, Bangla code, Web code editor, web IDE, online coding, learn programming, coding practice, coding playground, BanglaScript playground, BanglaScript Variable and Function names, BanglaScript keywords, lists";
const DEFAULT_OG_IMAGE = "https://bangla-script.vercel.app/BanglaScript-Logo.png";
const DEFAULT_CANONICAL_URL = "https://bangla-script.vercel.app/playground";

export default function PlaygroundLayout({
  children,
  title,
  description,
  keywords,
  ogImage,
  canonicalUrl,
}: PlaygroundLayoutProps) {
  const metadata: Metadata = {
    title: title || DEFAULT_TITLE,
    description: description || DEFAULT_DESCRIPTION,
    keywords: keywords || DEFAULT_KEYWORDS,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    viewport: "width=device-width, initial-scale=1",
    openGraph: {
      title: title || DEFAULT_TITLE,
      description: description || DEFAULT_DESCRIPTION,
      url: canonicalUrl || DEFAULT_CANONICAL_URL,
      siteName: "BanglaScript",
      images: [
        {
          url: ogImage || DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "BanglaScript Playground",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title || DEFAULT_TITLE,
      description: description || DEFAULT_DESCRIPTION,
      images: [ogImage || DEFAULT_OG_IMAGE],
      site: "@BanglaScript",
    },
  };

  // Structured data for schema.org
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title || DEFAULT_TITLE,
    description: description || DEFAULT_DESCRIPTION,
    url: canonicalUrl || DEFAULT_CANONICAL_URL,
    image: ogImage || DEFAULT_OG_IMAGE,
    publisher: {
      "@type": "Organization",
      name: "BanglaScript",
      logo: {
        "@type": "ImageObject",
        url: "https://bangla-script.vercel.app/BanglaScript-Logo.png",
      },
    },
  };

  return (
    <html>
      <head>
        {/* Core Metadata */}
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Mahmud Rahman" />

        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl || DEFAULT_CANONICAL_URL} />

        {/* Open Graph */}
        <meta property="og:title" content={metadata.openGraph?.title} />
        <meta property="og:description" content={metadata.openGraph?.description} />
        <meta property="og:type" content={metadata.openGraph?.type} />
        <meta property="og:url" content={metadata.openGraph?.url} />
        <meta property="og:site_name" content={metadata.openGraph?.siteName} />
        <meta property="og:image" content={metadata.openGraph?.images?.[0]?.url} />
        <meta property="og:image:width" content={metadata.openGraph?.images?.[0]?.width?.toString()} />
        <meta property="og:image:height" content={metadata.openGraph?.images?.[0]?.height?.toString()} />
        <meta property="og:image:alt" content={metadata.openGraph?.images?.[0]?.alt} />
        <meta property="og:locale" content={metadata.openGraph?.locale} />

        {/* Twitter Card */}
        <meta name="twitter:card" content={metadata.twitter?.card} />
        <meta name="twitter:title" content={metadata.twitter?.title} />
        <meta name="twitter:description" content={metadata.twitter?.description} />
        <meta name="twitter:image" content={metadata.twitter?.images?.[0]} />
        <meta name="twitter:site" content={metadata.twitter?.site} />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
import { ReactNode } from "react";
import { Metadata } from "next";

interface PlaygroundLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  ogImage?: string;
}

// Default metadata values
const DEFAULT_TITLE = "BanglaScript Playground – Write Bangla Code";
const DEFAULT_DESCRIPTION =
  "Interactive BanglaScript editor. Write Bangla code and see JavaScript transpiled to JS in real-time.";
const DEFAULT_OG_IMAGE = "https://bangla-script.vercel.app/BanglaScript-Logo.png";

export default function PlaygroundLayout({
  children,
  title,
  description,
  ogImage,
}: PlaygroundLayoutProps) {
  const metadata: Metadata = {
    title: title || DEFAULT_TITLE,
    description: description || DEFAULT_DESCRIPTION,
    openGraph: {
      title: title || DEFAULT_TITLE,
      description: description || DEFAULT_DESCRIPTION,
      url: "https://bangla-script.vercel.app/playground",
      images: [
        {
          url: ogImage || DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title || DEFAULT_TITLE,
      description: description || DEFAULT_DESCRIPTION,
      images: [ogImage || DEFAULT_OG_IMAGE],
    },
  };

  return (
    <>
      {/* If you want traditional <head> fallback */}
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        {/* Open Graph */}
        <meta property="og:title" content={metadata.openGraph?.title} />
        <meta
          property="og:description"
          content={metadata.openGraph?.description}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={metadata.openGraph?.url || ""}
        />
        <meta
          property="og:image"
          content={metadata.openGraph?.images?.[0]?.url || ""}
        />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.twitter?.title} />
        <meta
          name="twitter:description"
          content={metadata.twitter?.description}
        />
        <meta name="twitter:image" content={metadata.twitter?.images?.[0]} />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <main>{children}</main>
    </>
  );
}

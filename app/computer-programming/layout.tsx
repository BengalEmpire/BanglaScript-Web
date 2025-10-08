import type { Metadata, Viewport } from 'next';

// Dynamic metadata function for SEO
export async function generateMetadata({ params, searchParams }: { params: { slug?: string[] }; searchParams: { [key: string]: string | string[] | undefined } }): Promise<Metadata> {
  // Default metadata
  const title = 'কম্পিউটার এবং প্রোগ্রামিং সহজভাবে বাংলায় | শিক্ষামূলক ওয়েবসাইট';
  const description = 'সহজভাবে বাংলায় কম্পিউটার, প্রোগ্রামিং, JavaScript, Node.js এবং BanglaScript সম্পর্কে জানুন। ছোট বড় সবাই বুঝতে পারবে।';
  const keywords = 'কম্পিউটার, প্রোগ্রামিং, JavaScript, Node.js, BanglaScript, বাংলা প্রোগ্রামিং, শিক্ষা';
  const url = 'https://bangla-script.vercel.app'; // Base URL
  const canonical = 'https://bangla-script.vercel.app/computer-programming';
  const image = `${url}/BanglaScript-Logo.png`;

  if (params.slug?.includes('computer-programming')) {
    return {
      title: 'কম্পিউটার এবং প্রোগ্রামিং সহজভাবে বাংলায়',
      description: 'কম্পিউটার কীভাবে কাজ করে, প্রোগ্রামিং ভাষা, JavaScript, Node.js এবং BanglaScript-এর সহজ বাংলা ব্যাখ্যা।',
      keywords: 'BanglaScript, BJS, JavaScript বাংলায়, প্রোগ্রামিং শেখা, কম্পিউটার শিক্ষা ',
    };
  }

  return {
    title,
    description,
    keywords,
    // Basic SEO
    authors: [{ name: 'Mahmud Rahman', url: 'https://gravatar.com/floawd' }],
    creator: 'Mahmud Rahman',
    publisher: 'https://gravatar.com/floawd',
    formatDetection: { email: false, address: false, telephone: false },
    metadataBase: new URL(url),
    alternates: {
      canonical,
    },
    // Open Graph for social sharing
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'কম্পিউটার শিক্ষা | Computer Education | BanglaScript',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: 'কম্পিউটার এবং প্রোগ্রামিং',
        },
      ],
      locale: 'bn_BD',
      type: 'website',
    },
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@mahmud_r_farhan',
    },
    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Viewport for responsive design
export const viewport: Viewport = {
  themeColor: '#3b82f6', // Blue theme
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Root layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="scroll-smooth"> 
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "কম্পিউটার শিক্ষা",
              "url": 'https://bangla-script.vercel.app/',
              "logo": `https://bangla-script.vercel.app/logo.png`,
              "description": "বাংলায় কম্পিউটার এবং প্রোগ্রামিং শিক্ষা প্রদানকারী ওয়েবসাইট। সহজ ভাষায় টিউটোরিয়াল এবং গাইড। বাংলাস্ক্রিপ্টের অফিসিয়াল সাইট",
              "sameAs": [
                "https://twitter.com/mahmud_r_farhan",
                "https://facebook.com/SafeZone73",
              ],
            }),
          }}
        />
        
        {/* Additional head tags if needed */}
        <link rel="canonical" href="https://bangla-script.vercel.app"/>
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={`antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        {/* Main content wrapper */}
        <div>
          {children}
        </div>
      </body>
    </html>
  );
}
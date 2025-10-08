import type { Metadata } from 'next';

// SEO Optimized Metadata
export const metadata: Metadata = {
  title: {
    default: 'বাংলাস্ক্রিপ্ট সেটআপ গাইড | Node.js, VSCode এবং বাংলা টাইপিং',
    template: '%s | বাংলাস্ক্রিপ্ট',
  },
  description: 'বাংলাস্ক্রিপ্ট শিখতে এবং কোডিং শুরু করতে সম্পূর্ণ গাইড। Node.js ইনস্টলেশন, VSCode সেটআপ, বাংলা কীবোর্ড এবং টাইপিং টিউটোরিয়াল সহ সবকিছু।',
  keywords: ['বাংলাস্ক্রিপ্ট', 'Node.js', 'VSCode', 'বাংলা টাইপিং', 'Avro Keyboard', 'Bijoy', 'NPM', 'JavaScript বাংলায়'],
  authors: [{ name: 'Mahmud Rahman' }],
  creator: 'Mahmud Rahman',
  publisher: 'Mahmud Rahman (https://gravatar.com/floawd)',
  openGraph: {
    title: 'বাংলাস্ক্রিপ্ট সেটআপ গাইড | Installation Guide',
    description: 'বাংলাস্ক্রিপ্ট শিখতে এবং কোডিং শুরু করতে সম্পূর্ণ গাইড।',
    url: 'https://bangla-script.vercel.app',
    siteName: 'BanglaScript',
    images: [
      {
        url: 'https://bangla-script.vercel.app/BanglaScript-Logo.png',
        width: 1200,
        height: 630,
        alt: 'বাংলাস্ক্রিপ্ট লোগো',
      },
    ],
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'বাংলাস্ক্রিপ্ট সেটআপ গাইড',
    description: 'বাংলাস্ক্রিপ্ট শিখতে এবং কোডিং শুরু করতে সম্পূর্ণ গাইড।',
    images: ['https://bangla-script.vercel.app/BanglaScript-Logo.png'],
  },
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
  alternates: {
    canonical: 'https://bangla-script.vercel.app/installation',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" dir="ltr" className="scroll-smooth">
      <head>
        <link rel="canonical" href="https://bangla-script.vercel.app/installation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:locale" content="bn_BD" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={`antialiased bg-white dark:bg-gray-900`}>
        {children}
      </body>
    </html>
  );
}
import type { Metadata } from 'next';

// SEO Optimized Metadata
// সমস্ত মেটাডেটা, যেমন viewport এবং theme-color, এখন এই অবজেক্টের মধ্যেই রয়েছে।
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

  // <head> থেকে viewport সেটিংস এখানে আনা হয়েছে
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },

  // <head> থেকে theme-color এখানে আনা হয়েছে
  themeColor: '#3b82f6',

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
    // og:locale ট্যাগটি <head> থেকে সরানো হয়েছে কারণ এটি এখানেই আছে
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
    // canonical ট্যাগটি <head> থেকে সরানো হয়েছে কারণ এটি এখানেই আছে
    canonical: 'https://bangla-script.vercel.app/installation',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ম্যানুয়াল <head> ট্যাগটি সরিয়ে ফেলা হয়েছে।
    // Next.js এখন উপরের 'metadata' অবজেক্ট থেকে স্বয়ংক্রিয়ভাবে <head> তৈরি করবে।
    <html lang="bn" dir="ltr" className="scroll-smooth">
      {/* <head> ট্যাগ এখানে প্রয়োজন নেই */}
      <body className={`antialiased bg-white dark:bg-gray-900`}>
        {children}
      </body>
    </html>
  );
}
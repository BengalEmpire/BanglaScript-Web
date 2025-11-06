import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'বাংলাস্ক্রিপ্ট শিখুন (Tutorials) | সম্পূর্ণ গাইড | Learn BanglaScript',
  description: 'বাংলাস্ক্রিপ্ট-এর বেসিক থেকে অ্যাডভান্সড ধারণা শিখুন। ভেরিয়েবল, ফাংশন, লুপ এবং আরও অনেক কিছুর সম্পূর্ণ টিউটোরিয়াল।',
  
  keywords: [
    'বাংলাস্ক্রিপ্ট শিখুন', 
    'বাংলাস্ক্রিপ্ট গাইড',
    'বাংলাস্ক্রিপ্ট টিউটোরিয়াল', 
    'BanglaScript Tutorial',
    'BanglaScript Guide',
    'Learn BanglaScript',
    'বাংলায় প্রোগ্রামিং',
    'বাংলা প্রোগ্রামিং ভাষা',
    'বাংলা কোডিং',
    'বাংলা জাভাস্ক্রিপ্ট',
    'বাংলা স্ক্রিপ্ট',
    'বাংলা ডেভেলপমেন্ট',
    'BJS',
    'বাংলাস্ক্রিপ্ট টিউটোরিয়াল', 
    'JavaScript বাংলায়', 
    'প্রোগ্রামিং শিখুন', 
    'ভেরিয়েবল', 
    'ফাংশন', 
    'লুপ',
    'বাংলাস্ক্রিপ্ট',
    'BanglaScript',
    'Bangla Script',
    'Bangla-Script',
  ],

  openGraph: {
    title: 'বাংলাস্ক্রিপ্ট শিখুন | সম্পূর্ণ টিউটোরিয়াল',
    description: 'ভেরিয়েবল, ফাংশন, লুপ সহ বাংলাস্ক্রিপ্ট-এর সবকিছু ধাপে ধাপে শিখুন।',
    // URL-টি এই সেকশনের বেস ইউআরএল হবে
    url: 'https://bangla-script.vercel.app/learn-banglascript',
    // আপনি চাইলে এই সেকশনের জন্য আলাদা একটি ইমেজও ব্যবহার করতে পারেন
    images: [
       {
         url: 'https://bangla-script.vercel.app/learn-banglascript.png',
         width: 1200,
         height: 630,
         alt: 'বাংলাস্ক্রিপ্ট টিউটোরিয়াল',
       },
     ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'বাংলাস্ক্রিপ্ট শিখুন (Tutorials)',
    description: 'বাংলায় প্রোগ্রামিং শেখার পূর্ণাঙ্গ গাইড।',
    images: ['https://bangla-script.vercel.app/learn-banglascript.png'],
  },
  
  // এই সেকশনের জন্য Canonical URL
  alternates: {
    canonical: 'https://bangla-script.vercel.app/learn-banglascript',
  },
authors: [{ name: 'Mahmud Rahman' }],
  creator: 'Mahmud Rahman',
  publisher: 'Mahmud Rahman (https://gravatar.com/floawd)',
};

export default function LearnBanglaScriptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
}
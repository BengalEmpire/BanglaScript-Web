'use client';

import { motion } from 'framer-motion';
import { Download, Code, Keyboard, Link as LinkIcon, BookOpen, Hexagon, FileText } from 'lucide-react';
import Link from 'next/link';
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function BanglaScriptSetupPage() {
  return (
    <div>
    <Header />
    <div className="min-h-screen bg-gradient-to-br from-blue-50/55 to-indigo-100/30 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            বাংলাস্ক্রিপ্ট সেটআপ গাইড
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            বাংলাস্ক্রিপ্ট শিখতে এবং কোডিং শুরু করতে এই গাইড অনুসরণ করুন। Node.js, VSCode, কীবোর্ড এবং টাইপিং টিউটোরিয়াল সহ সবকিছু।
          </p>
        </motion.div>

        {/* Resources Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Node.js Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <Hexagon className="h-8 w-8 text-blue-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Node.js</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              বাংলাস্ক্রিপ্ট চালানোর জন্য Node.js দরকার।
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center">
                <LinkIcon className="h-4 w-4 text-green-500 mr-2" />
                <Link href="https://nodejs.org/en/" target="_blank" className="text-blue-600 hover:underline">
                  অফিসিয়াল ওয়েবসাইট
                </Link>
              </li>
              <li className="flex items-center">
                <Download className="h-4 w-4 text-green-500 mr-2" />
                <Link href="https://nodejs.org/en/download" target="_blank" className="text-blue-600 hover:underline">
                  ডাউনলোড এবং ইনস্টল গাইড
                </Link>
              </li>
            </ul>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              <h3 className="font-medium mb-2">ইনস্টলেশন ধাপ:</h3>
              <ol className="text-sm space-y-1">
                <li>nodejs.org থেকে ইনস্টলার ডাউনলোড করুন।</li>
                <li>ইনস্টলার চালান এবং নির্দেশ অনুসরণ করুন।</li>
                <li>টার্মিনালে <code>node --version</code> চেক করুন।</li>
              </ol>
            </div>
          </motion.div>

          {/* VSCode Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <Code className="h-8 w-8 text-green-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">VSCode</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              কোড এডিটর হিসেবে VSCode ব্যবহার করুন।
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center">
                <LinkIcon className="h-4 w-4 text-green-500 mr-2" />
                <Link href="https://code.visualstudio.com/" target="_blank" className="text-blue-600 hover:underline">
                  অফিসিয়াল ওয়েবসাইট
                </Link>
              </li>
              <li className="flex items-center">
                <Download className="h-4 w-4 text-green-500 mr-2" />
                <Link href="https://code.visualstudio.com/docs/setup/setup-overview" target="_blank" className="text-blue-600 hover:underline">
                  ডাউনলোড এবং সেটআপ গাইড
                </Link>
              </li>
            </ul>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              <h3 className="font-medium mb-2">ইনস্টলেশন ধাপ:</h3>
              <ol className="text-sm space-y-1">
                <li>code.visualstudio.com থেকে ডাউনলোড করুন।</li>
                <li>ইনস্টলার চালান।</li>
                <li>Extensions থেকে BanglaScript (আসছে শীঘ্রই) ইনস্টল করুন।</li>
              </ol>
            </div>
          </motion.div>

          {/* BanglaScript Extension Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <FileText className="h-8 w-8 text-purple-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">BanglaScript Extension</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              VSCode-এর জন্য অফিসিয়াল এক্সটেনশন (আসছে শীঘ্রই)।
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md mb-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">এখনও আসেনি, কিন্তু VSCode Marketplace চেক করুন: <Link href="https://marketplace.visualstudio.com/" target="_blank" className="underline">marketplace.visualstudio.com</Link></p>
            </div>
          </motion.div>

          {/* NPM BanglaScript Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <Download className="h-8 w-8 text-red-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">BanglaScript NPM</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              গ্লোবালি ইনস্টল করুন।
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center">
                <LinkIcon className="h-4 w-4 text-green-500 mr-2" />
                <Link href="https://www.npmjs.com/package/banglascript" target="_blank" className="text-blue-600 hover:underline">
                  অফিসিয়াল প্যাকেজ
                </Link>
              </li>
            </ul>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              <h3 className="font-medium mb-2">ইনস্টলেশন কমান্ড:</h3>
              <code className="block bg-gray-200 dark:bg-gray-600 p-2 rounded text-sm">npm install -g banglascript</code>
              <p className="text-sm mt-2">চালু করতে: <code>banglascript</code></p>
            </div>
          </motion.div>

          {/* Bangla Keyboard Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <Keyboard className="h-8 w-8 text-indigo-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">বাংলা ইউনিকোড কীবোর্ড</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              বাংলা টাইপিংয়ের জন্য কীবোর্ড ডাউনলোড করুন।
            </p>
            <ul className="space-y-2">
              <li>
                <Link href="https://www.omicronlab.com/avro-keyboard-download.html" target="_blank" className="text-blue-600 hover:underline flex items-center">
                  <Download className="h-4 w-4 mr-2" /> Avro Keyboard
                </Link>
              </li>
              <li>
                <Link href="https://bijoy-bayanno.en.softonic.com/" target="_blank" className="text-blue-600 hover:underline flex items-center">
                  <Download className="h-4 w-4 mr-2" /> Bijoy Bayanno
                </Link>
              </li>
              <li>
                <Link href="https://apps.microsoft.com/detail/9nz2fz4sjn7z?hl=en-US&gl=US" target="_blank" className="text-blue-600 hover:underline flex items-center">
                  <Download className="h-4 w-4 mr-2" /> NMS Kontho Keyboard
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Bangla Typing Guide Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <BookOpen className="h-8 w-8 text-orange-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">বাংলা টাইপিং গাইড</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              বাংলাস্ক্রিপ্ট শিখতে টাইপিং শিখুন।
            </p>
            <ul className="space-y-2">
              <li>
                <Link href="https://www.easybanglatyping.com/" target="_blank" className="text-blue-600 hover:underline flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" /> Easy Bangla Typing Tutorial
                </Link>
              </li>
              <li>
                <Link href="https://www.typingpoint.com/bengali/bengali-typing" target="_blank" className="text-blue-600 hover:underline flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" /> Bengali Typing Master
                </Link>
              </li>
              <li>
                <Link href="https://www.scribd.com/doc/288040281/Bijoy-Bangla-Typing-Guide" target="_blank" className="text-blue-600 hover:underline flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" /> Bijoy Typing Guide (PDF)
                </Link>
              </li>
            </ul>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md mt-4">
              <h3 className="font-medium mb-2">শুরু করার টিপস:</h3>
              <p className="text-sm">কীবোর্ড ইনস্টল করে প্র্যাকটিস করুন। বাংলা অক্ষর শিখুন এবং সিম্পল স্ক্রিপ্ট লিখুন।</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
        >
          <p className="text-gray-500 dark:text-gray-400">
            বাংলাস্ক্রিপ্ট দিয়ে কোডিং শুরু করুন! কোনো প্রশ্ন থাকলে কমেন্ট করুন।
          </p>
        </motion.div>
      </div>
        {/* Call to Action/Next Steps Section (New UX/UI Element) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center mt-20 p-10 bg-indigo-50 dark:bg-gray-800 rounded-2xl shadow-xl border-t-4 border-indigo-500 dark:border-indigo-400 max-w-7xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">সব সেটআপ হয়ে গেছে?</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              এবার বাংলাস্ক্রিপ্টের ডকুমেন্টেশন দেখতে পারেন এবং প্রথম প্রোগ্রাম লেখা শুরু করতে পারেন।
            </p>
            <Link 
              href="/docs" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-[1.02] dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              ডকুমেন্টেশন দেখুন
            </Link>
          </motion.div>
    </div>
    < Footer />
    </div>
  );
}
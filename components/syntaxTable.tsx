import React from 'react';
import { motion } from 'framer-motion';

const keywordData = {
  // ভেরিয়েবল ও মান
  'সংখ্যা': 'let',
  'শব্দ': 'let',
  'বাক্য': 'let',
  'চলক': 'let',
  'পরিবর্তনশীল': 'var',
  'ধ্রুবক': 'const',
  'ব্যাক্তি': 'const',

  // ফাংশন ও রিটার্ন
  'অনুষ্ঠান': 'function',
  'ফাংশন': 'function',
  'প্রেরণ': 'return',
  'ফেরত': 'return',

  // কন্ডিশনাল
  'যদি': 'if',
  'নাহলে': 'else',
  'অন্যথায়': 'else',
  'নাহলে_যদি': 'else if',

  // লুপ
  'যখন': 'while',
  'জন্য': 'for',
  'প্রতিটি': 'for',
  'করো': 'do',
  'থামাও': 'break',
  'চালিয়ে_যাও': 'continue',

  // অবজেক্ট ও ক্লাস
  'নতুন': 'new',
  'শ্রেণী': 'class',
  'ক্লাস': 'class',
  'গঠন': 'constructor',

  // কনসোল
  'লিখো': 'console.log',
  'ছাপাও': 'console.log',
  'সমস্যা_লিখো': 'console.error',
  'সতর্কতা': 'console.warn',
  'তথ্য': 'console.info',

  // মান
  'সত্য': 'true',
  'মিথ্যা': 'false',
  'শূন্য': 'null',
  'শুন্য': 'null',
  'অনির্ধারিত': 'undefined',

  // এক্সেপশন হ্যান্ডলিং
  'চেষ্টা': 'try',
  'ধরো': 'catch',
  'অবশেষে': 'finally',
  'ফেলা': 'throw',

  // অ্যাসিঙ্ক ও প্রমিজ
  'অপেক্ষা': 'await',
  'অ্যাসিঙ্ক': 'async',

  // সুইচ কন্ডিশন
  'সুইচ': 'switch',
  'কেস': 'case',
  'ডিফল্ট': 'default',

  // মডিউল সিস্টেম
  'আমদানি': 'import',
  'রপ্তানি': 'export',
  'থেকে': 'from',
  'হিসেবে': 'as',

  // অবজেক্ট/অ্যারে ম্যানিপুলেশন
  'মুছো': 'delete',
  'ইন': 'in',
  'ভিতরে': 'in',
  'অফ': 'of',
  'মধ্য': 'of',

  // ক্লাস সম্পর্কিত
  'এটি': 'this',
  'বিস্তৃত': 'extends',
  'স্ট্যাটিক': 'static',
  'স্থির': 'static',

  // 🔥 নতুন কীওয়ার্ড যোগ করা হয়েছে
  'ইনপুট': 'prompt',          // ইউজার ইনপুট নেওয়ার জন্য
  'প্রিন্ট': 'console.log',    // “লিখো” এর বিকল্প
  'গণিত': 'Math',             // “গণিত.সর্বোচ্চ()”, “গণিত.এলোমেলো()” এর জন্য
  'শব্দসমূহ': 'stringify',    // “JSON.শব্দসমূহ” → “JSON.stringify”
  'প্রাপ্ত': 'data',           // “ধ্রুবক প্রাপ্ত = await response.json();” এর মতো ক্ষেত্রে ব্যবহারযোগ্য
  'প্রতিক্রিয়া': 'response',   // Fetch API response mapping
  'সতর্কতা_বক্স': 'alert', 


  'খুঁজে': 'find',
  'খুঁজে_সূচক': 'findIndex',
  'কেটে_দাও': 'splice',
  'ঠেলো': 'push', 
};




const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
};

const SyntaxTable = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:bg-gray-400 py-8 px-3 sm:py-12 sm:px-6 lg:py-16 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12 sticky"
          initial={{ scale: 0.9, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
            প্রোগ্রামিং কীওয়ার্ডস
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            বাংলা থেকে JavaScript কীওয়ার্ড রেফারেন্স
          </p>
        </motion.div>

        {/* Table Container with Shadow */}
        <motion.div
          className="w-full bg-white rounded-lg shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="overflow-x-auto">
            <motion.table
              className="w-full text-left"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white sticky top-0">
                <tr>
                  <th className="px-4 py-4 sm:px-6 sm:py-5 font-semibold text-sm sm:text-base md:text-lg w-1/2">
                    বাংলা শব্দ
                  </th>
                  <th className="px-4 py-4 sm:px-6 sm:py-5 font-semibold text-sm sm:text-base md:text-lg w-1/2">
                    JavaScript কীওয়ার্ড
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(keywordData).map(([bengali, jsKeyword], index) => (
                  <motion.tr
                    key={`${bengali}-${index}`}
                    className="hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                    variants={rowVariants}
                    whileHover={{ scale: 1.01, backgroundColor: '#eff6ff' }}
                  >
                    <td className="px-4 py-3 sm:px-6 sm:py-4 font-medium text-gray-800 text-sm sm:text-base md:text-lg">
                      {bengali}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <code className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-blue-700 font-mono text-xs sm:text-sm md:text-base font-semibold border border-blue-200">
                        {jsKeyword}
                      </code>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          className="text-center mt-8 text-xs sm:text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          মোট {Object.keys(keywordData).length} টি কীওয়ার্ড
        </motion.div>
      </div>
    </div>
  );
};

export default SyntaxTable;
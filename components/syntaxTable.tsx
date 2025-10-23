import React from 'react';
import { motion } from 'framer-motion';

// Sample data - replace with your actual keywords
const keywordData = {
  'যদি': 'if',
  'অন্যথা': 'else',
  'ফাংশন': 'function',
  'রিটার্ন': 'return',
  'চলক': 'var',
  'ধ্রুবক': 'const',
  'পরিবর্তনশীল': 'let',
  'লুপ': 'for',
  'যতক্ষণ': 'while',
  'ভাঙ্গো': 'break',
  'চালিয়ে যাও': 'continue',
  'চেষ্টা করো': 'try',
  'ধরো': 'catch',
  'অবশেষে': 'finally',
  'নতুন': 'new',
  'এই': 'this',
  'শ্রেণী': 'class',
  'বিস্তৃত': 'extends',
  'স্ট্যাটিক': 'static',
  'অ্যাসিংক': 'async',
  'অপেক্ষা': 'await',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-3 sm:py-12 sm:px-6 lg:py-16 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
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
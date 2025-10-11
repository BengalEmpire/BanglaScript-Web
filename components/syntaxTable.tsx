import React from 'react';
import { motion } from 'framer-motion';
import commonMap from '@/data/common-map.json';
import keywords from '@/data/keywords.json';

const syntaxTable: React.FC = () => {
  // Stagger animation variants for lists
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
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.h1
          className="text-4xl font-bold text-center text-gray-800 mb-12"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          বাংলা থেকে ইংরেজি ম্যাপিং এবং কীওয়ার্ডস
        </motion.h1>

        {/* Keywords Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-2xl font-semibold text-center text-green-700 mb-6"
            variants={itemVariants}
          >
            প্রোগ্রামিং কীওয়ার্ডস (Keywords)
          </motion.h2>
          <div className="overflow-x-auto">
            <motion.table
              className="w-full bg-green-50 border border-green-200 rounded-lg overflow-hidden shadow-md"
              variants={containerVariants}
            >
              <thead>
                <tr className="bg-green-100">
                  <th className="p-4 text-left font-semibold text-gray-800">বাংলা শব্দ</th>
                  <th className="p-4 text-left font-semibold text-gray-800">JS কীওয়ার্ড</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(keywords).map(([bengaliKey, jsValue], index) => (
                  <motion.tr
                    key={`${bengaliKey}-${index}`}
                    className="border-t hover:bg-green-100 transition-colors duration-200"
                    variants={itemVariants}
                    whileHover={{ backgroundColor: '#f0fdf4' }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <td className="p-4 text-lg font-medium text-gray-800 border-r border-green-200">
                      {bengaliKey}
                    </td>
                    <td className="p-4">
                      <code className="bg-gray-200 px-3 py-1 rounded-full text-sm font-mono text-green-800">
                        {jsValue}
                      </code>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </motion.section>

        {/* Common Map Section */}
        <motion.section
          className="mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-2xl font-semibold text-center text-blue-700 mb-6"
            variants={itemVariants}
          >
            আপাতত এগুলো variable এবং function নাম এর ক্ষেত্রে ব্যবহার করতে হবে। (বাংলায়)
          </motion.h2>
          <div className="overflow-x-auto">
            <motion.table
              className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg"
              variants={containerVariants}
            >
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-4 text-left font-semibold text-gray-800">বাংলা শব্দ</th>
                  <th className="p-4 text-left font-semibold text-gray-800">ইংরেজি সমতুল্য</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(commonMap).map(([bengaliKey, englishValue], index) => (
                  <motion.tr
                    key={`${bengaliKey}-${index}`}
                    className="border-t hover:bg-blue-50 transition-colors duration-200"
                    variants={itemVariants}
                    whileHover={{ backgroundColor: '#eff6ff' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <td className="p-4 text-lg font-medium text-gray-800 border-r border-gray-200">
                      {bengaliKey}
                    </td>
                    <td className="p-4 text-sm text-gray-600 italic">{englishValue}</td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </motion.section>


      </div>
      <motion.h2
        className="text-2xl font-semibold text-center text-black mb-6 mt-6 underline decoration-pink-500"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={itemVariants}
      >
        আগামিতে আরো যোগ হবে।
      </motion.h2>
    </div>
  );
};

export default syntaxTable;
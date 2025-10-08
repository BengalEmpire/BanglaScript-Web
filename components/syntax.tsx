import React from 'react';
import { motion } from 'framer-motion';
import commonMap from '@/data/common-map.json';
import keywords from '@/data/keywords.json';

const Syntax: React.FC = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50/55 to-indigo-100/55 py-8">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(commonMap).map(([bengaliKey, englishValue], index) => (
              <motion.div
                key={`${bengaliKey}-${index}`}
                className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                variants={itemVariants}
                whileHover={{ scale: 1.05, rotateX: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <p className="text-lg font-medium text-gray-800 mb-2">{bengaliKey}</p>
                <p className="text-sm text-gray-600 italic">{englishValue}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(keywords).map(([bengaliKey, jsValue], index) => (
              <motion.div
                key={`${bengaliKey}-${index}`}
                className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200 hover:shadow-lg transition-shadow duration-300"
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <p className="text-lg font-medium text-gray-800 mb-2">{bengaliKey}</p>
                <code className="bg-gray-200 px-3 py-1 rounded-full text-sm font-mono text-green-800">
                  {jsValue}
                </code>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
       <motion.h2
            className="text-2xl font-semibold text-center text-black mb-6 mt-6 underline decoration-pink-500"
            variants={itemVariants}
          >
           আগামিতে আরো যোগ হবে।
          </motion.h2>
    </div>
  );
};

export default Syntax;
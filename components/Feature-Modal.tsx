"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function Modal() {
  const [isOpen, setIsOpen] = useState(true);
  
  const onClose = () => setIsOpen(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-blue-600 p-3 text-white shadow-lg hover:bg-blue-700 transition"
        aria-label="Open hoodie modal"
      >
        <Gift className="h-6 w-6" />
      </button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 text-gray-900 shadow-md hover:bg-white hover:shadow-lg transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </motion.button>

          {/* Image Container */}
          <div className="relative w-full h-64 sm:h-80 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
            <motion.div
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              <img
                src="https://i.postimg.cc/T3GgGWpp/banglascript-hoodie-community-edition-free.png"
                alt="BanglaScript Free Winter Hoodie"
                className="w-full h-full object-cover"
              />
            </motion.div>
            {/* Overlay Badge */}
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              🎁 Free
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 sm:p-8 space-y-5">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-bold text-gray-900"
            >
              <Gift className="h-6 w-6 text-blue-600" />
              Free Hoodie – Community Edition
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-center text-gray-600 text-sm sm:text-base leading-relaxed"
            >
              BanglaScript থেকে বিশেষ ফ্রি winter hoodie। নিচের ফর্মটি পূরণ করে আবেদন করুন।
            </motion.p>

            {/* CTA Button */}
            <motion.a
              href="https://docs.google.com/forms/d/e/1FAIpQLSde-SjXKhSI3wTfgCmem-RrCfkmJubGKHFJ2X5MyfUKT2OtKw/viewform?usp=header"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="block w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-center text-sm sm:text-base font-semibold text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition active:scale-95 cursor-pointer"
            >
              <div className="flex items-center justify-center gap-2">
                Apply for Free Hoodie
                <ExternalLink className="h-5 w-5" />
              </div>
            </motion.a>

            {/* Steps */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-gray-50 rounded-lg p-4 space-y-2"
            >
              <p className="text-xs sm:text-sm text-gray-700 font-medium">
                📋 <span className="font-semibold">How to apply:</span>
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                Fill up the form → Submit → Wait for selection
              </p>
            </motion.div>

            {/* Sponsor Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center space-y-1 pt-2"
            >
              <p className="text-xs sm:text-sm text-gray-600">
                Want to sponsor?
              </p>
              <a
                href="mailto:mahmud@devplus.fun"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition cursor-pointer"
              >
                mahmud@devplus.fun
              </a>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
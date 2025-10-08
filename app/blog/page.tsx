'use client'

import { motion } from 'framer-motion';
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"


const BlogPage = () => {
  return (
    <div className=" text-gray-800">
        <Header/>
      {/* Header Section */}
      <header className="mb-12 text-center mt-50 h-[30vh]">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold text-gray-900 tracking-wide"
        >
          Blog Under <span className="underline decoration-sky-500">Development</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-4 text-lg font-light text-gray-600 max-w-2xl mx-auto"
        >
          We're currently working on creating amazing content for you. Stay tuned for some exciting blog posts!
        </motion.p>
      </header>

      

      {/* Footer Section */}
      <footer className="mb-5 text-center text-gray-600">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-sm font-medium"
        >
          © {new Date().getFullYear()} BanglaScript Blog - All Rights Reserved.
        </motion.p>
      </footer>
      <Footer/>
    </div>
  );
};

export default BlogPage;
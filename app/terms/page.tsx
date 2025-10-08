'use client'; 


import { motion } from 'framer-motion'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 md:py-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
        >
          <motion.h1 
            variants={sectionVariants}
            className="text-4xl font-bold mb-6 text-center"
          >
            Terms and Conditions
          </motion.h1>

          <motion.p 
            variants={sectionVariants}
            className="mb-8 text-center text-gray-600"
          >
            Last updated: October 08, 2025
          </motion.p>

          <motion.section variants={sectionVariants} className="mb-12 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Development Notice / উন্নয়ন সংক্রান্ত নোটিশ</h2>
            <p className="text-lg leading-relaxed italic text-gray-700">
              BanglaScript পরিকল্পনাধীন ভাবে ডেভেলপমেন্টের মধ্য রয়েছে। তাই ওয়েব playground এবং npm package এর মধ্য কিছু পার্থক্য আপাতত থাকতে পারে। তবে এটি খুব দ্রুত সমাধান হয়ে, সহজে ব্যবহার যোগ্য বাংলা ভাষায় প্রোগ্রামিং করা যাবে। সাথে থাকুন। ধন্যবাদ।
            </p>
            <p className="mt-4 text-sm text-gray-500">
              BanglaScript is currently under active development. Therefore, there may be some temporary differences between the web playground and the NPM package. However, these will be resolved soon, enabling easy programming in Bengali. Stay with us. Thank you.
            </p>
          </motion.section>

          <motion.p 
            variants={sectionVariants}
            className="mb-8 text-lg leading-relaxed"
          >
            Please read these terms and conditions carefully before using Our Service.
          </motion.p>


          <motion.section variants={sectionVariants} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Use of the Service</h2>
            <p className="mb-4 text-gray-600 leading-relaxed">
              BanglaScript is an open-source transpiler for writing JavaScript in Bengali syntax. The web playground and NPM package are provided &quot;as is&quot; for educational and development purposes.
            </p>
            <p className="mb-4 text-gray-600 leading-relaxed">
              You agree not to use the Service for any illegal or unauthorized purpose, including but not limited to violating intellectual property rights or distributing harmful code.
            </p>
          </motion.section>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
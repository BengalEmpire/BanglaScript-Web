"use client"

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from 'next/image'


// Icon for section headers
const SectionIcon = ({ children }) => (
  <div className="flex items-center justify-center w-12 h-12 mr-4 bg-blue-100 dark:bg-blue-900/50 rounded-full text-blue-600 dark:text-blue-300">
    {children}
  </div>
);

// Custom styled card component
const InfoCard = ({ icon, title, children, color = 'blue' }) => {
    const colorClasses = {
        blue: 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-gray-800',
        yellow: 'border-yellow-400 dark:border-yellow-500 bg-yellow-50 dark:bg-gray-800',
        green: 'border-green-400 dark:border-green-500 bg-green-50 dark:bg-gray-800',
        purple: 'border-purple-400 dark:border-purple-500 bg-purple-50 dark:bg-gray-800',
        red: 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-gray-800',
        teal: 'border-teal-400 dark:border-teal-500 bg-teal-50 dark:bg-gray-800',
    };

    return (
        <motion.div
            variants={itemVariants}
            className={`rounded-xl shadow-lg p-6 border-l-4 ${colorClasses[color]} transition-all duration-300 hover:shadow-xl hover:scale-105`}
        >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                <span className="mr-3 text-2xl">{icon}</span> {title}
            </h3>
            <div className="text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed">
                {children}
            </div>
        </motion.div>
    );
};

// Code block component
const CodeBlock = ({ code, language = 'bjs' }) => (
    <div className="bg-gray-900 text-white p-5 rounded-lg shadow overflow-x-auto my-4 border">
        <pre><code className={`language-${language} whitespace-pre-wrap text-sm md:text-base`}>
            {code}
        </code></pre>
    </div>
);


const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      when: "beforeChildren",
      staggerChildren: 0.1
    },
  },
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20, 
    scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};


export default function ComputerProgramming() {

  return (
    <>
    <Header/>
      <div className="min-h-screen bg-gray-100/75 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200">
        {/* Header */}
        <motion.header
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-pink-400/5 dark:bg-gray-800/50 backdrop-blur-sm shadow top-0 mt-5"
        >
          <div className="container mx-auto px-4 py-5 text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2 p-4">
              কম্পিউটার ও প্রোগ্রামিং-এর জগৎ
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              এইখানে আমরা সহজ বাংলা ভাষায় কম্পিউটার, প্রোগ্রামিং, JavaScript, এবং BanglaScript (BJS) নিয়ে জানব।
            </p>
          </div>
        </motion.header>

        <main className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
          {/* Section 1: How Computers Work */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            className="mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-8 flex items-center">
              <SectionIcon>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </SectionIcon>
              ১. কম্পিউটার কীভাবে কাজ করে?
            </motion.h2>

            <motion.p variants={itemVariants} className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              কম্পিউটারকে একটি বুদ্ধিমান যন্ত্র ভাবা যেতে পারে যা আমাদের নির্দেশ অনুসরণ করে। এর কাজের ধারা মূলত তিনটি ধাপে বিভক্ত: ইনপুট, প্রসেসিং, এবং আউটপুট। ভাবুন, আপনি একজন রাঁধুনিকে রান্না করতে বলছেন।
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-around gap-4 text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md mb-8">
                <div className="flex flex-col items-center p-4">
                    <div className="text-4xl mb-2">⌨️</div>
                    <h3 className="font-bold text-lg">ইনপুট (উপকরণ)</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">কীবোর্ড বা মাউস দিয়ে তথ্য দেওয়া হয়।</p>
                </div>
                <div className="text-2xl text-blue-500 font-mono hidden md:block">➡️</div>
                 <div className="text-2xl text-blue-500 font-mono md:hidden">⬇️</div>
                <div className="flex flex-col items-center p-4">
                    <div className="text-4xl mb-2">🧠</div>
                    <h3 className="font-bold text-lg">প্রসেসিং (রান্না করা)</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">CPU সেই তথ্য নিয়ে কাজ করে।</p>
                </div>
                 <div className="text-2xl text-blue-500 font-mono hidden md:block">➡️</div>
                 <div className="text-2xl text-blue-500 font-mono md:hidden">⬇️</div>
                <div className="flex flex-col items-center p-4">
                    <div className="text-4xl mb-2">🖥️</div>
                    <h3 className="font-bold text-lg">আউটপুট (খাবার)</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">ফলাফল মনিটরে দেখা যায়।</p>
                </div>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoCard icon="🛠️" title="Hardware (যন্ত্রাংশ)" color="blue">
                    <p>কম্পিউটারের শরীর যা স্পর্শ করা যায়।</p>
                    <ul className="list-disc list-inside text-sm pl-2">
                        <li><strong>CPU:</strong> কম্পিউটারের মস্তিষ্ক।</li>
                        <li><strong>RAM:</strong> কাজের জন্য অস্থায়ী মেমোরি।</li>
                        <li><strong>Storage:</strong> তথ্য স্থায়ীভাবে রাখার জায়গা।</li>
                    </ul>
                </InfoCard>
                <InfoCard icon="💾" title="Firmware (ফার্মওয়্যার)" color="yellow">
                     <p>হার্ডওয়্যারকে চালানোর জন্য স্থায়ীভাবে থাকা ছোট প্রোগ্রাম। যেমন: BIOS, যা কম্পিউটার চালু হতে সাহায্য করে।</p>
                </InfoCard>
                <InfoCard icon="💽" title="Operating System (OS)" color="green">
                    <p>এটি হার্ডওয়্যার এবং আমাদের মধ্যে সংযোগ স্থাপন করে। যেমন: Windows, macOS, বা Linux।</p>
                </InfoCard>
            </div>
          </motion.section>

          {/* Section 2: Software & Programming */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            className="mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-8 flex items-center">
              <SectionIcon>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </SectionIcon>
              ২. সফটওয়্যার ও প্রোগ্রামিং ভাষা
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
             সফটওয়্যার হলো কিছু নির্দেশের সমষ্টি যা হার্ডওয়্যারকে বলে দেয় কী করতে হবে। এই নির্দেশগুলোই লেখা হয় প্রোগ্রামিং ভাষার মাধ্যমে।
            </motion.p>
            <div className="grid md:grid-cols-2 gap-6">
                <InfoCard icon="💻" title="Software (সফটওয়্যার)" color="purple">
                  <p>সফটওয়্যার দুই প্রকার:</p>
                  <ul className="list-disc list-inside text-sm pl-2">
                      <li><strong>সিস্টেম সফটওয়্যার:</strong> যেমন OS, যা কম্পিউটারকে চালায়।</li>
                      <li><strong>অ্যাপ্লিকেশন সফটওয়্যার:</strong> যেমন গেম, ব্রাউজার, যা নির্দিষ্ট কাজ করে।</li>
                  </ul>
                </InfoCard>
                <InfoCard icon="📜" title="Programming Language (ভাষা)" color="red">
                  <p>কম্পিউটারের সাথে কথা বলার জন্য ব্যবহৃত ভাষা। যেমন মানুষ বাংলা বা ইংরেজিতে কথা বলে।</p>
                   <ul className="list-disc list-inside text-sm pl-2">
                      <li><strong>উচ্চ-স্তর (High-level):</strong> মানুষের ভাষার কাছাকাছি (JavaScript, Python)।</li>
                      <li><strong>নিম্ন-স্তর (Low-level):</strong> মেশিনের ভাষার কাছাকাছি (Assembly)।</li>
                  </ul>
                </InfoCard>
            </div>
          </motion.section>

           {/* Section 3: JavaScript */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            className="mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-8 flex items-center">
              <SectionIcon>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path fill="#4ade80" d="M11.25,7.72142857 L12.75,7.72142857 L12.75,15.2214286 L14.5160714,15.2214286 L14.5160714,16.5 L9.48392857,16.5 L9.48392857,15.2214286 L11.25,15.2214286 L11.25,7.72142857 Z M16.875,7.5 C17.3963393,7.5 17.875,7.97866071 17.875,8.5 L17.875,9.70535714 C17.875,10.2266964 17.3963393,10.7053571 16.875,10.7053571 C16.3536607,10.7053571 15.875,10.2266964 15.875,9.70535714 L15.875,8.5 C15.875,7.97866071 16.3536607,7.5 16.875,7.5 Z M16.875,12 C17.3963393,12 17.875,12.4786607 17.875,13 L17.875,15.4285714 C17.875,15.8598214 17.5191071,16.2732143 17.0714286,16.425 L15.875,16.425 L15.875,15.2214286 L16.5,15.2214286 C16.7053571,15.2214286 16.875,15.0517857 16.875,14.8464286 L16.875,13.375 C16.875,13.1696429 16.7053571,13 16.5,13 L15.875,13 L15.875,12 L16.875,12 Z" /></svg>
              </SectionIcon>
              ৩. JavaScript কেন এত জনপ্রিয়?
            </motion.h2>
             <motion.p variants={itemVariants} className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
             JavaScript হলো ইন্টারনেটের ভাষা। এটি দিয়ে ওয়েবসাইটকে জীবন্ত করে তোলা যায়, যা ব্যবহারকারীর সাথে যোগাযোগ করতে পারে।
            </motion.p>
             <div className="grid md:grid-cols-2 gap-6">
                <InfoCard icon="🌐" title="Client-Side (ব্রাউজারে)" color="green">
                  <p>ওয়েবসাইটকে ইন্টারেক্টিভ করে। যেমন:</p>
                  <ul className="list-disc list-inside text-sm pl-2">
                      <li>ফর্ম পূরণ যাচাই করা।</li>
                      <li>স্লাইডার বা অ্যানিমেশন তৈরি।</li>
                      <li>বোতামে ক্লিক করলে কিছু দেখানো।</li>
                  </ul>
                </InfoCard>
                <InfoCard icon="⚙️" title="Server-Side (Node.js দিয়ে)" color="teal">
                  <p>Node.js ব্রাউজারের বাইরেও JavaScript চালানোর সুযোগ করে দেয়। এর মাধ্যমে:</p>
                   <ul className="list-disc list-inside text-sm pl-2">
                      <li>সম্পূর্ণ ওয়েবসাইট বা অ্যাপ তৈরি করা যায়।</li>
                      <li>ডাটাবেসের সাথে সংযোগ করা যায়।</li>
                      <li>রিয়েল-টাইম চ্যাট অ্যাপ্লিকেশন বানানো যায়।</li>
                  </ul>
                </InfoCard>
            </div>
          </motion.section>

            {/* Section 4: Core Concepts */}
            <motion.section
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                variants={sectionVariants} className="mb-16"
            >
                <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400 mb-8 flex items-center">
                    <SectionIcon>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </SectionIcon>
                    ৪. প্রোগ্রামিং-এর মূল ভিত্তি
                </motion.h2>

                <div className="space-y-8">
                    <motion.div variants={itemVariants}>
                        <h3 className="text-2xl font-semibold mb-2">ডেটা টাইপ ও ভ্যারিয়েবল</h3>
                        <p className="mb-4">ভ্যারিয়েবল হলো একটি পাত্রের মতো, যেখানে বিভিন্ন ধরনের তথ্য (ডেটা) রাখা যায়।</p>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <p>• <strong>সংখ্যা (Number):</strong> 10, 3.14</p>
                            <p>• <strong>স্ট্রিং (String):</strong> "বাংলা", 'Dhaka'</p>
                            <p>• <strong>বুলিয়ান (Boolean):</strong> সত্য (true), মিথ্যা (false)</p>
                            <p>• <strong>অ্যারে (Array):</strong> [১, ২, ৩, "ক"]</p>
                        </div>
                         <CodeBlock code={`সংখ্যা বয়স = ২৫;\nনাম = "রহিম";`} />
                    </motion.div>
                    
                     <motion.div variants={itemVariants}>
                        <h3 className="text-2xl font-semibold mb-2">ফাংশন (অনুষ্ঠান)</h3>
                        <p className="mb-4">ফাংশন হলো একটি নির্দিষ্ট কাজ করার জন্য কোডের একটি ব্লক, যা বারবার ব্যবহার করা যায়। যেমন একটি জুস মেকার, যা ফল নিয়ে জুস তৈরি করে দেয়।</p>
                        <CodeBlock code={`অনুষ্ঠান যোগ( ক, খ) {\n  প্রেরণ ক + খ;\n}\n\nলিখো(যোগ(৫, ৩)); // আউটপুট: ৮`} />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <h3 className="text-2xl font-semibold mb-2">কন্ডিশন (শর্ত)</h3>
                        <p className="mb-4">যদি একটি শর্ত পূরণ হয়, তবে নির্দিষ্ট কাজ হবে, নাহলে অন্য কাজ হবে। যেমন: যদি বৃষ্টি হয়, ছাতা নেব।</p>
                        <CodeBlock code={`সংখ্যা বয়স = ১৮;\n\nযদি (বয়স >= ১৮) {\n  লিখো("আপনি ভোট দিতে পারবেন");\n} নাহলে {\n  লিখো("আপনি ভোট দিতে পারবেন না");\n}`} />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <h3 className="text-2xl font-semibold mb-2">লুপ (পুনরাবৃত্তি)</h3>
                        <p className="mb-4">একটি কাজ নির্দিষ্ট সংখ্যক বার বা একটি শর্ত পূরণ না হওয়া পর্যন্ত পুনরাবৃত্তি করা।</p>
                        <CodeBlock code={`জন্য (সংখ্যা i = ১; i <= ৫; i = i + ১) {\n  লিখো("আমাদের ভাষা বাংলা", i);\n}\n// এই কোডটি ৫ বার "আমাদের ভাষা বাংলা" লিখবে।`} />
                    </motion.div>
                </div>
            </motion.section>


          {/* Section 5: BanglaScript */}
          <motion.section
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants} className="mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-teal-600 dark:text-teal-400 mb-8 flex items-center">
               <SectionIcon>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10-5-10M6.088 21L11 11.088M11 11.088L15.912 1M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2z" /></svg>
              </SectionIcon>
              ৫. BanglaScript (BJS) কী এবং কেন?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              BanglaScript একটি বিশেষ টুল (Transpiler) যা বাংলা ভাষায় লেখা কোডকে JavaScript-এ রূপান্তর করে। এর মূল উদ্দেশ্য হলো, যারা ইংরেজিতে স্বচ্ছন্দ নন, তাদের জন্য প্রোগ্রামিং শেখা সহজ করা।
            </motion.p>
            
            <motion.div variants={itemVariants} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <h3 className="font-bold text-xl mb-4 text-center">BanglaScript যেভাবে কাজ করে</h3>
                 <div className="flex flex-col md:flex-row items-center justify-around gap-4 text-center">
                    <div className="flex flex-col items-center p-2 ">
                        <div className="text-3xl mb-2 px-3 ">
                            <Image
                            src="/BanglaScript-Logo.png"
                            width={40}
                            height={40}
                            alt="Picture of the author"
                          />
                        </div>
                        <h4 className="font-semibold">main.bjs</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">বাংলায় কোড লেখা হয়।</p>
                    </div>
                    <div className="text-2xl text-teal-500 font-mono hidden md:block">Transpiler ➡️</div>
                    <div className="text-2xl text-teal-500 font-mono md:hidden">⬇️</div>
                    <div className="flex flex-col items-center p-2">
                        <div className="text-3xl mb-2 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">📜</div>
                        <h4 className="font-semibold">main.js</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">JavaScript-এ রূপান্তরিত হয়।</p>
                    </div>
                     <div className="text-2xl text-teal-500 font-mono hidden md:block">রান ➡️</div>
                     <div className="text-2xl text-teal-500 font-mono md:hidden">⬇️</div>
                    <div className="flex flex-col items-center p-2">
                        <div className="text-3xl mb-2 p-3 bg-blue-100 dark:bg-blue-900 rounded-full">🚀</div>
                        <h4 className="font-semibold">ফলাফল</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Node.js বা ব্রাউজারে চলে।</p>
                    </div>
                </div>
            </motion.div>
          </motion.section>

          {/* Final Summary */}
          <motion.section
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
              🧠 মূল কথা
            </h2>
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
                 <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start"><span className="mr-3 text-blue-500">✔</span><span><strong>কম্পিউটার:</strong> হার্ডওয়্যার ও সফটওয়্যারের সমন্বয়।</span></li>
                    <li className="flex items-start"><span className="mr-3 text-purple-500">✔</span><span><strong>প্রোগ্রামিং ভাষা:</strong> কম্পিউটারকে নির্দেশ দেওয়ার মাধ্যম।</span></li>
                    <li className="flex items-start"><span className="mr-3 text-green-500">✔</span><span><strong>JavaScript:</strong> ওয়েবকে ইন্টারেক্টিভ করার সবচেয়ে জনপ্রিয় ভাষা।</span></li>
                    <li className="flex items-start"><span className="mr-3 text-teal-500">✔</span><span><strong>BanglaScript:</strong> প্রোগ্রামিং-এর কঠিন ধারণাগুলো বাংলায় সহজে শেখার একটি চমৎকার উপায়।</span></li>
                </ul>
            </div>
             <p className="text-center text-lg font-medium text-gray-800 dark:text-white mt-8">
                BanglaScript দিয়ে প্রোগ্রামিং শেখা শুরু করলে ভয়ের কিছু নেই, বরং এটি মজাদার একটি যাত্রা হবে!
            </p>
          </motion.section>

        </main>

        {/* Footer */}
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 py-6 text-center text-gray-600 dark:text-gray-400 mt-16"
        >
          <p>&copy; ২০২৫ কম্পিউটার এবং প্রোগ্রামিং শিক্ষা। BanglaScript কর্তৃক সর্বস্বত্ব সংরক্ষিত।</p>
        </motion.footer>
      </div>
      <Footer/>
    </>
  );
}
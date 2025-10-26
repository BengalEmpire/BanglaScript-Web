'use client';

import { motion, Variants } from 'framer-motion';
import { Download, Code, Keyboard, Link as LinkIcon, BookOpen, Hexagon, Package, Type, Blocks, Check, ChevronRight, ExternalLink, AlertCircle, Play, Terminal, FileCode } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import OpenInAI from "@/components/OpenInChatGPT";

// --- Enhanced Animation Variants ---
const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.6,
      staggerChildren: 0.12,
      delayChildren: 0.1,
    }
  },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, x: -40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 80, 
      damping: 20,
      duration: 0.6 
    } 
  },
};

const progressBarVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: { 
    scaleX: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

// --- Enhanced Data for Steps ---
const setupSteps = [
  {
    step: 1,
    title: "Node.js ইনস্টল করুন",
    icon: <Hexagon className="h-8 w-8" />,
    iconColor: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    accentColor: "border-green-200 dark:border-green-800",
    description: "Node.js হলো বাংলাস্ক্রিপ্ট চালানোর ইঞ্জিন। এটি ছাড়া বাংলাস্ক্রিপ্ট কাজ করবে না।",
    whyNeeded: "কেন প্রয়োজন: Node.js আপনার কম্পিউটারে JavaScript (এবং বাংলাস্ক্রিপ্ট) রান করার পরিবেশ তৈরি করে।",
    links: [
      { href: "https://nodejs.org/en/", text: "Node.js অফিসিয়াল ওয়েবসাইট", isPrimary: true },
    ],
    detailedSteps: [
      {
        title: "১. ডাউনলোড করুন",
        content: "nodejs.org ওয়েবসাইট থেকে LTS (Long Term Support) ভার্সন ডাউনলোড করুন। এটি 'Recommended For Most Users' লেবেল সহ থাকবে।",
        tip: "টিপস: সবুজ রঙের বড় বাটনে ক্লিক করুন যেখানে লেখা আছে 'Download for Windows/Mac'। (BanglaScript Deno'র উপরেও চলতে পারে।)"
      },
      {
        title: "২. ইনস্টল করুন",
        content: "ডাউনলোড করা ফাইলটি ডাবল ক্লিক করে খুলুন এবং 'Next' বাটনে ক্লিক করতে থাকুন। সব ডিফল্ট সেটিংস রেখে দিন।",
        tip: "সময় লাগবে: প্রায় ২-৩ মিনিট।"
      },
      {
        title: "৩. যাচাই করুন",
        content: "ইনস্টলেশন সফল হয়েছে কিনা দেখতে:",
        code: "node -v",
        codeLabel: "টার্মিনাল/Command Prompt এ লিখুন:",
        expectedOutput: "ভার্সন নম্বর দেখাবে (যেমন: v20.11.0)"
      }
    ],
    videoHelp: "ভিডিও টিউটোরিয়াল দেখতে YouTube এ 'Node.js installation bangla' সার্চ করুন।"
  },
  {
    step: 2,
    title: "VS Code এডিটর সেটআপ করুন",
    icon: <Code className="h-8 w-8" />,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    accentColor: "border-blue-200 dark:border-blue-800",
    description: "VS Code হলো আপনার কোড লেখার নোটবুক। এটি সবচেয়ে জনপ্রিয় এবং শক্তিশালী কোড এডিটর।",
    whyNeeded: "কেন প্রয়োজন: সুন্দর করে কোড লেখা, কালার হাইলাইটিং, এবং ভুল খুঁজে বের করার জন্য।",
    links: [
      { href: "https://code.visualstudio.com/", text: "VS Code ডাউনলোড করুন", isPrimary: true },
    ],
    detailedSteps: [
      {
        title: "১. ডাউনলোড করুন",
        content: "code.visualstudio.com থেকে নীল রঙের 'Download' বাটনে ক্লিক করুন। আপনার Operating System অনুযায়ী সঠিক ভার্সন স্বয়ংক্রিয়ভাবে সিলেক্ট হবে।"
      },
      {
        title: "২. ইনস্টল করুন",
        content: "ডাউনলোড করা ফাইল চালান এবং লাইসেন্স একসেপ্ট করে Next করতে থাকুন।",
        tip: "গুরুত্বপূর্ণ: 'Add to PATH' অপশনটি টিক দিয়ে রাখুন।"
      },
      {
        title: "৩. প্রথমবার খুলুন",
        content: "ইনস্টলেশনের পর VS Code খুলুন। Welcome পেজ দেখাবে। এটি বন্ধ করে দিতে পারেন।"
      },
      {
        title: "৪. বাংলা ফন্ট সেটআপ (ঐচ্ছিক)",
        content: "Settings (Ctrl+,) এ গিয়ে 'Font Family' সার্চ করুন এবং 'SolaimanLipi, Kalpurush' যোগ করুন যাতে বাংলা সুন্দর দেখায়।"
      }
    ],
    videoHelp: "প্রথমবার VS Code ব্যবহারের গাইড: YouTube এ 'VS Code bangla tutorial for beginners' সার্চ করুন।"
  },
  {
    step: 3,
    title: "BanglaScript ইনস্টল করুন",
    icon: <Package className="h-8 w-8" />,
    iconColor: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    accentColor: "border-red-200 dark:border-red-800",
    description: "এটি হলো মূল বাংলাস্ক্রিপ্ট প্রোগ্রাম যা আপনার বাংলা কোড বুঝে চালাবে।",
    whyNeeded: "কেন প্রয়োজন: এটি ছাড়া .bjs ফাইল রান করতে পারবেন না।",
    links: [
      { href: "https://www.npmjs.com/package/banglascript", text: "NPM প্যাকেজ দেখুন", isPrimary: false },
    ],
    detailedSteps: [
      {
        title: "১. টার্মিনাল/Command Prompt খুলুন",
        content: "Windows: স্টার্ট মেনু থেকে 'cmd' লিখে সার্চ করুন। Mac/Linux: 'Terminal' অ্যাপ খুলুন।"
      },
      {
        title: "২. ইনস্টল কমান্ড চালান",
        code: "npm install -g banglascript",
        codeLabel: "এই কমান্ডটি কপি করে টার্মিনালে পেস্ট করুন এবং Enter চাপুন:",
        content: "ইনস্টলেশন শুরু হবে। ইন্টারনেট স্পিড অনুযায়ী ১-৩ মিনিট সময় লাগতে পারে।",
        tip: "'-g' মানে হলো গ্লোবাল ইনস্টল। এতে যেকোনো ফোল্ডার থেকে banglascript কমান্ড চালাতে পারবেন।"
      },
      {
        title: "৩. যাচাই করুন",
        code: "banglascript --version",
        codeLabel: "ইনস্টল সফল হয়েছে কিনা দেখতে:",
        expectedOutput: "ভার্সন নম্বর দেখাবে (যেমন: 1.0.0)"
      },
      {
        title: "৪. প্রথম প্রোগ্রাম চালান",
        content: "একটি ফাইল তৈরি করুন (যেমন: test.bjs) এবং তাতে লিখুন: দেখাও(\"হ্যালো ওয়ার্ল্ড\");",
        code: "banglascript test.bjs",
        codeLabel: "চালাতে:",
        expectedOutput: "আউটপুট: হ্যালো ওয়ার্ল্ড"
      }
    ],
    troubleshooting: {
      title: "সমস্যা হলে:",
      issues: [
        "'npm' command not found: Node.js আবার ইনস্টল করুন এবং PATH যুক্ত আছে কিনা চেক করুন।",
        "Permission Error: Windows এ Command Prompt 'Run as Administrator' করে খুলুন।"
      ]
    }
  },
  {
    step: 4,
    title: "বাংলা কীবোর্ড সেটআপ করুন",
    icon: <Keyboard className="h-8 w-8" />,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    accentColor: "border-purple-200 dark:border-purple-800",
    description: "বাংলায় কোড লেখার জন্য একটি বাংলা কীবোর্ড সফটওয়্যার প্রয়োজন।",
    whyNeeded: "কেন প্রয়োজন: ইংরেজি কীবোর্ড দিয়ে বাংলা লিখতে পারবেন না।",
    links: [
      { href: "https://www.omicronlab.com/avro-keyboard-download.html", text: "Avro Keyboard (সবচেয়ে জনপ্রিয়)", isPrimary: true, icon: <Download className="h-4 w-4" /> },
      { href: "https://bijoy-bayanno.en.softonic.com/", text: "Bijoy Bayanno", isPrimary: false },
      { href: "https://apps.microsoft.com/detail/9nz2fz4sjn7z", text: "NMS Kontho Keyboard", isPrimary: false },
    ],
    detailedSteps: [
      {
        title: "১. Avro Keyboard ডাউনলোড করুন (প্রস্তাবিত)",
        content: "omicronlab.com থেকে Avro Keyboard ডাউনলোড করুন। এটি সম্পূর্ণ ফ্রি এবং সবচেয়ে সহজ।"
      },
      {
        title: "২. ইনস্টল করুন",
        content: "ডাউনলোড করা ফাইল চালিয়ে ইনস্টল করুন। খুবই সহজ - শুধু Next করতে থাকুন।"
      },
      {
        title: "৩. কীবোর্ড চালু করুন",
        content: "ইনস্টল হওয়ার পর সিস্টেম ট্রেতে (নিচের ডানদিকে) Avro আইকন দেখতে পাবেন। ক্লিক করে চালু করুন।",
        tip: "শর্টকাট: F12 চাপলে বাংলা-ইংরেজি মোড চেঞ্জ হয়।"
      },
      {
        title: "৪. টেস্ট করুন",
        content: "VS Code বা নোটপ্যাডে গিয়ে টাইপ করে দেখুন। 'amar' লিখলে 'আমার' হবে।"
      }
    ],
    videoHelp: "Avro Keyboard সেটআপ গাইড: YouTube এ 'Avro keyboard install bangla' সার্চ করুন।"
  },
  {
    step: 5,
    title: "বাংলা টাইপিং শিখুন",
    icon: <Type className="h-8 w-8" />,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    accentColor: "border-orange-200 dark:border-orange-800",
    description: "দ্রুত কোড লিখতে হলে বাংলা টাইপিং জানা জরুরি। চিন্তা নেই, অনুশীলন করলে সহজ হয়ে যাবে!",
    whyNeeded: "কেন প্রয়োজন: ধীরে টাইপ করলে প্রোগ্রামিং শিখতে সময় বেশি লাগবে।",
    links: [
      { href: "https://www.easybanglatyping.com/", text: "Easy Bangla Typing (ফ্রি টিউটোরিয়াল)", isPrimary: true },
      { href: "https://www.typingpoint.com/bengali/bengali-typing", text: "Bengali Typing Master", isPrimary: false },
    ],
    detailedSteps: [
      {
        title: "১. কীবোর্ড লেআউট চিনুন",
        content: "প্রথমে Avro Phonetic লেআউট ব্যবহার করুন। এতে বাংলা উচ্চারণ ইংরেজিতে লিখলেই বাংলা হয়ে যায়।",
        tip: "উদাহরণ: 'ami' → আমি, 'tumi' → তুমি, 'bangla' → বাংলা"
      },
      {
        title: "২. প্রতিদিন ১৫ মিনিট অনুশীলন করুন",
        content: "প্রথম সপ্তাহ: ছোট ছোট শব্দ লিখুন (আমি, তুমি, সে, ভালো, খারাপ)।",
        content2: "দ্বিতীয় সপ্তাহ: ছোট বাক্য লিখুন (আমি ভালো আছি, তুমি কেমন আছো?)।"
      },
      {
        title: "৩. কোড লেখার অনুশীলন করুন",
        content: "বাংলাস্ক্রিপ্টের সাধারণ শব্দগুলো বারবার লিখুন:",
        code: "দেখাও, চলক, যদি, নাহলে, লুপ, ফাংশন",
        codeLabel: "এগুলো বারবার টাইপ করুন:"
      }
    ],
    practiceGoal: "লক্ষ্য: ১ মাসে মিনিটে ২০-৩০ শব্দ টাইপ করতে পারা।"
  },
  {
    step: 6,
    title: "VS Code Extension (শীঘ্রই আসছে)",
    icon: <Blocks className="h-8 w-8" />,
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    accentColor: "border-indigo-200 dark:border-indigo-800",
    description: "বাংলাস্ক্রিপ্টের জন্য অফিসিয়াল VS Code এক্সটেনশন শীঘ্রই আসছে। এতে কোড লেখা আরও সহজ হবে।",
    whyNeeded: "কী পাবেন: Syntax Highlighting, Auto-complete, Error Detection, এবং Code Snippets।",
    links: [
      { href: "https://marketplace.visualstudio.com/", text: "VS Code Marketplace চেক করুন", isPrimary: false },
    ],
    detailedSteps: [
      {
        title: "১. এখন কী করবেন?",
        content: "Extension আসার আগে পর্যন্ত .bjs ফাইলগুলো Plain Text mode এ লিখুন। কোনো সমস্যা নেই।"
      },
      {
        title: "২. Extension আসলে কীভাবে ইনস্টল করবেন?",
        content: "VS Code এ Extensions ট্যাবে (Ctrl+Shift+X) গিয়ে 'BanglaScript' সার্চ করে Install বাটনে ক্লিক করবেন।"
      }
    ],
    comingSoon: "আপডেট পেতে: GitHub বা অফিসিয়াল ওয়েবসাইট ফলো করুন।"
  },
];

// --- Progress Indicator Component ---
const ProgressIndicator = ({ currentStep, totalSteps }) => (
  <div className="mb-12">
    <div className="flex items-center justify-between mb-2 px-2">
      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
        অগ্রগতি: স্টেপ {currentStep} / {totalSteps}
      </span>
      <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
        {Math.round((currentStep / totalSteps) * 100)}% সম্পন্ন
      </span>
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
      />
    </div>
  </div>
);

// --- Enhanced Step Card Component ---
const StepCard = ({ step, title, icon, iconColor, bgColor, accentColor, description, whyNeeded, links, detailedSteps, videoHelp, troubleshooting, practiceGoal, comingSoon }) => (
  <motion.div
    variants={stepVariants}
    whileHover={{ scale: 1.01, y: -5 }}
    className={`bg-white dark:bg-gray-800/70 rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col h-full border-2 ${accentColor} transition-all duration-300 hover:shadow-2xl backdrop-blur-sm`}
  >
    {/* Header Section */}
    <div className="flex items-start mb-6">
      <div className="flex-shrink-0 mr-5">
        <motion.div 
          whileHover={{ rotate: 360, scale: 1.02 }}
          transition={{ duration: 0.6 }}
          className={`w-16 h-16 rounded-2xl ${bgColor} flex items-center justify-center shadow-md`}
        >
          <div className="relative">
            <div className={`absolute inset-0 ${iconColor} opacity-20 blur-xl`}></div>
            {React.cloneElement(icon, { className: `${iconColor} relative z-10` })}
          </div>
        </motion.div>
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold mr-3">
            {step}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mt-3 text-base leading-relaxed">
          {description}
        </p>
        {whyNeeded && (
          <div className="mt-4 flex items-start bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-3 rounded">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">{whyNeeded}</p>
          </div>
        )}
      </div>
    </div>

    {/* Links Section */}
    {links && links.length > 0 && (
      <div className="mb-6">
        <div className="space-y-2">
          {links.map((link, idx) => (
            <Link 
              key={idx}
              href={link.href} 
              target="_blank"
              className={`flex items-center justify-between group px-4 py-3 rounded-lg transition-all duration-300 ${
                link.isPrimary 
                  ? 'bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:hover:bg-indigo-900/60 border border-indigo-300 dark:border-indigo-700' 
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center">
                {link.icon && React.cloneElement(link.icon, { className: 'mr-2 text-gray-500 dark:text-gray-400' })}
                <span className={`font-medium ${link.isPrimary ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}>
                  {link.text}
                </span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    )}

    {/* Detailed Steps Section */}
    {detailedSteps && detailedSteps.length > 0 && (
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
          <ChevronRight className="h-5 w-5 mr-2 text-indigo-500" />
          বিস্তারিত ধাপসমূহ:
        </h3>
        {detailedSteps.map((stepDetail, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              {stepDetail.title}
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              {stepDetail.content}
            </p>
            {stepDetail.content2 && (
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                {stepDetail.content2}
              </p>
            )}
            {stepDetail.code && (
              <div className="mt-3">
                {stepDetail.codeLabel && (
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {stepDetail.codeLabel}
                  </p>
                )}
                <div className="relative">
                  <code className="block bg-gray-900 dark:bg-black/50 p-4 rounded-lg text-sm font-mono text-green-400 border border-gray-700 overflow-x-auto">
                    <Terminal className="inline h-4 w-4 mr-2 text-gray-500" />
                    {stepDetail.code}
                  </code>
                </div>
              </div>
            )}
            {stepDetail.expectedOutput && (
              <div className="mt-2 flex items-start bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-2 rounded">
                <Play className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-800 dark:text-green-300">
                  <strong>প্রত্যাশিত ফলাফল:</strong> {stepDetail.expectedOutput}
                </p>
              </div>
            )}
            {stepDetail.tip && (
              <div className="mt-3 flex items-start bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-2 rounded">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800 dark:text-yellow-300">
                  <strong>টিপস:</strong> {stepDetail.tip}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    )}

    {/* Troubleshooting Section */}
    {troubleshooting && (
      <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-5">
        <h4 className="font-bold text-red-900 dark:text-red-300 mb-3 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {troubleshooting.title}
        </h4>
        <ul className="space-y-2">
          {troubleshooting.issues.map((issue, idx) => (
            <li key={idx} className="text-sm text-red-800 dark:text-red-300 flex items-start">
              <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
              <span>{issue}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Video Help Section */}
    {videoHelp && (
      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-5">
        <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center">
          <Play className="h-5 w-5 mr-2" />
          ভিডিও সাহায্য
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-300">
          {videoHelp}
        </p>
      </div>
    )}

    {/* Practice Goal Section */}
    {practiceGoal && (
      <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-5">
        <h4 className="font-bold text-green-900 dark:text-green-300 mb-3 flex items-center">
          <Check className="h-5 w-5 mr-2" />
          অনুশীলনের লক্ষ্য
        </h4>
        <p className="text-sm text-green-800 dark:text-green-300">
          {practiceGoal}
        </p>
      </div>
    )}

    {/* Coming Soon Section */}
    {comingSoon && (
      <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-5">
        <h4 className="font-bold text-yellow-900 dark:text-yellow-300 mb-3 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          আসছে শীঘ্রই
        </h4>
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          {comingSoon}
        </p>
      </div>
    )}
  </motion.div>
);

export default function BanglaScriptSetupPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gradient-to-br from-blue-50/55 to-indigo-100/30 dark:from-slate-900 dark:to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* --- Hero Section --- */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              বাংলাস্ক্রিপ্ট সেটআপ গাইড
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              বাংলায় প্রোগ্রামিং শুরু করার জন্য আপনার যা যা প্রয়োজন, তার সবকিছু ধাপে ধাপে এখানে সাজানো আছে। চলুন শুরু করা যাক!
            </p>
            <motion.div
              className="flex justify-center items-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <OpenInAI
                  pageUrl="https://bangla-script.vercel.app/installation"
                  customPrompt="Explain this web page in detail and guide me through the installation process step by step:"
                />

            </motion.div>
          </motion.div>

          {/* --- Steps Grid --- */}
          <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {setupSteps.map((step) => (
              <StepCard key={step.step} {...step} />
            ))}
          </motion.div>
          
          {/* --- Call to Action Section --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 120 }}
            className="text-center mt-20 p-10 bg-white dark:bg-gray-800/60 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">আপনি এখন প্রস্তুত!</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              সবকিছু সফলভাবে সেটআপ করা হয়েছে। এবার ডকুমেন্টেশন দেখে আপনার প্রথম বাংলা প্রোগ্রাম লেখার জন্য ঝাঁপিয়ে পড়ুন।
            </p>
            <Link 
              href="/docs" 
              className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              ডকুমেন্টেশন দেখুন
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

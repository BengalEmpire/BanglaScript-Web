"use client"


import { motion } from 'framer-motion';
import { Code, Download, Terminal, BookOpen, Play, Settings, List, User, BarChart, Calculator, Star, Computer } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Link from 'next/link';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";


const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => (
  <SyntaxHighlighter language={language} style={vscDarkPlus} className="rounded-lg overflow-hidden text-gray-800 bg-gray-50 dark:bg-gray-900">
    {code}
  </SyntaxHighlighter>
);

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-gray-50 font-sans">
      <Header/>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700&display=swap');
        body {
          font-family: 'Noto Sans Bengali', sans-serif;
        }
      `}</style>
      <header className="  py-12 text-center">
        <motion.h1 
          className="text-4xl font-bold mb-4"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          BanglaScript শেখার গাইড: নতুনদের জন্য ধাপে ধাপে
        </motion.h1>
        <motion.p 
          className="text-xl max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          হ্যালো! যদি তুমি প্রোগ্রামিং শিখতে চাও কিন্তু ইংরেজি কোড দেখে ভয় পাও, তাহলে <strong>BanglaScript</strong> তোমার জন্যই।
        </motion.p>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        <motion.section 
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold mb-4 flex items-center">
            <BookOpen className="mr-2 text-blue-600" /> প্রয়োজনীয় জিনিস (Prerequisites)
          </h2>
          <p>BanglaScript চালাতে তোমার কম্পিউটারে <strong>Node.js</strong> থাকতে হবে।</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Node.js ইনস্টল করো:</strong> ওয়েবসাইট থেকে ডাউনলোড করো: <a href="https://nodejs.org" className="text-blue-600 hover:underline">nodejs.org</a>।</li>
            <li>ইনস্টলের পর চেক করো: টার্মিনালে <code>node -v</code> টাইপ করো।</li>
          </ul>
        </motion.section>

        <motion.section 
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold mb-4 flex items-center">
            <Download className="mr-2 text-blue-600" /> BanglaScript ইনস্টল করা (Installation)
          </h2>
          <p>BanglaScript একটি NPM প্যাকেজ।</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>টার্মিনাল খুলো।</li>
            <li>টাইপ করো: <CodeBlock code={`npm i -g banglascript`} language="bash" /></li>
            <li>চেক করো: <code>bjs --version</code>।</li>
          </ol>
        </motion.section>

        <motion.section 
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold mb-4 flex items-center">
            <Settings className="mr-2 text-blue-600" /> একটি নতুন প্রোজেক্ট তৈরি করা (Project Setup)
          </h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>টাইপ করো: <CodeBlock code={`bjs init my-first-project`} language="bash" /></li>
            <li>প্রোজেক্টে ঢোকো: <CodeBlock code={`cd my-first-project`} language="bash" /></li>
          </ol>
        </motion.section>

        <motion.section 
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold mb-4 flex items-center">
            <Terminal className="mr-2 text-blue-600" /> কোড টেস্ট, বিল্ড এবং রান করা (Test, Build & Run)
          </h2>
          <ul className="space-y-4">
            <li><strong>রান করা:</strong> <CodeBlock code={`bjs run src/main.bjs`} language="bash" /></li>
            <li><strong>বিল্ড করা:</strong> <CodeBlock code={`bjs build src/main.bjs`} language="bash" /></li>
            <li><strong>ওয়াচ মোড:</strong> <CodeBlock code={`bjs watch src/main.bjs`} language="bash" /></li>
            <li><strong>কীওয়ার্ড দেখা:</strong> <CodeBlock code={`bjs keywords`} language="bash" /></li>
          </ul>
        </motion.section>

        <motion.section 
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold mb-4 flex items-center">
            <Play className="mr-2 text-blue-600" /> প্র্যাকটিস প্রোগ্রামসমূহ (Practice Programs)
          </h2>
          <p>নীচের উদাহরণগুলো কপি করে .bjs ফাইলে পেস্ট করো এবং চালাও।</p>

          {/* Practice 1 */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              <Code className="mr-2 text-blue-600" /> ১. হ্যালো বাংলা!
            </h3>
            <CodeBlock code={`লিখো("হ্যালো বাংলা বিশ্ব!");`} language="javascript" />
            <p className="mt-2"><strong>ব্যাখ্যা:</strong> `লিখো` হলো প্রিন্ট করার কমান্ড।</p>
            <p><strong>আউটপুট:</strong></p>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded">হ্যালো বাংলা বিশ্ব!</pre>
          </div>

          {/* Practice 2 */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              <Calculator className="mr-2 text-blue-600" /> ২. দুইটি সংখ্যার যোগফল
            </h3>
            <CodeBlock code={`সংখ্যা a = ১০;\nসংখ্যা b = ২০;\nসংখ্যা ফলাফল = a + b;\nলিখো("যোগফল: " + ফলাফল);`} language="javascript" />
            <p className="mt-2"><strong>ব্যাখ্যা:</strong> ভেরিয়েবল ব্যবহার করে যোগ।</p>
            <p><strong>আউটপুট:</strong></p>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded">যোগফল: 30</pre>
          </div>

          {/* Add similar blocks for other practices */}
          {/* Practice 3 */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              <BarChart className="mr-2 text-blue-600" /> ৩. যদি–নাহলে (Condition)
            </h3>
            <CodeBlock code={`সংখ্যা বয়স = ১৮;\nযদি (বয়স >= ১৮) {\n  লিখো("তুমি প্রাপ্তবয়স্ক!");\n} নাহলে {\n  লিখো("তুমি অপ্রাপ্তবয়স্ক!");\n}`} language="javascript" />
            <p className="mt-2"><strong>ব্যাখ্যা:</strong> কন্ডিশন চেক।</p>
            <p><strong>আউটপুট:</strong></p>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded">তুমি প্রাপ্তবয়স্ক!</pre>
          </div>

          {/* Practice 4 */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              <List className="mr-2 text-blue-600" /> ৪. লুপ ব্যবহার
            </h3>
            <CodeBlock code={`জন্য (সংখ্যা i = ০; i < ৫; i = i + ১) {\n  লিখো("গণনা: " + i);\n}`} language="javascript" />
            <p className="mt-2"><strong>ব্যাখ্যা:</strong> লুপ দিয়ে রিপিট।</p>
            <p><strong>আউটপুট:</strong></p>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded">গণনা: 0\nগণনা: 1\nগণনা: 2\nগণনা: 3\nগণনা: 4</pre>
          </div>

          {/* Practice 5 */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              <Settings className="mr-2 text-blue-600" /> ৫. অনুষ্ঠান (Function)
            </h3>
            <CodeBlock code={`অনুষ্ঠান বর্গ(x) {\n  প্রেরণ x * x;\n}\n\nলিখো(বর্গ(৫));`} language="javascript" />
            <p className="mt-2"><strong>ব্যাখ্যা:</strong> ফাংশন তৈরি।</p>
            <p><strong>আউটপুট:</strong></p>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded">25</pre>
          </div>

          {/* Practice 6 */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              <List className="mr-2 text-blue-600" /> ৬. তালিকা (Array)
            </h3>
            <CodeBlock code={`সংখ্যা ফলমূল = ["আম", "কলা", "লিচু"];\nলিখো("প্রথম ফল: " + ফলমূল[০]);`} language="javascript" />
            <p className="mt-2"><strong>ব্যাখ্যা:</strong> অ্যারে ব্যবহার।</p>
            <p><strong>আউটপুট:</strong></p>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded">প্রথম ফল: আম</pre>
          </div>

          {/* Practice 7 */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              <User className="mr-2 text-blue-600" /> ৭. সমাবেশ (Object)
            </h3>
            <CodeBlock code={`সংখ্যা ব্যক্তি = {\n  নাম: "রাহিম",\n  বয়স: ২২,\n  শহর: "ঢাকা"\n};\nলিখো("নাম: " + ব্যক্তি.নাম);\nলিখো("বয়স: " + ব্যক্তি.বয়স);`} language="javascript" />
            <p className="mt-2"><strong>ব্যাখ্যা:</strong> অবজেক্ট তৈরি।</p>
            <p><strong>আউটপুট:</strong></p>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded">নাম: রাহিম\nবয়স: 22</pre>
          </div>

          {/* Practice 8 */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              <Star className="mr-2 text-blue-600" /> ৮. ফাংশন থেকে শর্ত সহ রিটার্ন
            </h3>
            <CodeBlock code={`অনুষ্ঠান ধনাত্মক_নাকি(সংখ্যা) {\n  যদি (সংখ্যা > ০) {\n    প্রেরণ "ধনাত্মক";\n  } নাহলে {\n    প্রেরণ "ঋণাত্মক বা শূন্য";\n  }\n}\n\nলিখো(ধনাত্মক_নাকি(৫));\nলিখো(ধনাত্মক_নাকি(-৩));`} language="javascript" />
            <p className="mt-2"><strong>ব্যাখ্যা:</strong> কন্ডিশনাল রিটার্ন।</p>
            <p><strong>আউটপুট:</strong></p>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded">ধনাত্মক\nঋণাত্মক বা শূন্য</pre>
          </div>

          {/* Practice 9 */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              <Settings className="mr-2 text-blue-600" /> ৯. নেস্টেড লুপ
            </h3>
            <CodeBlock code={`জন্য (সংখ্যা i = ১; i <= ৩; i = i + ১) {\n  জন্য (সংখ্যা j = ১; j <= ২; j = j + ১) {\n    লিখো("i=" + i + ", j=" + j);\n  }\n}`} language="javascript" />
            <p className="mt-2"><strong>ব্যাখ্যা:</strong> লুপের মধ্যে লুপ।</p>
            <p><strong>আউটপুট:</strong></p>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded">i=1, j=1\ni=1, j=2\ni=2, j=1\ni=2, j=2\ni=3, j=1\ni=3, j=2</pre>
          </div>

          {/* Practice 10 */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              <Calculator className="mr-2 text-blue-600" /> ১০. গাণিতিক অপারেশন টেস্ট
            </h3>
            <CodeBlock code={`সংখ্যা x = ১০;\nসংখ্যা y = ৩;\nলিখো("যোগ: " + (x + y));\nলিখো("বিয়োগ: " + (x - y));\nলিখো("গুণ: " + (x * y));\nলিখো("ভাগ: " + (x / y));\nলিখো("ভাগশেষ: " + (x % y));`} language="javascript" />
            <p className="mt-2"><strong>ব্যাখ্যা:</strong> ম্যাথ অপারেটর।</p>
            <p><strong>আউটপুট:</strong></p>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded">যোগ: 13\nবিয়োগ: 7\nগুণ: 30\nভাগ: 3.3333333333333335\nভাগশেষ: 1</pre>
          </div>

          {/* Practice 11 */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-2 flex items-center">
              <Calculator className="mr-2 text-blue-600" /> ১১. BanglaScript Mini Project – ক্যালকুলেটর
            </h3>
            <CodeBlock code={`অনুষ্ঠান ক্যালকুলেটর(a, b, অপারেশন) {\n  যদি (অপারেশন == "+") {\n    প্রেরণ a + b;\n  } নাহলে যদি (অপারেশন == "-") {\n    প্রেরণ a - b;\n  } নাহলে যদি (অপারেশন == "*") {\n    প্রেরণ a * b;\n  } নাহলে যদি (অপারেশন == "/") {\n    প্রেরণ a / b;\n  } নাহলে {\n    প্রেরণ "অজানা অপারেশন";\n  }\n}\n\nলিখো(ক্যালকুলেটর(১০, ৫, "+"));\nলিখো(ক্যালকুলেটর(১০, ৫, "*"));`} language="javascript" />
            <p className="mt-2"><strong>ব্যাখ্যা:</strong> সিম্পল ক্যালকুলেটর।</p>
            <p><strong>আউটপুট:</strong></p>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded">15\n50</pre>
          </div>
        </motion.section>

        <motion.section 
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold mb-4 flex items-center">
            <BookOpen className="mr-2 text-blue-600" /> সমাপ্তি এবং পরবর্তী ধাপ
          </h2>
          <p>এই প্র্যাকটিসগুলো শেষ করলে তুমি BanglaScript-এর বেসিক আয়ত্তে আনবে।</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>অতিরিক্ত টিপস:</strong> এরর হলে লাইন চেক করো।</li>
            <li><strong>আরও শেখা:</strong> JavaScript টিউটোরিয়াল পড়ো।</li>
            <li><strong>হেল্প:</strong> GitHub-এ সার্চ করো।</li>
            <li><strong>আপডেট:</strong> <CodeBlock code={`npm update -g banglascript`} language="bash" /></li>
          </ul>
          <p className="mt-4 font-bold">BanglaScript — বাংলায় কোড লেখো, JavaScript চলে! 💡</p>
        </motion.section>
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
            <div className="flex justify-center text-center gap-4">
            <Link 
              href="/docs" 
              className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              ডকুমেন্টেশন দেখুন
            </Link>
              <Link 
              href="/playground" 
              className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Computer className="h-5 w-5 mr-2" />
              অনুশীলন করুন
            </Link>
            </div>
          </motion.div>
      </main>

      <Footer/>
    </div>
  );
}
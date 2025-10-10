"use client";

import { useState, useEffect, ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, RotateCcw, Copy, Check, Download, Lightbulb, Code2, Terminal, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { transpile, executeCode } from "@/lib/transpiler";
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from 'next/image'
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-okaidia.css';

Prism.languages.banglascript = {
  'comment': {
    pattern: /(^|[^\\:])\/\*[\s\S]*?(?:\*\/|$)|\/\/.*|^\/\/(?![\/*])/,
    lookbehind: true,
    greedy: true
  },
  'string': {
    pattern: /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\])*")|(?:'(?:\\(?:\r\n|[\s\S])|[^'\\])*')|(?:`(?:\\(?:\r\n|[\s\S])|[^`\\])*`)/,
    greedy: true,
    inside: {
      'interpolation': {
        pattern: /\$\{[^}]+\}/,
        inside: {
          'interpolation-punctuation': {
            pattern: /^\$\{|\}$/,
            alias: 'punctuation'
          },
          // Note: interpolation content would need to be banglascript, but for simplicity, use javascript
          rest: Prism.languages.javascript
        }
      }
    }
  },
  'keyword': {
    pattern: /(?<![a-zA-Z0-9_\u0980-\u09FF$])(বাক্য|শব্দ|সংখ্যা|ধ্রুবক|পরিবর্তনশীল|অনুষ্ঠান|ফাংশন|প্রেরণ|ফেরত|যদি|নাহলে|অন্যথায়|নাহলে_যদি|জন্য|যখন|করো|থামাও|চালিয়ে_যাও|লিখো|ছাপাও|সমস্যা_লিখো|সতর্কতা|তথ্য|শ্রেণী|নতুন|গঠন|এটি|বিস্তৃত|চেষ্টা|ধরো|অবশেষে|ফেলা|অ্যাসিঙ্ক|অপেক্ষা|প্রতিজ্ঞা)(?![a-zA-Z0-9_\u0980-\u09FF$])/,
  },
  'boolean': {
    pattern: /(?<![a-zA-Z0-9_\u0980-\u09FF$])(সত্য|মিথ্যা)(?![a-zA-Z0-9_\u0980-\u09FF$])/,
  },
  'null': {
    pattern: /(?<![a-zA-Z0-9_\u0980-\u09FF$])(শূন্য|অনির্ধারিত)(?![a-zA-Z0-9_\u0980-\u09FF$])/,
  },
  'number': {
    pattern: /(?<![a-zA-Z0-9_\u0980-\u09FF$])0[xX][0-9a-fA-F]+(?![a-zA-Z0-9_\u0980-\u09FF$])|(?<![a-zA-Z0-9_\u0980-\u09FF$])0[bB][01]+(?![a-zA-Z0-9_\u0980-\u09FF$])|(?<![a-zA-Z0-9_\u0980-\u09FF$])0[oO][0-7]+(?![a-zA-Z0-9_\u0980-\u09FF$])|(?:(?<![a-zA-Z0-9_\u0980-\u09FF$])[০-৯0-9]+(?:(?![a-zA-Z0-9_\u0980-\u09FF$])\.[০-৯0-9]*)?|(?<=\.)[০-৯0-9]+)(?:[eE][+-]?[০-৯0-9]+)?(?![a-zA-Z0-9_\u0980-\u09FF$])/,
  },
  'operator': /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\??|\.{0,}/,
  'punctuation': /[{}[\];(),.:]/,
  'atrule': {
    pattern: /@[\w-]{0,}/,
    alias: 'keyword'
  },
  'function': /(?!\d)[\u0980-\u09FF\w$]+(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  'constant': /\b[A-Z][A-Z\d_]*\b/
};

interface TranspileResult {
  success: boolean;
  output?: string;
  error?: string;
}

interface ExecuteResult {
  success: boolean;
  output?: string;
  error?: string;
}

interface Example {
  title: string;
  code: string;
}

const examples: Example[] = [
  {
    title: "হ্যালো ওয়ার্ল্ড",
    code: `লিখো("হ্যালো, বিশ্ব! 🌍");
লিখো("BanglaScript এ স্বাগতম!");`
  },
  {
    title: "ভেরিয়েবল ও ফাংশন",
    code: `শব্দ নাম = "মাহমুদ";
সংখ্যা বয়স = ২০;
পরিবর্তনশীল পেশা = "একজন কম্পিউটার প্রোগ্রামার"
অনুষ্ঠান পরিচয়() {
    লিখো("নাম: " + নাম);
    লিখো("বয়স: " + বয়স);
    লিখো("পেশা: " + পেশা);
}
পরিচয়();`
  },
  {
    title: "কন্ডিশনাল",
    code: `সংখ্যা নম্বর = ৮৫;
যদি (নম্বর >= ৮০) {
    লিখো("গ্রেড: A+ 🎉");
} নাহলে যদি (নম্বর >= ৬০) {
    লিখো("গ্রেড: B ✓");
} নাহলে {
    লিখো("আরো চেষ্টা করুন! 💪");
}`
  },
  {
    title: "লুপ",
    code: `লিখো("🔢 সংখ্যা গণনা:");
জন্য (সংখ্যা i = ১; i <= ৫; i++) {
    লিখো("→ সংখ্যা: " + i);
}
লিখো("\\n✨ সম্পন্ন!");`
  },
  {
    title: "অ্যারে",
    code: `শব্দ ফল = ["আম", "কলা", "আপেল", "কমলা"];
লিখো("🍎 ফলের তালিকা:");
জন্য (সংখ্যা i = ০; i < ফল.length; i++) {
    লিখো((i + ১) + ". " + ফল[i]);
}`
  },
  {
    title: "রিকার্সন",
    code: `অনুষ্ঠান ফ্যাক্টরিয়াল(n) {
    যদি (n <= ১) {
        প্রেরণ ১;
    }
    প্রেরণ n * ফ্যাক্টরিয়াল(n - ১);
}
সংখ্যা মান = ৫;
সংখ্যা ফলাফল = ফ্যাক্টরিয়াল(মান);
লিখো("ফ্যাক্টরিয়াল মান = " + ফলাফল);`
  }
];

interface CodeEditorProps {
  value: string;
  onChange: (newValue: string) => void;
}

function CodeEditor({ value, onChange }: CodeEditorProps) {
  const [lineCount, setLineCount] = useState<number>(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines);
  }, [value]);

  const highlighted = Prism.highlight(value, Prism.languages.banglascript, 'banglascript');

  return (
    <div className="relative flex h-full bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-xl ring-1 ring-gray-700/50">
      <div className="flex-shrink-0 bg-gray-800 text-gray-400 text-right pr-4 pl-3 py-4 select-none border-r border-gray-700 font-mono text-sm leading-6 overflow-hidden">
        {Array.from({ length: Math.max(lineCount, 15) }, (_, i) => (
          <div key={i} className="h-6 hover:text-gray-300 transition-colors">{i + 1}</div>
        ))}
      </div>
      <div className="flex-1 relative">
        <div ref={highlightRef} className="absolute top-0 left-0 w-full h-full overflow-auto p-4 pointer-events-none text-gray-100">
          <pre className="font-mono text-sm leading-6">
            <code dangerouslySetInnerHTML={{__html: highlighted}} />
          </pre>
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          onScroll={() => {
            if (textareaRef.current && highlightRef.current) {
              highlightRef.current.scrollTop = textareaRef.current.scrollTop;
              highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
            }
          }}
          className="absolute top-0 left-0 w-full h-full bg-transparent text-transparent caret-blue-400 p-4 font-mono text-sm leading-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-gray-500"
          spellCheck={false}
          placeholder="এখানে BanglaScript কোড লিখুন..."
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  );
}

export default function PlaygroundPage() {
  const [banglaCode, setBanglaCode] = useState<string>(examples[1].code);
  const [jsCode, setJsCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("javascript");
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const handleTranspile = () => {
    setIsProcessing(true);
    const startTime = performance.now();
    const result: TranspileResult = transpile(banglaCode);
    const endTime = performance.now();
    if (result.success) {
      setJsCode(result.output || "");
      setError("");
      setExecutionTime(endTime - startTime);
    } else {
      setError(result.error || "Transpilation failed");
      setJsCode("");
    }
    setOutput("");
    setIsProcessing(false);
    setActiveTab("javascript");
  };

  const handleRun = () => {
    setIsProcessing(true);
    const startTime = performance.now();
    const transpileResult: TranspileResult = transpile(banglaCode);
    if (transpileResult.success) {
      setJsCode(transpileResult.output || "");
      const executeResult: ExecuteResult = executeCode(transpileResult.output || "");
      const endTime = performance.now();
      if (executeResult.success) {
        setOutput(executeResult.output || "");
        setError("");
        setExecutionTime(endTime - startTime);
      } else {
        setError(executeResult.error || "Execution failed");
        setOutput("");
      }
    } else {
      setError(transpileResult.error || "Transpilation failed");
    }
    setIsProcessing(false);
    setActiveTab("console");
  };

  const handleReset = () => {
    setBanglaCode(examples[1].code);
    setJsCode("");
    setOutput("");
    setError("");
    setExecutionTime(null);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsCode], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.js";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br from-gray-900 to-gray-800">
      <Header/>
      {/* Header */}
      <header className="border-b border-gray-700 bg-white dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-black rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white text-lg font-bold">ব</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-300">
                  BanglaScript Playground
                </h1>
                <p className="text-sm text-gray-800 dark:text-gray-300">
                  বাংলায় প্রোগ্রামিং করুন •
                  <a href="https://www.npmjs.com/package/banglascript" target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-400 hover:underline">
                    NPM প্যাকেজ দেখুন
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-yellow-900/90 text-yellow-300 text-xs font-medium rounded-full border border-yellow-600/80 shadow">
                ⚠️ ডেভেলপমেন্ট মোড
              </span>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        {/* Examples Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">উদাহরণ দেখুন:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setBanglaCode(example.code);
                  setJsCode("");
                  setOutput("");
                  setError("");
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 hover:bg-gray-700 transition-all shadow-md hover:shadow-blue-500/20"
              >
                {example.title}
              </motion.button>
            ))}
          </div>
        </motion.div>
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-wrap gap-3 items-center bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-md"
        >
          <Button
            onClick={handleRun}
            disabled={isProcessing}
            className="bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/30"
          >
            <Play className="mr-2 h-4 w-4" />
            {isProcessing ? 'প্রসেসিং...' : 'কোড চালান'}
          </Button>
          <Button
            onClick={handleTranspile}
            disabled={isProcessing}
            variant="outline"
            className="border border-green-500 dark:border-green-600 text-gray-800 bg-white dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-900/10 hover:text-white"
          >
            <Code2 className="mr-2 h-4 w-4" />
            শুধু Transpile করুন
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="border border-green-400 dark:border-green-500 text-gray-800 dark:text-gray-200 hover:text-gray-200 dark:bg-gray-600 hover:bg-gray-700"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            রিসেট
          </Button>
          {jsCode && (
            <>
              <Button
                onClick={handleCopy}
                variant="outline"
                className="border border-green-400 dark:border-green-500 text-gray-800 dark:text-gray-200 hover:text-gray-200 dark:bg-gray-600 hover:bg-gray-700"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-400" />
                    <span className="text-green-400">কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    JS কপি করুন
                  </>
                )}
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="border border-green-400 dark:border-green-500 text-gray-800 dark:text-gray-200 hover:text-gray-200 dark:bg-gray-600 hover:bg-gray-700"
              >
                <Download className="mr-2 h-4 w-4" />
                ডাউনলোড
              </Button>
            </>
          )}
          {executionTime !== null && (
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-gray-700 rounded-lg">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-gray-200">
                {executionTime.toFixed(2)}ms
              </span>
            </div>
          )}
        </motion.div>
        {/* Editor Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Editor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center shadow-md shadow-blue-500/30">
                <span className="text-white text-sm font-bold">ব</span>
              </div>
              <h2 className="text-lg font-bold text-gray-600 dark:text-gray-100">BanglaScript Code</h2>
            </div>
            <div className="h-[650px]">
              <CodeEditor value={banglaCode} onChange={setBanglaCode} />
            </div>
          </motion.div>
          {/* Output Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-600 dark:text-gray-100">আউটপুট</h2>
                <TabsList className="bg-gray-700 p-1 rounded-lg">
                  <TabsTrigger
                    value="javascript"
                    className="data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-md px-4 text-gray-300 data-[state=active]:text-gray-100"
                  >
                    <Image
                      src="/assets/javascript-svgrepo-com.svg"
                      width={20}
                      height={20}
                      alt="Js-Code-Logo"
                      />
                    JavaScript
                  </TabsTrigger>
                  <TabsTrigger
                    value="console"
                    className="data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm rounded-md px-4 text-gray-300 data-[state=active]:text-gray-100"
                  >
                    <Terminal className="h-4 w-4 mr-2" />
                    Console
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="javascript" className="flex-1 mt-0">
                <div className="h-[650px] bg-gray-900 border border-gray-700 rounded-xl overflow-auto shadow-xl ring-1 ring-gray-700/50">
                  {jsCode ? (
                    <pre className="p-4 font-mono text-sm leading-6 text-gray-100">
                      <code dangerouslySetInnerHTML={{__html: Prism.highlight(jsCode, Prism.languages.javascript, 'javascript')}} />
                    </pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 p-6">
                      <Code2 className="h-16 w-16 mb-4 opacity-30" />
                      <p className="text-center">
                        Transpiled JavaScript এখানে দেখাবে...<br/>
                        <span className="text-xs">কোড লিখে "Transpile করুন" বাটনে ক্লিক করুন</span>
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="console" className="flex-1 mt-0">
                <div className="h-[650px] bg-gray-900 border border-gray-700 rounded-xl p-6 font-mono text-sm overflow-auto shadow-xl ring-1 ring-gray-700/50">
                  <AnimatePresence mode="wait">
                    {error ? (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-900/30 border border-red-700/50 rounded-lg p-4"
                      >
                        <pre className="text-red-300 whitespace-pre-wrap">
                          ❌ Error: {error}
                        </pre>
                      </motion.div>
                    ) : output ? (
                      <motion.div
                        key="output"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-green-900/30 border border-green-700/50 rounded-lg p-4"
                      >
                        <pre className="text-green-300 whitespace-pre-wrap">
                          {output}
                        </pre>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col items-center justify-center text-gray-400"
                      >
                        <Terminal className="h-16 w-16 mb-4 opacity-30" />
                        <p className="text-center">
                          Console আউটপুট এখানে দেখাবে...<br/>
                          <span className="text-xs">"কোড চালান" বাটনে ক্লিক করে শুরু করুন</span>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
"use client";

import { useState, useEffect, ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, RotateCcw, Copy, Check, Download, Lightbulb, Code2, Terminal, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { transpile, executeCode, tokenizePreserve, KEYWORDS } from "@/lib/transpiler";
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from 'next/image'
import '@/styles/playground-theme.css'

const JS_KEYWORDS = [
  'let', 'var', 'const', 'function', 'return', 'if', 'else', 'while', 'for', 'do',
  'break', 'continue', 'new', 'class', 'constructor', 'true', 'false', 'null',
  'undefined', 'try', 'catch', 'finally', 'throw', 'await', 'async', 'switch',
  'case', 'default', 'import', 'export', 'from', 'as', 'delete', 'in', 'of',
  'this', 'extends', 'static', 'console'
];

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function highlightBangla(code: string): string {
  const tokens = tokenizePreserve(code);
  return tokens.map(t => {
    let className = '';
    if (t.type === 'comment') className = 'text-green-600 italic';
    else if (t.type === 'string') className = 'text-emerald-400';
    else if (t.type === 'number') className = 'text-amber-400';
    else if (t.type === 'word') {
      if (KEYWORDS[t.text.normalize('NFC')]) className = 'text-purple-400 font-semibold'; 
      else className = 'text-blue-300';
    } else {
      className = 'text-gray-300';
    }
    return `<span class="${className}">${escapeHtml(t.text)}</span>`;
  }).join('');
}

function highlightJS(code: string): string {
  const tokens = tokenizePreserve(code);
  return tokens.map(t => {
    let className = '';
    if (t.type === 'comment') className = 'text-green-600 italic';
    else if (t.type === 'string') className = 'text-green-400';
    else if (t.type === 'number') className = 'text-yellow-400';
    else if (t.type === 'word') {
      if (JS_KEYWORDS.includes(t.text)) className = 'text-blue-400';
      else className = 'text-blue-300';
    } else {
      className = 'text-pink-400'; // symbols
    }
    return `<span class="${className}">${escapeHtml(t.text)}</span>`;
  }).join('');
}

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
    title: "ভেরিয়েবল ও ফাংশন",
    code: `ব্যাক্তি নাম = "মাহমুদ";
পরিবর্তনশীল বয়স = ২০;
বাক্য পেশা = "একজন কম্পিউটার প্রোগ্রামার"

অনুষ্ঠান পরিচয়() {
    লিখো("নাম: " + নাম);
    লিখো("বয়স: " + বয়স);
    লিখো("পেশা: " + পেশা);
}
পরিচয়();`
  },
  {
    title: "হ্যালো ওয়ার্ল্ড",
    code: `লিখো("হ্যালো, বিশ্ব! 🌍");
লিখো("BanglaScript এ স্বাগতম!");`
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
  },{
  title: "গ্রেড নির্ণায়ক",
  code: `ফাংশন শিক্ষার্থী_তালিকা() {
    প্রেরণ [
        { নাম: "রাহিম", নম্বর: ৮৫ },
        { নাম: "করিম", নম্বর: ৭২ },
        { নাম: "সাবিনা", নম্বর: ৫৫ }
    ];
}

ফাংশন গ্রেড_গণনা(তালিকা) {
    জন্য ( শিক্ষার্থী মধ্য তালিকা) {
        সংখ্যা নম্বর = শিক্ষার্থী.নম্বর;

        যদি (নম্বর >= ৮০) {
            শিক্ষার্থী.গ্রেড = "A+ 🎉";
        } নাহলে যদি (নম্বর >= ৬০) {
            শিক্ষার্থী.গ্রেড = "B ✓";
        } নাহলে {
            শিক্ষার্থী.গ্রেড = "আরো চেষ্টা করুন! 💪";
        }

        লিখো(শিক্ষার্থী.নাম + " পেয়েছে " + নম্বর + " নাম্বার — গ্রেড: " + শিক্ষার্থী.গ্রেড);
    }
}

// মূল প্রোগ্রাম চালানো
সংখ্যা শিক্ষার্থীরা = শিক্ষার্থী_তালিকা();
গ্রেড_গণনা(শিক্ষার্থীরা);
`}
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

  const highlighted = highlightBangla(value);

  return (
    <div className="relative flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 border border-gray-700/50 rounded-lg overflow-hidden shadow-2xl">
      {/* Editor Header Bar */}
      <div className="flex-shrink-0 bg-gray-800/40 backdrop-blur-sm border-b border-gray-700/50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer"></div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Code2 className="h-3.5 w-3.5" />
            <span className="font-mono">main.bjs</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[10px] text-gray-500 font-mono">
            {lineCount} {lineCount === 1 ? 'line' : 'lines'}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#F7DF1E] animate-pulse"></div>
            <span className="text-[10px] text-gray-500 font-mono">BanglaScript</span>
          </div>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line Numbers with Gutter */}
        <div className="flex-shrink-0 bg-gray-800/30 text-gray-500 text-right pr-4 pl-3 py-4 select-none border-r border-gray-700/30 font-mono text-sm leading-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-gray-900/50 to-transparent pointer-events-none"></div>
          {Array.from({ length: Math.max(lineCount, 15) }, (_, i) => (
            <div 
              key={i} 
              className="h-6 hover:text-gray-300 transition-colors relative group"
            >
              <span className="relative z-10">{i + 1}</span>
              <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors -ml-3 -mr-4"></div>
            </div>
          ))}
          <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-gray-900/50 to-transparent pointer-events-none"></div>
        </div>

        {/* Code Area */}
        <div className="flex-1 relative">
          {/* Syntax Highlighted Layer */}
          <div ref={highlightRef} className="absolute top-0 left-0 w-full h-full overflow-auto p-4 pointer-events-none text-gray-100">
            <pre className="font-mono text-sm leading-6 min-h-full">
              <code dangerouslySetInnerHTML={{__html: highlighted }} />
            </pre>
          </div>

          {/* Textarea Input Layer */}
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
            className="absolute top-0 left-0 w-full h-full bg-transparent text-transparent caret-blue-400 p-4 font-mono text-sm leading-6 resize-none focus:outline-none selection:bg-blue-500/30 placeholder:text-gray-600"
            spellCheck={false}
            placeholder="এখানে BanglaScript কোড লিখুন..."
            style={{ tabSize: 2 }}
          />

          {/* Focus Ring Overlay */}
          <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-transparent transition-all duration-200 focus-within:ring-blue-500/30 rounded-sm"></div>

          {/* Gradient Overlays for Depth */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-gray-900/30 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-gray-900/30 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex-shrink-0 bg-gray-800/40 backdrop-blur-sm border-t border-gray-700/50 px-4 py-1.5 flex items-center justify-between text-[10px] text-gray-500 font-mono">
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
            BanglaScript
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>Ln {lineCount}, Col 1</span>
          <span>Node server running</span>
        </div>
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
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-gray-700 rounded-lg hover:border-green-500 hover:bg-gray-700 transition-all shadow-md hover:shadow-green-500/20 cursor-progress shodow-[#F9EA75]"
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
              <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center shadow-md shadow-[#F7DF1E]">
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
              <div className="mb-3 flex items-center justify-between border-b border-gray-700/50 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-300 tracking-wide">আউটপুট</h2>
                </div>
                <TabsList className="bg-gray-800/60 backdrop-blur-sm p-0.5 rounded-lg border border-gray-700/50 shadow-lg">
                  <TabsTrigger
                    value="javascript"
                    className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#00A63E] data-[state=active]:to-[#00C951] data-[state=active]:shadow-md rounded-md px-3 py-1.5 text-xs font-medium text-gray-400 data-[state=active]:text-white transition-all duration-200 flex items-center gap-2"
                  >
                    <Image
                      src="/assets/javascript-svgrepo-com.svg"
                      width={16}
                      height={16}
                      alt="Js-Code-Logo"
                      className="opacity-80"
                    />
                    JavaScript
                  </TabsTrigger>
                  <TabsTrigger
                    value="console"
                    className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#00C951] data-[state=active]:to-emerald-700 data-[state=active]:shadow-md rounded-md px-3 py-1.5 text-xs font-medium text-gray-400 data-[state=active]:text-white transition-all duration-200 flex items-center gap-2"
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    Console
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="javascript" className="flex-1 mt-0">
                <div className="h-[650px] bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 border border-gray-700/50 rounded-lg overflow-hidden shadow-2xl relative">
                  {/* Editor header bar */}
                  <div className="bg-gray-800/40 backdrop-blur-sm border-b border-gray-700/50 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                       <Image
                      src="/assets/javascript-logo-svgrepo-com.svg"
                      width={12}
                      height={12}
                      alt="Js-Logo"
                    />
                      <span className="font-mono">output.js</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer"></div>
                        </div>
                        </div>
                    </div>
                  </div>
                  
                  {/* Code content */}
                  <div className="h-[calc(100%-40px)] overflow-auto">
                    {jsCode ? (
                      <div className="relative">
                        {/* Line numbers */}
                        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-800/30 border-r border-gray-700/30 flex flex-col items-end pr-3 py-4 font-mono text-xs text-gray-500 select-none">
                          {jsCode.split('\n').map((_, i) => (
                            <div key={i} className="leading-6">{i + 1}</div>
                          ))}
                        </div>
                        <pre className="pl-16 pr-4 py-4 font-mono text-sm leading-6 text-gray-100">
                          <code dangerouslySetInnerHTML={{__html: highlightJS(jsCode)}} />
                        </pre>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-500 p-6">
                        <div className="relative mb-6">
                          <Code2 className="h-20 w-20 opacity-20" />
                          <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full"></div>
                        </div>
                        <p className="text-center text-sm">
                          <span className="text-gray-400 font-medium">Transpiled JavaScript এখানে দেখাবে</span><br/>
                          <span className="text-xs text-gray-600 mt-2 inline-block">কোড লিখে "Transpile করুন" বাটনে ক্লিক করুন</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="console" className="flex-1 mt-0">
                <div className="h-[650px] bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 border border-gray-700/50 rounded-lg overflow-hidden shadow-2xl relative">
                  {/* Console header bar */}
                  <div className="bg-gray-800/40 backdrop-blur-sm border-b border-gray-700/50 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Terminal className="h-3.5 w-3.5" />
                      <span className="font-mono">console</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-600 font-mono">Ready</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Console content */}
                  
                  <div className="h-[calc(100%-40px)] p-4 font-mono text-sm overflow-auto bg-black/40">
                    <AnimatePresence mode="wait">
                      {error ? (
                        <motion.div
                          key="error"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-1"
                        >
                          <div className="flex items-start gap-2 text-gray-400">
                            <span className="text-emerald-400">➜</span>
                            <span className="text-sky-400">~</span>
                            <span>node script.js</span>
                          </div>
                          <div className="pl-4 border-l-2 border-red-500/50 ml-1">
                            <div className="text-red-400 font-semibold mb-1">Error:</div>
                            <pre className="text-red-300/90 whitespace-pre-wrap leading-relaxed">
                            {error}
                            </pre>
                          </div>
                          <div className="flex items-start gap-2 text-gray-600 mt-3">
                            <span className="text-red-400">✗</span>
                            <span>Process exited with code 1</span>
                          </div>
                        </motion.div>
                      ) : output ? (
                        <motion.div
                          key="output"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-1"
                        >
                          <div className="flex items-start gap-2 text-gray-400 mb-2">
                            <span className="text-emerald-400">➜</span>
                            <span className="text-sky-400">~</span>
                            <span>node output.js</span>
                          </div>
                          <pre className="text-gray-200 whitespace-pre-wrap leading-relaxed pl-4">
                            {output}
                          </pre>
                          <div className="flex items-start gap-2 text-gray-600 mt-3">
                            <span className="text-emerald-400">✓</span>
                            <span>Process exited! within  {executionTime.toFixed(2)}ms
                          </span>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-full  text-gray-500 space-y-2"
                        >
                          <div className="flex flex-col items-start justify-start">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Terminal className="h-4 w-4" />
                            <span className="text-xs">BanglaScript Terminal v1.0.0</span>
                          </div>
                          <div className="w-full border-t border-gray-800 my-2"></div>
                          <div className="flex items-start gap-2 text-gray-500">
                            <span className="text-gray-600">➜</span>
                            <span className="text-gray-700">~</span>
                            <span className="text-gray-600">_</span>
                          </div>
                          </div>
                          <div className="mt-20 items-enter justify-center">
                          <div className="h-full flex flex-col items-center justify-center text-gray-500 p-6">
                        <div className="relative mb-6">
                          <Terminal className="h-20 w-20 opacity-25" />
                          <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full"></div>
                        </div>
                        <p className="text-center text-sm">
                          <span className="text-gray-400 font-medium">কোড রান করতে "কোড চালান" বাটনে ক্লিক করুন </span><br/>
                          <span className="text-xs text-gray-600 mt-2 inline-block">Waiting for execution...</span>
                        </p>
                      </div>
                      </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
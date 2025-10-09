"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, RotateCcw, Copy, Check, Download, Lightbulb, Code2, Terminal, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { transpile, executeCode } from "@/lib/transpiler";
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

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
ধ্রুবক বয়স = ২০;
পরিবর্তনশীল পেশা = "একজন কম্পিউটার প্রোগ্রামার"
অনুষ্ঠান পরিচয়(ব্যক্তি) {
    লিখো("নাম: " + ব্যক্তি);
    লিখো("বয়স: " + বয়স);
    লিখো("পেশা: " + পেশা);
}
পরিচয়(নাম);`
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

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines);
  }, [value]);

  return (
    <div className="relative flex h-full bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="flex-shrink-0 bg-gray-900 text-gray-500 text-right pr-4 pl-3 py-4 select-none border-r border-gray-800 font-mono text-sm leading-6">
        {Array.from({ length: Math.max(lineCount, 15) }, (_, i) => (
          <div key={i} className="h-6 hover:text-gray-400 transition-colors">{i + 1}</div>
        ))}
      </div>
      <textarea
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        className="flex-1 bg-gray-950 text-gray-100 p-4 font-mono text-sm leading-6 resize-none focus:outline-none placeholder:text-gray-600"
        spellCheck={false}
        placeholder="এখানে BanglaScript কোড লিখুন..."
        style={{ tabSize: 2 }}
      />
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header/>
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-black rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">ব</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  BanglaScript Playground
                </h1>
                <p className="text-sm text-gray-600">
                  বাংলায় প্রোগ্রামিং করুন •
                  <a href="https://www.npmjs.com/package/banglascript" target="_blank" rel="noopener noreferrer" className="ml-1 text-emerald-600 hover:underline">
                    NPM প্যাকেজ দেখুন
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full border border-yellow-200">
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
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-semibold text-gray-700">উদাহরণ দেখুন:</span>
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
                className="px-4 py-2 text-sm font-medium bg-white border-2 border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-sm"
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
          className="mb-6 flex flex-wrap gap-3 items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
        >
          <Button
            onClick={handleRun}
            disabled={isProcessing}
            className="bg-black text-white hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/30"
          >
            <Play className="mr-2 h-4 w-4" />
            {isProcessing ? 'প্রসেসিং...' : 'কোড চালান'}
          </Button>
          <Button
            onClick={handleTranspile}
            disabled={isProcessing}
            variant="outline"
            className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            <Code2 className="mr-2 h-4 w-4" />
            শুধু Transpile করুন
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-2 border-gray-300 hover:bg-gray-50"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            রিসেট
          </Button>
          {jsCode && (
            <>
              <Button
                onClick={handleCopy}
                variant="outline"
                className="border-2 border-gray-300 hover:bg-gray-50"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-600" />
                    <span className="text-green-600">কপি হয়েছে!</span>
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
                className="border-2 border-gray-300 hover:bg-gray-50"
              >
                <Download className="mr-2 h-4 w-4" />
                ডাউনলোড
              </Button>
            </>
          )}
          {executionTime !== null && (
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <Zap className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-700">
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
              <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-bold">ব</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">BanglaScript Code</h2>
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
                <h2 className="text-lg font-bold text-gray-800">আউটপুট</h2>
                <TabsList className="bg-gray-200 p-1 rounded-lg">
                  <TabsTrigger
                    value="javascript"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4"
                  >
                    <Code2 className="h-4 w-4 mr-2" />
                    JavaScript
                  </TabsTrigger>
                  <TabsTrigger
                    value="console"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4"
                  >
                    <Terminal className="h-4 w-4 mr-2" />
                    Console
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="javascript" className="flex-1 mt-0">
                <div className="h-[650px] bg-gray-950 border border-gray-800 rounded-xl p-6 overflow-auto shadow-2xl">
                  {jsCode ? (
                    <pre className="text-gray-100 font-mono text-sm leading-6">
                      <code>{jsCode}</code>
                    </pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <Code2 className="h-16 w-16 mb-4 opacity-20" />
                      <p className="text-center">
                        Transpiled JavaScript এখানে দেখাবে...<br/>
                        <span className="text-xs">কোড লিখে "Transpile করুন" বাটনে ক্লিক করুন</span>
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="console" className="flex-1 mt-0">
                <div className="h-[650px] bg-gray-950 border border-gray-800 rounded-xl p-6 font-mono text-sm overflow-auto shadow-2xl">
                  <AnimatePresence mode="wait">
                    {error ? (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
                      >
                        <pre className="text-red-400 whitespace-pre-wrap">
                          ❌ Error: {error}
                        </pre>
                      </motion.div>
                    ) : output ? (
                      <motion.div
                        key="output"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
                      >
                        <pre className="text-green-400 whitespace-pre-wrap">
                          {output}
                        </pre>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col items-center justify-center text-gray-500"
                      >
                        <Terminal className="h-16 w-16 mb-4 opacity-20" />
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
// app/playground/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, RotateCcw, Copy, Check, Download, Lightbulb, Code2, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OpenInAI from "@/components/OpenInChatGPT";
import { transpile, executeCode } from "@/lib/transpiler";
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface Example {
  title: string;
  code: string;
}

const examples: Example[] = [
  {
    title: "Hello World",
    code: `লিখো("হ্যালো, বিশ্ব!");
লিখো("Welcome to BanglaScript!");`
  },
  {
    title: "Variables & Functions",
    code: `সংখ্যা নাম = "রহিম";
ধ্রুবক বয়স = ২৫;
অনুষ্ঠান পরিচয়(ব্যক্তি) {
    লিখো("নাম: " + ব্যক্তি);
    লিখো("বয়স: " + বয়স);
}
পরিচয়(নাম);`
  },
  {
    title: "Conditionals",
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
    title: "Loops",
    code: `লিখো("🔢 সংখ্যা গণনা:");
জন্য (সংখ্যা i = ১; i <= ৫; i++) {
    লিখো("→ সংখ্যা: " + i);
}
লিখো("\\n✨ সম্পন্ন!");`
  },
  {
    title: "Arrays",
    code: `শব্দ ফল = ["আম", "কলা", "আপেল", "কমলা"];
লিখো("🍎 ফলের তালিকা:");
জন্য (সংখ্যা i = ০; i < ফল.length; i++) {
    লিখো((i + ১) + ". " + ফল[i]);
}`
  },
  {
    title: "Advanced Example",
    code: `অনুষ্ঠান ফ্যাক্টরিয়াল(n) {
    যদি (n <= ১) {
        প্রেরণ ১;
    }
    প্রেরণ n * ফ্যাক্টরিয়াল(n - ১);
}
সংখ্যা সংখ্যা = ৫;
সংখ্যা ফলাফল = ফ্যাক্টরিয়াল(সংখ্যা);
লিখো(সংখ্যা + " এর ফ্যাক্টরিয়াল = " + ফলাফল);`
  }
];

const defaultCode = examples[1].code;

function CodeEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [lineCount, setLineCount] = useState(1);
  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines);
  }, [value]);
  return (
    <div className="relative flex h-full bg-black border border-gray-800 rounded-lg overflow-hidden">
      <div className="flex-shrink-0 bg-gray-950 text-gray-600 text-right pr-3 pl-2 py-3 select-none border-r border-gray-800 font-mono text-sm leading-6">
        {Array.from({ length: Math.max(lineCount, 10) }, (_, i) => (
          <div key={i} className="h-6">{i + 1}</div>
        ))}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-black text-gray-100 p-3 font-mono text-sm leading-6 resize-none focus:outline-none"
        spellCheck={false}
        style={{ tabSize: 2 }}
      />
    </div>
  );
}

export default function PlaygroundPage() {
  const [banglaCode, setBanglaCode] = useState(defaultCode);
  const [jsCode, setJsCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("javascript");
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const handleTranspile = () => {
    setIsProcessing(true);
    const startTime = performance.now();
   
    const result = transpile(banglaCode);
    const endTime = performance.now();
   
    if (result.success) {
      setJsCode(result.output);
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
   
    const transpileResult = transpile(banglaCode);
    if (!transpileResult.success) {
      setError(transpileResult.error || "Transpilation failed");
      setIsProcessing(false);
      setActiveTab("console");
      return;
    }
    setJsCode(transpileResult.output);
    const executeResult = executeCode(transpileResult.output);
    const endTime = performance.now();
    if (executeResult.success) {
      setOutput(executeResult.output);
      setError("");
      setExecutionTime(endTime - startTime);
    } else {
      setError(executeResult.error || "Execution failed");
      setOutput("");
    }
   
    setIsProcessing(false);
    setActiveTab("console");
  };

  const handleReset = () => {
    setBanglaCode(defaultCode);
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
    <div className="min-h-screen bg-white text-black">
      < Header />
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold">BanglaScript Playground</h1>
                <p className="text-sm text-gray-600">Write and execute BanglaScript in real-time <span className="underline decoration-pink-500">Under development</span></p>
              </div>
            </div>
            <OpenInAI pageUrl={typeof window !== 'undefined' ? window.location.href : ''} />
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-6">
        {/* Examples Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4" />
            <span className="text-sm font-medium">Quick Examples:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setBanglaCode(example.code)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                {example.title}
              </button>
            ))}
          </div>
        </motion.div>
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-wrap gap-3 items-center"
        >
          <Button
            onClick={handleRun}
            disabled={isProcessing}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Play className="mr-2 h-4 w-4" />
            {isProcessing ? 'Processing...' : 'Run Code'}
          </Button>
          <Button
            onClick={handleTranspile}
            disabled={isProcessing}
            variant="outline"
            className="border-gray-300"
          >
            <Code2 className="mr-2 h-4 w-4" />
            Transpile Only
          </Button>
          <Button onClick={handleReset} variant="outline" className="border-gray-300">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          {jsCode && (
            <>
              <Button onClick={handleCopy} variant="outline" className="border-gray-300">
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? "Copied!" : "Copy JS"}
              </Button>
              <Button onClick={handleDownload} variant="outline" className="border-gray-300">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </>
          )}
          {executionTime !== null && (
            <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
              <span>{executionTime.toFixed(2)}ms</span>
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
            <div className="mb-3 flex items-center gap-2">
              <div className="h-6 w-6 bg-black rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">বা</span>
              </div>
              <h2 className="text-lg font-semibold">BanglaScript Code</h2>
            </div>
            <div className="h-[600px]">
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
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Output</h2>
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="javascript" className="data-[state=active]:bg-white">
                    <Code2 className="h-4 w-4 mr-2" />
                    JavaScript
                  </TabsTrigger>
                  <TabsTrigger value="console" className="data-[state=active]:bg-white">
                    <Terminal className="h-4 w-4 mr-2" />
                    Console
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="javascript" className="flex-1 mt-0">
                <div className="h-[600px] bg-black border border-gray-800 rounded-lg p-4 overflow-auto">
                  {jsCode ? (
                    <pre className="text-gray-100 font-mono text-sm leading-6">
                      <code>{jsCode}</code>
                    </pre>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-600">
                      Transpiled JavaScript will appear here...
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="console" className="flex-1 mt-0">
                <div className="h-[600px] bg-black border border-gray-800 rounded-lg p-4 font-mono text-sm overflow-auto">
                  <AnimatePresence mode="wait">
                    {error ? (
                      <motion.pre
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-red-400"
                      >
                        ❌ Error: {error}
                      </motion.pre>
                    ) : output ? (
                      <motion.pre
                        key="output"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-green-400 whitespace-pre-wrap"
                      >
                        {output}
                      </motion.pre>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex items-center justify-center text-gray-600"
                      >
                        Run your code to see output here...
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
        {/* Quick Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Reference Guide</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2 text-black">Variables</h4>
                  <div className="space-y-1 text-gray-600">
                    <div><code className="bg-gray-100 px-1 rounded">সংখ্যা x = ১০</code></div>
                    <div><code className="bg-gray-100 px-1 rounded">বাক্য নাম = "মান"</code></div>
                    <div><code className="bg-gray-100 px-1 rounded">ধ্রুবক PI = ৩.১৪</code></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-black">Functions</h4>
                  <div className="space-y-1 text-gray-600">
                    <div><code className="bg-gray-100 px-1 rounded">অনুষ্ঠান নাম() {'{}'}</code></div>
                    <div><code className="bg-gray-100 px-1 rounded">প্রেরণ মান</code></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-black">Control Flow</h4>
                  <div className="space-y-1 text-gray-600">
                    <div><code className="bg-gray-100 px-1 rounded">যদি (শর্ত) {'{}'}</code></div>
                    <div><code className="bg-gray-100 px-1 rounded">নাহলে {'{}'}</code></div>
                    <div><code className="bg-gray-100 px-1 rounded">যখন (শর্ত) {'{}'}</code></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-black">Console</h4>
                  <div className="space-y-1 text-gray-600">
                    <div><code className="bg-gray-100 px-1 rounded">লিখো("বার্তা")</code></div>
                    <div><code className="bg-gray-100 px-1 rounded">সমস্যা_লিখো("error")</code></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold mb-2 text-black">Bengali Numbers</h4>
                <code className="text-gray-600 bg-gray-100 px-2 py-1 rounded">০ ১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯</code>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      {/* Footer */}
      < Footer />
    </div>
  );
}
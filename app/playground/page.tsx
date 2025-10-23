"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ExamplesBar } from "@/components/playground/ExamplesBar";
import { ActionButtons } from "@/components/playground/ActionButtons";
import BanglaCodeEditor from "@/components/playground/BanglaCodeEditor";
import { transpile, executeCode } from "@/lib/transpiler";
import { OutputPanel } from "@/components/playground/OutputPanel";
import { examples } from "@/lib/playground-example-bjs";
import DownloadButton from '@/components/DownloadButton';
import Modal from '@/components/Modal';

export default function PlaygroundPage() {
  const [banglaCode, setBanglaCode] = useState<string>(examples[1].code);
  const [jsCode, setJsCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("javascript");
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleTranspile = (code: string, onSuccess: (js: string) => void, onError: (err: string) => void) => {
    setIsProcessing(true);
    const startTime = performance.now();
    const result = transpile(code); 
    const endTime = performance.now();
    if (result.success) {
      onSuccess(result.output || "");
      setError("");
      setExecutionTime(endTime - startTime);
    } else {
      onError(result.error || "Transpilation failed");
    }
    setOutput("");
    setIsProcessing(false);
    setActiveTab("javascript");
  };

  const handleRun = async (code: string, onSuccess: (out: string, js: string) => void, onError: (err: string) => void) => {
    setIsProcessing(true);
    const startTime = performance.now();
    const transpileResult = transpile(code);
    if (transpileResult.success) {
      const jsOutput = transpileResult.output || "";
      setJsCode(jsOutput);
      const executeResult = await executeCode(jsOutput);
      const endTime = performance.now();
      if (executeResult.success) {
        onSuccess(executeResult.output || "", jsOutput);
        setError("");
        setExecutionTime(endTime - startTime);
      } else {
        onError(executeResult.error || "Execution failed");
        setOutput("");
      }
    } else {
      onError(transpileResult.error || "Transpilation failed");
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
    a.download = "main.js";
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateBanglaCode = (newCode: string) => {
    setBanglaCode(newCode);
    // Reset outputs when code changes
    setJsCode("");
    setOutput("");
    setError("");
    setExecutionTime(null);
  };

  const runCode = () => {
    handleRun(banglaCode, (out, js) => { setOutput(out); setJsCode(js); }, setError);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      {/* Header */}
      <header className="border-b border-gray-700 bg-white dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
            <div className="text-center items-center gap-2">
              <DownloadButton />
              <p className="text-sm text-gray-600 dark:text-green-400 italic">require windows 10/11</p>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <ExamplesBar examples={examples} onExampleSelect={updateBanglaCode} />
        <ActionButtons
          onRun={() => handleRun(banglaCode, (out, js) => { setOutput(out); setJsCode(js); }, setError)}
          onTranspile={() => handleTranspile(banglaCode, setJsCode, setError)}
          onReset={handleReset}
          onCopy={handleCopy}
          onDownload={handleDownload}
          jsCode={jsCode}
          isProcessing={isProcessing}
          copied={copied}
          executionTime={executionTime}
        />
        <div className="grid lg:grid-cols-2 gap-6">
<motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              {/* Left section: Icon + Title */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="font-mono text-lg font-bold text-primary-foreground">ব</span>
                </div>
                <h2 className="text-lg font-bold text-gray-600 dark:text-gray-100">BanglaScript Code</h2>
              </div>

              {/* Right section: Button */}
              <div>
                <button
                  onClick={openModal}
                  title="Keywords"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
                >
               
                </button>

                {/* Modal component */}
                <Modal isOpen={isModalOpen} onClose={closeModal} />
              </div>
            </div>

            {/* Code Editor */}
            <div className="h-[650px]">
              <BanglaCodeEditor value={banglaCode} onChange={updateBanglaCode} />
            </div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <OutputPanel
              activeTab={activeTab}
              onTabChange={setActiveTab}
              jsCode={jsCode}
              output={output}
              error={error}
              executionTime={executionTime}
              runCode={runCode}
            />
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
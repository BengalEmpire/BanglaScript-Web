(import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, Code2, Maximize2, Minimize2, X, Copy, Check } from "lucide-react";
import { useState } from "react";

interface OutputPanelProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  jsCode: string;
  output: string;
  error: string;
  executionTime?: number | null;
}

// Mock components - replace with your actual implementations
function JsCodeViewer({ jsCode }: { jsCode: string }) {
  return (
    <pre className="p-4 text-sm font-mono text-gray-300 overflow-auto h-full">
      <code>{jsCode || "// No code generated yet"}</code>
    </pre>
  );
}

function ConsoleOutput({ output, error, executionTime }: { output: string; error: string; executionTime?: number | null }) {
  return (
    <div className="p-4 font-mono text-sm h-full overflow-auto">
      {error ? (
        <div className="text-red-400 flex items-start gap-2">
          <span className="text-red-500">✖</span>
          <div>
            <div className="font-semibold">Error:</div>
            <div className="mt-1 text-red-300">{error}</div>
          </div>
        </div>
      ) : output ? (
        <div className="text-green-400">
          <div className="text-gray-500 text-xs mb-2">
            {executionTime && `Executed in ${executionTime}ms`}
          </div>
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      ) : (
        <div className="text-gray-600 italic">Console is ready...</div>
      )}
    </div>
  );
}

export function OutputPanel({
  activeTab,
  onTabChange,
  jsCode,
  output,
  error,
  executionTime,
}: OutputPanelProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const content = activeTab === "javascript" ? jsCode : output || error;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] rounded-lg shadow-2xl border border-[#2d2d2d] overflow-hidden">
      {/* Window Title Bar */}
      <div className="bg-[#2d2d2d] border-b border-[#1e1e1e] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* macOS-style window controls */}
          <div className="flex items-center gap-2">
            <button 
              type="button" 
              className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-all group relative"
              aria-label="Close"
            >
              <X className="w-2 h-2 absolute inset-0 m-auto text-[#4d0000] opacity-0 group-hover:opacity-100" />
            </button>
            <button 
              type="button" 
              className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 transition-all group relative"
              aria-label="Minimize"
              onClick={() => setIsMaximized(false)}
            >
              <Minimize2 className="w-2 h-2 absolute inset-0 m-auto text-[#995700] opacity-0 group-hover:opacity-100" />
            </button>
            <button 
              type="button" 
              className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 transition-all group relative"
              aria-label="Maximize"
              onClick={() => setIsMaximized(!isMaximized)}
            >
              <Maximize2 className="w-2 h-2 absolute inset-0 m-auto text-[#006500] opacity-0 group-hover:opacity-100" />
            </button>
          </div>
          
          <span className="text-sm font-medium text-gray-400">আউটপুট</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-[#3d3d3d] transition-colors text-gray-400 hover:text-gray-200"
            aria-label="Copy"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col">
        <div className="bg-[#252526] border-b border-[#1e1e1e]">
          <TabsList className="bg-transparent p-0 h-auto gap-0 rounded-none border-none">
            <TabsTrigger
              value="javascript"
              className="relative bg-transparent rounded-none border-r border-[#1e1e1e] px-4 py-2.5 text-xs font-medium text-gray-400 hover:text-gray-200 data-[state=active]:text-white data-[state=active]:bg-[#1e1e1e] transition-all flex items-center gap-2 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#00A63E] after:opacity-0 data-[state=active]:after:opacity-100 after:transition-opacity"
            >
              <Code2 className="w-4 h-4" />
              <span>output.js</span>
              <span className="ml-1 text-[10px] text-gray-600 data-[state=active]:text-[#00A63E]">JS</span>
            </TabsTrigger>
            <TabsTrigger
              value="console"
              className="relative bg-transparent rounded-none px-4 py-2.5 text-xs font-medium text-gray-400 hover:text-gray-200 data-[state=active]:text-white data-[state=active]:bg-[#1e1e1e] transition-all flex items-center gap-2 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#00C951] after:opacity-0 data-[state=active]:after:opacity-100 after:transition-opacity"
            >
              <Terminal className="w-4 h-4" />
              <span>Console</span>
              {error && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              )}
              {!error && output && (
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content Area */}
        <TabsContent value="javascript" className="flex-1 m-0 overflow-hidden bg-[#1e1e1e]">
          <div className="h-full overflow-auto">
            <JsCodeViewer jsCode={jsCode} />
          </div>
        </TabsContent>

        <TabsContent value="console" className="flex-1 m-0 overflow-hidden bg-[#1e1e1e]">
          <div className="h-full overflow-auto">
            <ConsoleOutput output={output} error={error} executionTime={executionTime} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Status Bar */}
      <div className="bg-[#007acc] border-t border-[#005a9e] px-4 py-1 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <span className="text-white font-medium flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
            Ready
          </span>
          {executionTime && (
            <span className="text-white/80">Execution: {executionTime}ms</span>
          )}
        </div>
        <div className="flex items-center gap-4 text-white/80">
          <span>UTF-8</span>
          <span>{activeTab === "javascript" ? "JavaScript" : "Console"}</span>
        </div>
      </div>
    </div>
  );
})(import Image from 'next/image';
import { Code2, Copy, Check, Download } from "lucide-react";
import { highlightJS } from "@/lib/playground-utils";
import { useState } from 'react';

interface JsCodeViewerProps {
  jsCode: string;
}

export function JsCodeViewer({ jsCode }: JsCodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transpiled-code.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!jsCode) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 p-6 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse"></div>
          <Code2 className="h-24 w-24 opacity-30 relative z-10 text-blue-400" strokeWidth={1.5} />
        </div>
        <div className="text-center space-y-3 max-w-md">
          <p className="text-gray-300 font-semibold text-lg">
            Transpiled JavaScript এখানে দেখাবে
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            কোড লিখে <span className="text-blue-400 font-medium">"Transpile করুন"</span> বাটনে ক্লিক করুন
          </p>
        </div>
        <div className="mt-8 flex gap-2">
          <div className="h-1 w-12 bg-blue-500/30 rounded-full"></div>
          <div className="h-1 w-8 bg-blue-500/20 rounded-full"></div>
          <div className="h-1 w-6 bg-blue-500/10 rounded-full"></div>
        </div>
      </div>
    );
  }

  const lines = jsCode.split('\n');
  const highlighted = highlightJS(jsCode);

  return (
    <div className="relative h-full bg-[#1e1e1e] flex flex-col">
      {/* Header with actions */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-700/50">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Code2 className="h-4 w-4 text-blue-400" />
          <span className="font-medium">transpiled-code.js</span>
          <span className="text-gray-600">•</span>
          <span>{lines.length} lines</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-gray-700/50 rounded transition-colors group relative"
            title="Copy code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4 text-gray-400 group-hover:text-gray-200" />
            )}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 hover:bg-gray-700/50 rounded transition-colors group"
            title="Download code"
          >
            <Download className="h-4 w-4 text-gray-400 group-hover:text-gray-200" />
          </button>
        </div>
      </div>

      {/* Code editor area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Gutter (line numbers) */}
        <div className="absolute left-0 top-0 bottom-0 w-14 bg-[#1e1e1e] border-r border-gray-800/50 flex flex-col items-end pr-4 py-4 font-mono text-xs text-gray-600 select-none overflow-y-auto z-10">
          {lines.map((_, i) => (
            <div key={i} className="leading-6 h-6 hover:text-gray-400 transition-colors">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code content */}
        <div className="absolute left-14 right-0 top-0 bottom-0 overflow-auto">
          <pre className="px-4 py-4 font-mono text-sm leading-6 text-gray-100">
            <code dangerouslySetInnerHTML={{ __html: highlighted }} />
          </pre>
        </div>

        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-[#007acc] text-white text-xs">
        <div className="flex items-center gap-4">
          <span>JavaScript</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{jsCode.length} characters</span>
        </div>
      </div>
    </div>
  );
}) (export function ConsoleOutput({ output, error, executionTime }: ConsoleOutputProps) {
  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] font-mono text-sm">
      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-y-auto p-4 space-y-2"
          >
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
              <span className="text-emerald-500">➜</span>
              <span className="text-cyan-400">~/banglascript</span>
              <span className="text-gray-500">$</span>
              <span className="text-gray-300">node script.js</span>
            </div>
            <div className="bg-red-950/20 border-l-4 border-red-500 p-3 rounded-r">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-400 text-lg">⚠</span>
                <span className="text-red-400 font-semibold">Runtime Error</span>
              </div>
              <pre className="text-red-300 whitespace-pre-wrap leading-relaxed text-xs">
                {error}
              </pre>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-xs pt-2">
              <span className="text-red-500">✗</span>
              <span>Process exited with code 1</span>
            </div>
          </motion.div>
        ) : output ? (
          <motion.div
            key="output"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-y-auto p-4 space-y-2"
          >
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
              <span className="text-emerald-500">➜</span>
              <span className="text-cyan-400">~/banglascript</span>
              <span className="text-gray-500">$</span>
              <span className="text-gray-300">node output.js</span>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded p-3">
              <pre className="text-gray-100 whitespace-pre-wrap leading-relaxed text-xs">
                {output}
              </pre>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-xs pt-2">
              <span className="text-emerald-500">✓</span>
              <span>Process completed successfully in {executionTime?.toFixed(2)}ms</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col p-4"
          >
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-600 text-xs">
                <Terminal className="h-3.5 w-3.5" />
                <span>BanglaScript Terminal v1.0.0</span>
              </div>
              <div className="w-full border-t border-gray-800/50"></div>
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <span className="text-emerald-500">➜</span>
                <span className="text-cyan-400">~/banglascript</span>
                <span className="text-gray-600">$</span>
                <motion.span 
                  className="inline-block w-2 h-4 bg-gray-500 ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <div className="relative mb-6">
                <Terminal className="h-16 w-16 opacity-20 text-cyan-400" />
                <motion.div 
                  className="absolute inset-0 bg-cyan-500/10 blur-xl rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
              <p className="text-center">
                <span className="text-gray-400 font-medium block mb-1">কোড রান করতে "কোড চালান" বাটনে ক্লিক করুন</span>
                <span className="text-xs text-gray-600">Waiting for execution...</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}) (import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Code2, RotateCcw, Copy, Check, Download, Zap, Loader2 } from "lucide-react";

interface ActionButtonsProps {
  onRun: () => void;
  onTranspile: () => void;
  onReset: () => void;
  onCopy: () => void;
  onDownload: () => void;
  jsCode: string;
  isProcessing: boolean;
  copied: boolean;
  executionTime: number | null;
}

export function ActionButtons({
  onRun,
  onTranspile,
  onReset,
  onCopy,
  onDownload,
  jsCode,
  isProcessing,
  copied,
  executionTime,
}: ActionButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-6 bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700/50 shadow-lg backdrop-blur-sm"
    >
      {/* Primary Actions */}
      <div className="flex flex-wrap gap-3 items-center mb-3">
        <Button
          onClick={onRun}
          disabled={isProcessing}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              প্রসেসিং...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              কোড চালান
            </>
          )}
        </Button>

        <Button
          onClick={onTranspile}
          disabled={isProcessing}
          variant="outline"
          className="border-2 border-green-500/50 text-gray-100 bg-gray-700/50 hover:bg-gray-700 hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Code2 className="mr-2 h-4 w-4" />
          Transpile করুন
        </Button>

        <Button
          onClick={onReset}
          variant="outline"
          disabled={isProcessing}
          className="border-2 border-orange-500/50 text-gray-100 bg-gray-700/50 hover:bg-gray-700 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          রিসেট
        </Button>
      </div>

      {/* Secondary Actions & Status */}
      <div className="flex flex-wrap gap-3 items-center">
        {jsCode && (
          <>
            <Button
              onClick={onCopy}
              variant="outline"
              size="sm"
              className="border border-gray-600 text-gray-200 bg-gray-700/30 hover:bg-gray-700 hover:border-gray-500 transition-all duration-200"
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
              onClick={onDownload}
              variant="outline"
              size="sm"
              className="border border-gray-600 text-gray-200 bg-gray-700/30 hover:bg-gray-700 hover:border-gray-500 transition-all duration-200"
            >
              <Download className="mr-2 h-4 w-4" />
              ডাউনলোড
            </Button>
          </>
        )}

        {executionTime !== null && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg"
          >
            <Zap className="h-4 w-4 text-yellow-400" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 leading-none mb-0.5">Execution Time</span>
              <span className="text-sm font-bold text-yellow-300 leading-none">
                {executionTime.toFixed(2)}ms
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 pt-3 border-t border-gray-700/50"
        >
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin text-green-500" />
            <span>কোড প্রসেস করা হচ্ছে...</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}) See this code, I loved UI UX! and now, ()
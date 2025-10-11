import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";
import CommandDisplay from "../CommandDisplay";

interface ConsoleOutputProps {
  output: string;
  error: string;
  executionTime?: number | null;
}

export function ConsoleOutput({ output, error, executionTime }: ConsoleOutputProps) {
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
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-3 ">
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
            className="flex-1 overflow-y-scroll p-4 space-y-2"
             style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#eeeee'
            }}
          >
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
              <span className="text-emerald-500">➜</span>
              <span className="text-cyan-400">~/banglascript</span>
              <span className="text-gray-500">$</span>
              <CommandDisplay/>
            </div>
            <div className="bg-gray-900/30 border border-green-800/50 rounded p-3">
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
}
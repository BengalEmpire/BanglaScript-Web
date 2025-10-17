import { motion, AnimatePresence } from "framer-motion";
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
      className="mb-6 flex flex-wrap items-center justify-between gap-4 
                bg-gradient-to-r from-gray-900 to-green-900 
                dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 
                p-3 sm:p-4 rounded-xl border border-gray-700/50 
                shadow-lg backdrop-blur-sm"
    >

      {/* Left Group: Contains all action buttons */}
      <div className="flex flex-wrap items-center gap-3 p-2">
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
          className="border-2 border-green-500/50 text-gray-100 bg-gray-700/50 hover:bg-gray-700 dark:hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Code2 className="mr-2 h-4 w-4" />
          Transpile করুন
        </Button>

        <Button
          onClick={onReset}
          variant="outline"
          disabled={isProcessing}
          className="border-2 border-orange-500/50 text-gray-100 bg-gray-700/50 hover:bg-gray-700 dark:hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          রিসেট
        </Button>
        <AnimatePresence>
          {jsCode && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <Button
                onClick={onCopy}
                variant="outline"
                size="sm"
                className="border border-gray-600 text-gray-200 bg-gray-700/30 dark:hover:bg-yellow-700 dark:hover:border-green-500 transition-all duration-200"
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
                className="border border-gray-600 text-gray-200 bg-gray-700/30 hover:bg-gray-700 dark:hover:border-green-500 transition-all duration-200 cursor-pointer"
              >
                <Download className="mr-2 h-4 w-4" />
                ডাউনলোড
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Group: Execution time, pushed to the right by justify-between */}
      {executionTime !== null && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg"
        >
          <Zap className="h-4 w-4 text-yellow-400" />
          <div className="flex flex-col text-left">
            <span className="text-xs text-gray-400 leading-none mb-0.5">Execution Time</span>
            <span className="text-sm font-bold text-yellow-300 leading-none">
              {executionTime.toFixed(2)}ms
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
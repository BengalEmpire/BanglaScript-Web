import { motion } from "framer-motion";
import { Terminal, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ConsoleOutputProps {
  output: string;
  error: string;
  executionTime?: number | null;
  runCode?: () => void;
}

type HistoryItem = {
  type: "command" | "output" | "error" | "info";
  text: string;
};

export function ConsoleOutput({ output, error, executionTime, runCode }: ConsoleOutputProps) {
  const [terminalHistory, setTerminalHistory] = useState<HistoryItem[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [terminalHistory, currentInput]);

  useEffect(() => {
    if (output) {
      setTerminalHistory((prev) => [
        ...prev,
        { type: "output", text: output },
        { type: "info", text: `✓ Executed in ${executionTime?.toFixed(2) ?? 0}ms` },
      ]);
    }
  }, [output, executionTime]);

  useEffect(() => {
    if (error) {
      setTerminalHistory((prev) => [
        ...prev,
        { type: "error", text: error },
        { type: "info", text: "✗ Process exited with code 1" },
      ]);
    }
  }, [error]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.key === "Enter") {
      const trimmed = currentInput.trim();
      setTerminalHistory((prev) => [...prev, { type: "command", text: trimmed }]);
      if (trimmed === "node main.js" || trimmed === "deno run main.js" || trimmed === "bjs run main.bjs") {
        setTerminalHistory((prev) => [...prev, { type: "info", text: "Running..." }]);
        runCode?.();
      } else if (trimmed === "clear") {
        setTerminalHistory([]);
      } else if (trimmed) {
        setTerminalHistory((prev) => [...prev, { type: "error", text: `command not found: ${trimmed}` }]);
      }
      setCurrentInput("");
      return;
    }
    if (e.key === "Backspace") {
      setCurrentInput((prev) => prev.slice(0, -1));
      return;
    }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      setCurrentInput((prev) => prev + e.key);
      return;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0d0d0d] font-mono text-sm relative">
      {/* Terminal Header Bar */}
      <div className="bg-[#1a1a1a] border-b border-gray-800 px-4 py-2 flex items-center gap-2 select-none">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer hover:brightness-110 transition-all"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 cursor-pointer hover:brightness-110 transition-all"></div>
          <div
            className="w-3 h-3 rounded-full bg-green-500/80 cursor-pointer hover:brightness-110 transition-all"
          ></div>
        </div>
        <div className="flex-1 flex items-center justify-center gap-2  text-xs">
          <Terminal className="h-3.5 w-3.5 text-amber-100" />
          <span className="text-gray-500">BanglaScript Terminal</span>
        </div>
        <div className="flex items-center justify-end w-16 pr-4"
             title="Clear the terminal."
        >
          <RefreshCw 
            
            className="h-4 w-4 text-gray-500 hover:text-gray-300 cursor-pointer" 
            onClick={() => setTerminalHistory([])} 
          />
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={contentRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={() => contentRef.current?.focus()}
        className="flex-1 overflow-y-auto p-4 space-y-2 outline-none"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#374151 #1a1a1a",
        }}
      >
        {terminalHistory.length === 0 && (
          <>
            <div className="text-gray-600 text-[13px]">BanglaScript Terminal v1.3.7</div>
              <div className="text-gray-700 text-xs">Type commands like '
                <span className="text-gray-50/25">node main.js</span>' or '
                <span className="text-gray-50/25">deno run main.js</span>' to run the code | run `
                <span className="text-gray-50/25">clear</span>` to clean the terminal
              </div>
            <div className="w-full border-t border-gray-800/50 my-2"></div>
          </>
        )}

        {terminalHistory.map((item, index) => (
          <div key={index}>
            {item.type === "command" && (
              <div className="flex items-center gap-2 text-[13px]">
                <span className="text-emerald-400">➜</span>
                <span className="text-sky-400">~/banglascript</span>
                <span className="text-green-600">$</span>
                <span className="text-gray-300">{item.text}</span>
              </div>
            )}
            {item.type === "output" && (
              <div className="text-gray-200 text-[13px] leading-relaxed mt-2 bg-gray-900/30 border border-green-800/50 rounded p-3">
                <pre className="whitespace-pre-wrap">{item.text}</pre>
              </div>
            )}
            {item.type === "error" && (
              <div className="text-red-400 text-[13px] mt-2">
                <pre className="whitespace-pre-wrap">{item.text}</pre>
              </div>
            )}
            {item.type === "info" && (
              <div className="text-green-600 text-[13px] mt-2">{item.text}</div>
            )}
          </div>
        ))}

        <div className="flex items-center gap-2 text-[13px] pt-2">
          <span className="text-emerald-400">➜</span>
          <span className="text-sky-400">~/banglascript</span>
          <span className="text-green-600">$</span>
          <span className="text-gray-300">{currentInput}</span>
          <motion.span
            className="inline-block w-1 h-[14px] bg-gray-500 ml-0.5"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
}
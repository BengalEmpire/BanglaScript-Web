import { motion } from "framer-motion";
import { Terminal, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect } from "react";

let KEYWORDS: Record<string, string> | null = null;
let COMMON_MAP: Record<string, string> = {}; // Assume local or empty; enhance by fetching if a URL becomes available

const BENGALI_DIGIT_START = 0x09E6;

const consonantMap: Record<string, string> = {
  'ক': 'k',
  'খ': 'kh',
  'গ': 'g',
  'ঘ': 'gh',
  'ঙ': 'ng',
  'চ': 'ch',
  'ছ': 'chh',
  'জ': 'j',
  'ঝ': 'jh',
  'ঞ': 'ny',
  'ট': 't',
  'ঠ': 'th',
  'ড': 'd',
  'ঢ': 'dh',
  'ণ': 'n',
  'ত': 't',
  'থ': 'th',
  'দ': 'd',
  'ধ': 'dh',
  'ন': 'n',
  'প': 'p',
  'ফ': 'ph',
  'ব': 'b',
  'ভ': 'bh',
  'ম': 'm',
  'য': 'j',
  'র': 'r',
  'ল': 'l',
  'শ': 'sh',
  'ষ': 'sh',
  'স': 's',
  'হ': 'h',
  'ড়': 'r',
  'ঢ়': 'rh',
  'য়': 'y',
};

const vowelMap: Record<string, string> = {
  'া': 'a',
  'ি': 'i',
  'ী': 'ee',
  'ু': 'u',
  'ূ': 'oo',
  'ৃ': 'ri',
  'ৄ': 'ree', // Rare
  'ে': 'e',
  'ৈ': 'oi',
  'ো': 'o',
  'ৌ': 'ou',
};

const otherMap: Record<string, string> = {
  'ং': 'ng',
  'ঃ': 'h',
  'ঁ': 'n', // Simple nasalization
  '়': '', // Nukta, ignore for basic
};

export function bengaliDigitsToAscii(str: string): string {
  return str.replace(/[\u09E6-\u09EF]/g, (ch) => {
    const code = ch.charCodeAt(0);
    return String(code - BENGALI_DIGIT_START);
  });
}

export function isUnicodeLetter(ch: string): boolean {
  return /[A-Za-z\u0980-\u09FF]/.test(ch);
}

export function tokenizePreserve(code: string): { type: string; text: string }[] {
  const tokens: { type: string; text: string }[] = [];
  const n = code.length;
  let i = 0;
  while (i < n) {
    const ch = code[i];
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch;
      let j = i + 1;
      let esc = false;
      while (j < n) {
        const c = code[j];
        if (esc) {
          esc = false;
          j++;
          continue;
        }
        if (c === '\\') {
          esc = true;
          j++;
          continue;
        }
        if (c === quote) {
          j++;
          break;
        }
        j++;
      }
      tokens.push({ type: 'string', text: code.slice(i, j) });
      i = j;
      continue;
    }
    if (ch === '/' && i + 1 < n && code[i + 1] === '/') {
      let j = i + 2;
      while (j < n && code[j] !== '\n') j++;
      tokens.push({ type: 'comment', text: code.slice(i, j) });
      i = j;
      continue;
    }
    if (ch === '/' && i + 1 < n && code[i + 1] === '*') {
      let j = i + 2;
      while (j + 1 < n && !(code[j] === '*' && code[j + 1] === '/')) j++;
      if (j + 1 < n) j += 2;
      tokens.push({ type: 'comment', text: code.slice(i, j) });
      i = j;
      continue;
    }
    if (/[0-9\u09E6-\u09EF]/.test(ch)) {
      let j = i + 1;
      while (j < n && (/[0-9\u09E6-\u09EF]/.test(code[j]) || code[j] === '.')) j++;
      tokens.push({ type: 'number', text: code.slice(i, j) });
      i = j;
      continue;
    }
    if (isUnicodeLetter(ch) || ch === '_' || ch === '$') {
      let j = i + 1;
      while (j < n) {
        const c = code[j];
        if (isUnicodeLetter(c) || c === '_' || c === '$' || /[0-9\u09E6-\u09EF]/.test(c)) {
          j++;
          continue;
        }
        break;
      }
      tokens.push({ type: 'word', text: code.slice(i, j) });
      i = j;
      continue;
    }
    // Enhanced: Handle multi-character symbols (e.g., ===, +=, etc.) for better tokenization
    if (/[=<>!+\-*\/%&|?:]/.test(ch)) {
      let j = i + 1;
      while (j < n && /[=<>!+\-*\/%&|?:]/.test(code[j])) j++;
      tokens.push({ type: 'symbol', text: code.slice(i, j) });
      i = j;
      continue;
    }
    tokens.push({ type: 'symbol', text: ch });
    i++;
  }
  return tokens;
}

function transliterateBasic(w: string): string {
  const result: string[] = [];
  const n = w.length;
  let i = 0;
  while (i < n) {
    let ch = w[i];
    if (consonantMap[ch]) {
      result.push(consonantMap[ch]);
      i++;
      let hasVowel = false;
      // Handle conjuncts (virama + consonant)
      while (i < n && w[i] === '্') {
        i++; // Skip virama
        if (i < n && (ch = w[i], consonantMap[ch])) {
          result.push(consonantMap[ch]);
          i++;
        }
      }
      // Check for vowel diacritic
      if (i < n && (ch = w[i], vowelMap[ch])) {
        result.push(vowelMap[ch]);
        hasVowel = true;
        i++;
      }
      // Add inherent vowel if no diacritic or conjunct end
      if (!hasVowel) {
        result.push('a'); // Using 'a' for inherent vowel (common in transliterations)
      }
    } else if (vowelMap[ch]) {
      result.push(vowelMap[ch]);
      i++;
    } else if (otherMap[ch]) {
      result.push(otherMap[ch]);
      i++;
    } else {
      result.push(ch); // Keep Latin or other chars as is
      i++;
    }
  }
  return result.join('');
}

export function simpleTransliterate(word: string): string {
  // Enhanced: Check whole word in COMMON_MAP first
  if (COMMON_MAP[word]) return COMMON_MAP[word];

  if (word.includes("_")) {
    const parts = word.split("_");
    const transliteratedParts = parts.map(part => COMMON_MAP[part] || transliterateBasic(part));
    return transliteratedParts.join("_");
  }

  return transliterateBasic(word);
}

export function tokensToJS(tokens: { type: string; text: string }[]): string {
  return tokens.map(t => {
    if (t.type === 'string' || t.type === 'comment') return t.text;
    if (t.type === 'word') {
      const norm = t.text.normalize('NFC');
      if (KEYWORDS[norm]) return KEYWORDS[norm];
      return simpleTransliterate(norm);
    }
    if (t.type === 'number') {
      return bengaliDigitsToAscii(t.text);
    }
    return t.text;
  }).join('');
}

export async function transpile(code: string): Promise<{ success: boolean; output: string; error?: string }> {
  try {
    if (!KEYWORDS) {
      const response = await fetch("https://bangla-script.vercel.app/json/keywords.json");
      if (!response.ok) {
        throw new Error(`Failed to fetch keywords: ${response.statusText}`);
      }
      KEYWORDS = await response.json();
      // If COMMON_MAP has a URL, fetch it here similarly
      // e.g., const commonResp = await fetch(".../common_map.json");
      // COMMON_MAP = await commonResp.json();
    }
    const tokens = tokenizePreserve(code);
    const jsCode = tokensToJS(tokens);
    return { success: true, output: jsCode };
  } catch (err) {
    return { success: false, output: '', error: (err as Error).message };
  }
}

export async function executeCode(jsCode: string): Promise<{ success: boolean; output: string; error?: string }> {
  try {
    const outputs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => outputs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
      error: (...args: any[]) => outputs.push(`❌ Error: ${args.join(' ')}`),
      info: (...args: any[]) => outputs.push(`ℹ️ Info: ${args.join(' ')}`),
      warn: (...args: any[]) => outputs.push(`⚠️ Warn: ${args.join(' ')}`),
    };
    const wrappedCode = `(async () => {\n${jsCode}\n})();`;
    const func = new Function('console', wrappedCode);
    await func(customConsole);
    return { success: true, output: outputs.join('\n') || '✓ কোড সফলভাবে চলেছে (কোনো আউটপুট নেই)' };
  } catch (err) {
    return { success: false, output: '', error: (err as Error).message };
  }
}

// Enhanced ConsoleOutput with useEffect for fetching example data on mount (demonstrates fetching)
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

  // Enhanced: useEffect for fetching data on component mount and showing in terminal
  useEffect(() => {
    const fetchAndShowData = async () => {
      try {
        const response = await fetch("https://bangla-script.vercel.app/json/keywords.json");
        const data = await response.json();
        setTerminalHistory((prev) => [
          ...prev,
          { type: "info", text: "Fetching keywords data..." },
          { type: "output", text: `✅ Fetch successful! Total keywords: ${Object.keys(data).length}` },
          { type: "output", text: "🔹 First few keywords:" },
          { type: "output", text: JSON.stringify(data, null, 2).slice(0, 200) + "..." }, // Truncated for brevity
        ]);
      } catch (err) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "error", text: `❌ Fetch error: ${(err as Error).message}` },
        ]);
      }
    };
    fetchAndShowData();
  }, []); // Runs once on mount

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
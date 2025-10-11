import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Code2, Copy, Download, Settings, Maximize2, Minimize2 } from "lucide-react";
import { highlightBangla } from "@/lib/playground-utils";

interface CodeEditorProps {
  value: string;
  onChange: (newValue: string) => void;
}

export default function BanglaCodeEditor({ value = '', onChange }: CodeEditorProps) {
  const [lineCount, setLineCount] = useState(1);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [editorScrollTop, setEditorScrollTop] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines);
  }, [value]);

  useEffect(() => {
    const textarea = textareaRef.current;
    const highlight = highlightRef.current;
    const lineNumbers = lineNumbersRef.current;
    if (!textarea || !highlight || !lineNumbers) return;

    const syncFromTextarea = () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
      lineNumbers.scrollTop = textarea.scrollTop;
      isSyncingRef.current = false;
      setEditorScrollTop(textarea.scrollTop);
    };

    const syncFromLineNumbers = () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      textarea.scrollTop = lineNumbers.scrollTop;
      isSyncingRef.current = false;
    };

    textarea.addEventListener('scroll', syncFromTextarea, { passive: true });
    lineNumbers.addEventListener('scroll', syncFromLineNumbers, { passive: true });

    return () => {
      textarea.removeEventListener('scroll', syncFromTextarea);
      lineNumbers.removeEventListener('scroll', syncFromLineNumbers);
    };
  }, []);

  const updateCursorPosition = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const position = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, position);
    const lines = textBeforeCursor.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;

    setCursorPosition({ line, col });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Tab handling
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }

    // Auto-closing brackets
    const pairs: Record<string, string> = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" };
    if (pairs[e.key]) {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const newValue = value.substring(0, start) + e.key + selectedText + pairs[e.key] + value.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1 + selectedText.length;
      }, 0);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
  };

  const handleDownload = () => {
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.bjs';
    a.click();
    URL.revokeObjectURL(url);
  };

  const highlighted = highlightBangla(value);

  const renderLineNumbers = () => {
    const maxLines = Math.max(lineCount, 20);
    return Array.from({ length: maxLines }, (_, i) => {
      const isCurrentLine = i + 1 === cursorPosition.line;
      return (
        <div 
          key={i} 
          className={`h-6 transition-all duration-150 flex items-center justify-end pr-3 ${
            isCurrentLine 
              ? 'text-blue-400 bg-blue-500/10 font-semibold' 
              : 'text-gray-600 hover:text-gray-400'
          }`}
        >
          {i + 1}
        </div>
      );
    });
  };

  return (
    <div 
      ref={containerRef} 
      className={`flex flex-col dark:bg-[#1e1e1e] bg-white border border-gray-800 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50' : 'h-full'
      }`}
    >
      {/* Top Bar */}
      <div className="flex-shrink-0 bg-[#323233] border-b border-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 transition-all cursor-not-allowed" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 transition-all cursor-not-allowed" />
            <div onClick={() => setIsFullscreen(!isFullscreen)}  title={isFullscreen ? "Exit fullscreen" : "Fullscreen"} className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 transition-all cursor-pointer" />
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Code2 className="h-4 w-4" />
            <span className="font-mono text-sm">main.bjs</span>
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-gray-200"
            title="Copy code"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-gray-200"
            title="Download file"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-gray-200"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <div className="flex items-center gap-2 ml-2 text-xs text-gray-500">
            <button
              onClick={() => setFontSize(Math.max(10, fontSize - 1))}
              className="px-2 py-1 hover:bg-gray-700 rounded transition-colors"
            >
              -
            </button>
            <span className="font-mono w-8 text-center">{fontSize}</span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 1))}
              className="px-2 py-1 hover:bg-gray-700 rounded transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line Numbers */}
        <div 
          ref={lineNumbersRef}
          className="flex-shrink-0 bg-[#1e1e1e] text-right py-4 select-none border-r border-gray-800 overflow-y-auto font-mono min-w-[3.5rem]"
          style={{ fontSize: `${fontSize}px`, lineHeight: '1.5rem',
              scrollbarWidth: 'thin',
              scrollbarColor: '#374151 transparent'
            }}
        >
          {renderLineNumbers()}
        </div>

        {/* Code Area */}
        <div className="flex-1 relative min-w-0 bg-[#1e1e1e]">
          {/* Highlighted Code */}
          <div 
            ref={highlightRef}
            className="absolute inset-0 overflow-auto p-4 pointer-events-none text-gray-300"
            style={{ fontSize: `${fontSize}px`,
               scrollbarWidth:  'none',

                msOverflowStyle:  'none',
          }}
          >
            <pre className="font-mono leading-6 min-h-full">
              <code dangerouslySetInnerHTML={{ __html: highlighted }} />
            </pre>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onKeyUp={updateCursorPosition}
            onClick={updateCursorPosition}
            className="absolute inset-0 bg-transparent text-transparent caret-white p-4 font-mono resize-none focus:outline-none selection:bg-blue-500/40"
            spellCheck={false}
            placeholder="// এখানে BanglaScript কোড লিখুন..."
            style={{ 
              fontSize: `${fontSize}px`,
              lineHeight: '1.5rem',
              tabSize: 2
            }}
          />

          {/* Current Line Highlight */}
          <div 
            className="absolute left-0 right-0 bg-gray-800/20 pointer-events-none transition-all duration-150"
            style={{ 
              height: '1.5rem',
              top: `${(cursorPosition.line - 1) * 24 + 16 - editorScrollTop}px`
            }}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex-shrink-0 bg-[#007acc] px-4 py-1 flex items-center justify-between text-xs text-white font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            BanglaScript
          </span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Ln {cursorPosition.line}, Col {cursorPosition.col}</span>
          <span>{lineCount} lines</span>
          <span>{value.length} characters</span>
        </div>
      </div>
    </div>
  );
}
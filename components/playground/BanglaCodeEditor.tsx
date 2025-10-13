import { useState, useEffect, useRef, useCallback, useMemo, KeyboardEvent } from "react";
import { 
  Code2, 
  Copy, 
  Download, 
  Settings, 
  Maximize2, 
  Minimize2,
  Check,
  Search,
  Terminal,
  FileCode2,
  Zap,
  GitBranch
} from "lucide-react";
import { highlightBangla } from "@/lib/playground-utils";

interface CodeEditorProps {
  value: string;
  onChange: (newValue: string) => void;
}

export default function BanglaCodeEditor({ value = '', onChange }: CodeEditorProps) {
  const [lineCount, setLineCount] = useState(1);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [showMinimap, setShowMinimap] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [wordWrap, setWordWrap] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [editorScrollTop, setEditorScrollTop] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredLine, setHoveredLine] = useState(null);
  const [bracketPairs, setBracketPairs] = useState([]);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const isSyncingRef = useRef(false);

  // Calculate line information
  const lineInfo = useMemo(() => {
    const lines = value.split('\n');
    return lines.map((line, index) => ({
      number: index + 1,
      text: line,
      length: line.length,
      hasError: false, // Could be extended with linting
      isModified: false
    }));
  }, [value]);

  useEffect(() => {
    setLineCount(lineInfo.length);
  }, [lineInfo]);

  // Sync scrolling between elements
  useEffect(() => {
    const textarea = textareaRef.current;
    const highlight = highlightRef.current;
    const lineNumbers = lineNumbersRef.current;
    const minimap = minimapRef.current;
    
    if (!textarea || !highlight || !lineNumbers) return;

    const syncFromTextarea = () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      
      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
      lineNumbers.scrollTop = textarea.scrollTop;
      
      if (minimap) {
        const scrollPercentage = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);
        minimap.scrollTop = scrollPercentage * (minimap.scrollHeight - minimap.clientHeight);
      }
      
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

  // Update cursor position
  const updateCursorPosition = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const position = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, position);
    const lines = textBeforeCursor.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;

    setCursorPosition({ line, col });
    setSelection({ start: textarea.selectionStart, end: textarea.selectionEnd });
    
    // Update bracket matching
    findMatchingBrackets(position);
  }, [value]);

  // Find matching brackets
  const findMatchingBrackets = useCallback((position: number) => {
    const brackets = { '(': ')', '[': ']', '{': '}' };
    const closeBrackets = { ')': '(', ']': '[', '}': '{' };
    const char = value[position];
    
    if (brackets[char] || closeBrackets[char]) {
      // Implement bracket matching logic here
      // This is a simplified version
      setBracketPairs([position]);
    } else {
      setBracketPairs([]);
    }
  }, [value]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Ctrl/Cmd + F for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      setShowSearchBar(!showSearchBar);
      return;
    }

    // Ctrl/Cmd + S for save (mock)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      // Trigger save animation or callback
      return;
    }

    // Tab handling with smart indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (start === end) {
        // Single cursor - insert spaces
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        onChange(newValue);
        
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
          updateCursorPosition();
        }, 0);
      } else {
        // Multiple lines selected - indent
        const lines = value.substring(start, end).split('\n');
        const indented = lines.map(line => '  ' + line).join('\n');
        const newValue = value.substring(0, start) + indented + value.substring(end);
        onChange(newValue);
        
        setTimeout(() => {
          textarea.selectionStart = start;
          textarea.selectionEnd = start + indented.length;
          updateCursorPosition();
        }, 0);
      }
    }

    // Shift+Tab for unindent
    if (e.shiftKey && e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const lines = value.substring(start, end).split('\n');
      const unindented = lines.map(line => line.replace(/^  /, '')).join('\n');
      const newValue = value.substring(0, start) + unindented + value.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = start;
        textarea.selectionEnd = start + unindented.length;
        updateCursorPosition();
      }, 0);
    }

    // Auto-closing brackets with smart behavior
    const pairs: Record<string, string> = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' };
    if (pairs[e.key] && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      
      // If text is selected, wrap it
      const newValue = value.substring(0, start) + e.key + selectedText + pairs[e.key] + value.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1 + selectedText.length;
        updateCursorPosition();
      }, 0);
    }

    // Auto-indent on Enter after opening bracket
    if (e.key === 'Enter') {
      const start = textarea.selectionStart;
      const charBefore = value[start - 1];
      const charAfter = value[start];
      
      if ((charBefore === '{' && charAfter === '}') || 
          (charBefore === '[' && charAfter === ']') || 
          (charBefore === '(' && charAfter === ')')) {
        e.preventDefault();
        const indent = '  ';
        const newValue = value.substring(0, start) + '\n' + indent + '\n' + value.substring(start);
        onChange(newValue);
        
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + indent.length + 1;
          updateCursorPosition();
        }, 0);
      }
    }
  }, [value, onChange, showSearchBar, updateCursorPosition]);

  // Handle mouse movement for hover effects
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    
    // Calculate hovered line
    const lineHeight = 24; // 1.5rem in pixels
    const line = Math.floor((e.clientY - rect.top + editorScrollTop) / lineHeight) + 1;
    setHoveredLine(line <= lineCount ? line : null);
  }, [editorScrollTop, lineCount]);

  // Copy functionality with animation
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  // Download functionality
  const handleDownload = useCallback(() => {
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.bjs';
    a.click();
    URL.revokeObjectURL(url);
  }, [value]);

  // Highlight code
  const highlighted = useMemo(() => highlightBangla(value), [value]);

  // Render line numbers with enhanced features
  const renderLineNumbers = useCallback(() => {
    const maxLines = Math.max(lineCount, 30);
    return Array.from({ length: maxLines }, (_, i) => {
      const lineNum = i + 1;
      const isCurrentLine = lineNum === cursorPosition.line;
      const isHovered = lineNum === hoveredLine;
      const hasSelection = selection.start !== selection.end && lineNum >= Math.min(cursorPosition.line, lineCount) && lineNum <= Math.max(cursorPosition.line, 1);
      
      return (
        <div 
          key={i} 
          className={`h-6 flex items-center justify-end pr-3 relative transition-all duration-100 ${
            isCurrentLine 
              ? 'text-blue-400 bg-blue-500/10 font-semibold' 
              : isHovered
              ? 'text-gray-400 bg-gray-800/30'
              : hasSelection
              ? 'text-gray-500 bg-gray-800/20'
              : 'text-gray-600'
          }`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {isCurrentLine && (
            <div className="absolute left-0 w-1 h-full bg-blue-400" />
          )}
          {lineNum}
        </div>
      );
    });
  }, [lineCount, cursorPosition.line, hoveredLine, selection, fontSize]);

  // Render minimap
  const renderMinimap = useCallback(() => {
    if (!showMinimap) return null;
    
    return (
      <div className="w-24 bg-gray-900/50 border-l border-gray-800 overflow-hidden relative">
        <div 
          ref={minimapRef}
          className="p-2 overflow-y-auto h-full"
          style={{ fontSize: '2px', lineHeight: '3px' }}
        >
          <pre className="font-mono opacity-60">
            <code dangerouslySetInnerHTML={{ __html: highlighted }} />
          </pre>
        </div>
        
        {/* Viewport indicator */}
        <div 
          className="absolute left-0 right-0 bg-gray-600/30 border border-gray-600/50 pointer-events-none"
          style={{
            height: '20%',
            top: `${(editorScrollTop / (textareaRef.current?.scrollHeight || 1)) * 80}%`
          }}
        />
      </div>
    );
  }, [showMinimap, highlighted, editorScrollTop]);

  // Theme classes
  const themeClasses = theme === 'dark' 
    ? 'bg-[#1e1e1e] text-gray-300' 
    : 'bg-white text-gray-800';

  return (
    <div 
      ref={containerRef} 
      className={`flex flex-col ${themeClasses} border border-gray-800 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50' : 'h-full'
      }`}
    >
      {/* Enhanced Top Bar */}
      <div className="flex-shrink-0 bg-gradient-to-r from-[#2d2d30] to-[#252526] border-b border-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 transition-all cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 transition-all cursor-pointer" />
            <div 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 transition-all cursor-pointer" 
            />
          </div>
          
          <div className="flex items-center gap-2 text-gray-400">
            <FileCode2 className="h-4 w-4" />
            <span className="font-mono text-sm">main.bjs</span>
            {value && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>src</span>
            <span>/</span>
            <span>components</span>
            <span>/</span>
            <span className="text-gray-400">main.bjs</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          <button
            onClick={() => setShowSearchBar(!showSearchBar)}
            className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-gray-200"
            title="Search (Ctrl+F)"
          >
            <Search className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-gray-200 relative"
            title="Copy code"
          >
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          </button>
          
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-gray-200"
            title="Download file"
          >
            <Download className="h-4 w-4" />
          </button>
          
          <div className="w-px h-5 bg-gray-700" />
          

          
          <button
            onClick={() => setShowMinimap(!showMinimap)}
            className={`p-2 hover:bg-gray-700 rounded transition-colors ${showMinimap ? 'text-blue-400' : 'text-gray-400'} hover:text-gray-200`}
            title="Toggle minimap"
          >
            <GitBranch className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-gray-200"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          
          <div className="w-px h-5 bg-gray-700" />
          
          {/* Font Size Controls */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <button
              onClick={() => setFontSize(Math.max(10, fontSize - 1))}
              className="px-2 py-1 hover:bg-gray-700 rounded transition-colors"
            >
              -
            </button>
            <span className="font-mono w-8 text-center">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 1))}
              className="px-2 py-1 hover:bg-gray-700 rounded transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {showSearchBar && (
        <div className="flex-shrink-0 bg-[#2d2d30] border-b border-gray-800 px-4 py-2 flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search in file..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-300 placeholder-gray-600"
            autoFocus
          />
          <button
            onClick={() => setShowSearchBar(false)}
            className="text-gray-500 hover:text-gray-300"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Enhanced Line Numbers */}
        <div 
          ref={lineNumbersRef}
          className="flex-shrink-0 bg-[#1e1e1e] text-right select-none border-r border-gray-800 overflow-y-auto min-w-[4rem]"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            lineHeight: '1.5rem'
          }}
        >
          {renderLineNumbers()}
        </div>

        {/* Code Area with Enhanced Features */}
        <div 
          className="flex-1 relative min-w-0 bg-[#1e1e1e]"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredLine(null)}
        >
          {/* Highlighted Code Layer */}
          <div 
            ref={highlightRef}
            className="absolute inset-0 overflow-auto p-4 pointer-events-none"
            style={{ 
              fontSize: `${fontSize}px`,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
              wordBreak: wordWrap ? 'break-word' : 'normal'
            }}
          >
            <pre className="font-mono leading-6 min-h-full">
              <code dangerouslySetInnerHTML={{ __html: highlighted }} />
            </pre>
          </div>

          {/* Textarea Layer */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onKeyUp={updateCursorPosition}
            onClick={updateCursorPosition}
            onSelect={updateCursorPosition}
            className="absolute inset-0 bg-transparent text-transparent caret-white p-4 font-mono resize-none focus:outline-none selection:bg-blue-500/30"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder="// এখানে BanglaScript কোড লিখুন..."
            style={{ 
              fontSize: `${fontSize}px`,
              lineHeight: '1.5rem',
              tabSize: 2,
              whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
              wordBreak: wordWrap ? 'break-word' : 'normal',
              caretColor: '#fff'
            }}
          />

          {/* Current Line Highlight */}
          <div 
            className="absolute left-0 right-0 bg-blue-500/5 pointer-events-none transition-all duration-150 border-l-2 border-blue-500"
            style={{ 
              height: '1.5rem',
              top: `${(cursorPosition.line - 1) * 24 + 16 - editorScrollTop}px`
            }}
          />

          {/* Hover Line Highlight */}
          {hoveredLine && hoveredLine !== cursorPosition.line && (
            <div 
              className="absolute left-0 right-0 bg-gray-800/20 pointer-events-none transition-all duration-150"
              style={{ 
                height: '1.5rem',
                top: `${(hoveredLine - 1) * 24 + 16 - editorScrollTop}px`
              }}
            />
          )}

          {/* Custom Cursor Indicator */}
          <div 
            ref={cursorRef}
            className="absolute w-0.5 bg-white animate-pulse pointer-events-none transition-all duration-75"
            style={{
              height: '1.2rem',
              left: `${16 + (cursorPosition.col - 1) * (fontSize * 0.6)}px`,
              top: `${(cursorPosition.line - 1) * 24 + 18 - editorScrollTop}px`,
              display: selection.start === selection.end ? 'block' : 'none'
            }}
          />
        </div>

        {/* Minimap */}
        {renderMinimap()}
      </div>

      {/* Enhanced Status Bar */}
      <div className="flex-shrink-0 bg-gradient-to-r from-[#007acc] to-[#0062a3] px-4 py-1 flex items-center justify-between text-xs text-white font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <Zap className="w-3 h-3 animate-pulse" />
            BanglaScript
          </span>
          <span className="opacity-80">UTF-8</span>
          <span className="opacity-80">LF</span>
          <span className="opacity-80">{wordWrap ? 'Wrap' : 'No Wrap'}</span>
        </div>
        
        <div className="flex items-center gap-4">
          {selection.start !== selection.end && (
            <span className="bg-white/20 px-2 py-0.5 rounded">
              {Math.abs(selection.end - selection.start)} selected
            </span>
          )}
          <span>Ln {cursorPosition.line}, Col {cursorPosition.col}</span>
          <span className="opacity-80">{lineCount} lines</span>
          <span className="opacity-80">{value.length} chars</span>
          <span className="opacity-80">{(new Blob([value]).size / 1024).toFixed(1)} KB</span>
        </div>
      </div>
    </div>
  );
}
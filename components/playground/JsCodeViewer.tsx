import { Code2, Copy, Download } from "lucide-react";
import { highlightJS } from "@/lib/playground-utils";
import { useState, useEffect, useRef } from 'react';

interface JsCodeViewerProps {
  jsCode: string;
}

export function JsCodeViewer({ jsCode }: JsCodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const codeScrollRef = useRef<HTMLDivElement>(null);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    const lineNumbers = lineNumbersRef.current;
    const codeScroll = codeScrollRef.current;
    if (!lineNumbers || !codeScroll) return;

    const syncFromCode = () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      lineNumbers.scrollTop = codeScroll.scrollTop;
      isSyncingRef.current = false;
    };

    const syncFromLines = () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      codeScroll.scrollTop = lineNumbers.scrollTop;
      isSyncingRef.current = false;
    };

    codeScroll.addEventListener('scroll', syncFromCode, { passive: true });
    lineNumbers.addEventListener('scroll', syncFromLines, { passive: true });

    return () => {
      codeScroll.removeEventListener('scroll', syncFromCode);
      lineNumbers.removeEventListener('scroll', syncFromLines);
    };
  }, []);

  if (!jsCode) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-600/20 dark:bg-blue-500/20 blur-2xl rounded-full animate-pulse"></div>
          <Code2 className="h-24 w-24 opacity-30 relative z-10 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
        </div>
        <div className="text-center space-y-3 max-w-md">
          <p className="text-gray-600 dark:text-gray-300 font-semibold text-lg">
            Transpiled JavaScript এখানে দেখাবে
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">
            কোড লিখে <span className="text-blue-600 dark:text-blue-400 font-medium">"Transpile করুন"</span> বাটনে ক্লিক করুন
          </p>
        </div>
        <div className="mt-8 flex gap-2">
          <div className="h-1 w-12 bg-blue-600/30 dark:bg-blue-500/30 rounded-full"></div>
          <div className="h-1 w-8 bg-blue-600/20 dark:bg-blue-500/20 rounded-full"></div>
          <div className="h-1 w-6 bg-blue-600/10 dark:bg-blue-500/10 rounded-full"></div>
        </div>
      </div>
    );
  }

  const lines = jsCode.split('\n');
  const highlighted = highlightJS(jsCode);

  return (
    <div className="relative h-full bg-white dark:bg-[#1e1e1e] flex flex-col">
      

      {/* Code editor area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Gutter (line numbers) */}
        <div
          ref={lineNumbersRef}
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
          }}
          className="absolute left-0 top-0 bottom-0 w-14 bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-gray-800/50 flex flex-col items-end pr-4 py-4 font-mono text-xs text-gray-500 dark:text-gray-600 select-none overflow-y-auto z-10"
        >
          {lines.map((_, i) => (
            <div key={i} className="leading-6 h-6 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code content */}
        <div
          ref={codeScrollRef}
          className="absolute left-14 right-0 top-0 bottom-0 overflow-auto"
            style={{ 
                scrollbarWidth: 'thin',
              scrollbarColor: '#374151 transparent' 
          }}
        >
          <pre className="px-4 py-4 font-mono text-sm leading-6 text-gray-900 dark:text-gray-100">
            <code dangerouslySetInnerHTML={{ __html: highlighted }} />
          </pre>
        </div>

        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02] dark:hidden"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02] hidden dark:block"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>   
    </div>
  );
}
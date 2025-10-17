import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, Code2, Maximize2, Minimize2, X, Copy, Check } from "lucide-react";
import { useState } from "react";
import { JsCodeViewer } from "./JsCodeViewer";
import { ConsoleOutput } from "./ConsoleOutput";

interface OutputPanelProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  jsCode: string;
  output: string;
  error: string;
  executionTime?: number | null;
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

  // Calculate lines from jsCode
  const lines = jsCode.split('\n');

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
              <span>main.js</span>
              <span className="ml-1 text-[10px] text-[#F7DF1E] data-[state=active]:text-[#F7DF1E]">JS</span>
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
      <div>
        {activeTab === "javascript" ? (
          // JavaScript-specific status bar
          <div className="flex items-center justify-between px-4 py-1 bg-[#007acc] text-white text-xs">
            <div className="flex items-center gap-4">
              <span>JavaScript</span>
              <span>UTF-8</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{lines.length} lines</span>
              <span>{jsCode.length} characters</span>
            </div>
          </div>
        ) : (
          // Generic status bar
          <div className="bg-[#007acc] border-t border-[#005a9e] px-4 py-1 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="text-white font-medium flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                Ready
              </span>
              {executionTime && (
                <span className="text-white/80">Execution: {executionTime?.toFixed(3)}ms</span>
              )}
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <span>UTF-8</span>
              <span>Console</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
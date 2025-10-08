"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, RotateCcw, Copy, Check, Download, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"
import { parse } from "@babel/parser"
import generate from "@babel/generator"

const KEYWORDS: { [key: string]: string } = {
  'সংখ্যা': 'let',
  'শব্দ': 'let',
  'বাক্য': 'let',
  'ধ্রুবক': 'const',
  'অনুষ্ঠান': 'function',
  'প্রেরণ': 'return',
  'যদি': 'if',
  'নাহলে': 'else',
  'অন্যথায়': 'else',
  'যখন': 'while',
  'জন্য': 'for',
  'থামাও': 'break',
  'চালিয়ে_যাও': 'continue',
  'নতুন': 'new',
  'শ্রেণী': 'class',
  'গঠন': 'constructor',
  'লিখো': 'console.log',
  'সমস্যা_লিখো': 'console.error',
  'পাওয়া': 'console.info',
  'পাঠাও': 'console.warn',
  'সত্য': 'true',
  'মিথ্যা': 'false',
  'শূন্য': 'null',
  'শুন্য': 'null',
  'চেষ্টা': 'try',
  'ধরো': 'catch',
  'অবশেষে': 'finally',
  'ফেলা': 'throw',
  'অপেক্ষা': 'await',
  'প্রতিজ্ঞা': 'Promise'
};

const BENGALI_DIGIT_START = 0x09E6;

function bengaliDigitsToAscii(str: string): string {
  return str.replace(/[\u09E6-\u09EF]/g, (ch) => {
    const code = ch.charCodeAt(0);
    return String(code - BENGALI_DIGIT_START);
  });
}

function isUnicodeLetter(ch: string): boolean {
  try {
    return /\p{L}/u.test(ch);
  } catch (e) {
    return /[A-Za-z\u00C0-\u024F\u0900-\u097F\u0980-\u09FF]/.test(ch);
  }
}

interface Token {
  type: string;
  text: string;
}

function tokenizePreserve(code: string): Token[] {
  const tokens: Token[] = [];
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
        if (esc) { esc = false; j++; continue; }
        if (c === '\\') { esc = true; j++; continue; }
        if (c === quote) { j++; break; }
        j++;
      }
      tokens.push({ type: 'string', text: code.slice(i, j) });
      i = j;
      continue;
    }

    if (ch === '/' && code[i+1] === '/') {
      let j = i + 2;
      while (j < n && code[j] !== '\n') j++;
      tokens.push({ type: 'comment', text: code.slice(i, j) });
      i = j;
      continue;
    }
    if (ch === '/' && code[i+1] === '*') {
      let j = i + 2;
      while (j < n && !(code[j] === '*' && code[j+1] === '/')) j++;
      j += 2;
      if (j > n) j = n;
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
        if (isUnicodeLetter(c) || c === '_' || c === '$' || /[0-9\u09E6-\u09EF]/.test(c)) { j++; continue; }
        break;
      }
      tokens.push({ type: 'word', text: code.slice(i, j) });
      i = j;
      continue;
    }

    tokens.push({ type: 'symbol', text: ch });
    i++;
  }

  return tokens;
}

function tokensToInterimJS(tokens: Token[]): string {
  return tokens.map(t => {
    if (t.type === 'string' || t.type === 'comment') return t.text;
    if (t.type === 'word') {
      if (KEYWORDS.hasOwnProperty(t.text)) return KEYWORDS[t.text];
      return t.text;
    }
    if (t.type === 'number') {
      return bengaliDigitsToAscii(t.text);
    }
    return t.text;
  }).join('');
}

function transpile(code_bjs: string): { success: boolean, output: string, error?: string } {
  try {
    const tokens = tokenizePreserve(code_bjs);
    const interimJS = tokensToInterimJS(tokens);
    const ast = parse(interimJS, { sourceType: 'module', plugins: ['jsx', 'classProperties'] });
    const gen = generate(ast);
    return { success: true, output: gen.code };
  } catch (err: any) {
    return { success: false, output: '', error: err.message };
  }
}

function executeTranspiled(jsCode: string): { success: boolean, output: string, error?: string } {
  try {
    const outputs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => outputs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
      error: (...args: any[]) => outputs.push(`Error: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}`),
      info: (...args: any[]) => outputs.push(`Info: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}`),
      warn: (...args: any[]) => outputs.push(`Warn: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}`),
    };
    const func = new Function('console', jsCode);
    func(customConsole);
    return { success: true, output: outputs.join('\n') };
  } catch (err: any) {
    return { success: false, output: '', error: err.message };
  }
}

const defaultBanglaCode = `// BanglaScript উদাহরণ
অনুষ্ঠান শুভেচ্ছা(নাম) {
    প্রেরণ "হ্যালো, " + নাম + "! BanglaScript এ স্বাগতম।";
}

সংখ্যা ব্যবহারকারী = "বিশ্ব";
সংখ্যা বার্তা = শুভেচ্ছা(ব্যবহারকারী);

লিখো(বার্তা);

// লুপের উদাহরণ
জন্য (সংখ্যা i = ১; i <= ৫; i++) {
    লিখো("সংখ্যা: " + i);
}`

export default function PlaygroundPage() {
  const [banglaCode, setBanglaCode] = useState(defaultBanglaCode)
  const [jsCode, setJsCode] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleTranspile = () => {
    setIsProcessing(true)
    const result = transpile(banglaCode)
    if (result.success) {
      setJsCode(result.output)
      setError("")
    } else {
      setError(result.error || "Transpilation failed")
      setJsCode("")
    }
    setOutput("")
    setIsProcessing(false)
  }

  const handleRun = () => {
    setIsProcessing(true)
    const transpileResult = transpile(banglaCode)

    if (!transpileResult.success) {
      setError(transpileResult.error || "Transpilation failed")
      setIsProcessing(false)
      return
    }

    setJsCode(transpileResult.output)

    const executeResult = executeTranspiled(transpileResult.output)

    if (executeResult.success) {
      setOutput(executeResult.output)
      setError("")
    } else {
      setError(executeResult.error || "Execution failed")
      setOutput("")
    }
    setIsProcessing(false)
  }

  const handleReset = () => {
    setBanglaCode(defaultBanglaCode)
    setJsCode("")
    setOutput("")
    setError("")
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([jsCode], { type: "text/javascript" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "output.js"
    a.click()
    URL.revokeObjectURL(url)
  }

  const examples = [
    {
      title: "Variables & Functions",
      code: `সংখ্যা নাম = "আহমেদ";
ধ্রুবক বয়স = ২৫;

অনুষ্ঠান পরিচয়() {
    লিখো("আমার নাম " + নাম);
    লিখো("আমার বয়স " + বয়স);
}

পরিচয়();`
    },
    {
      title: "Conditionals",
      code: `সংখ্যা স্কোর = ৮৫;

যদি (স্কোর >= ৮০) {
    লিখো("চমৎকার!");
} নাহলে যদি (স্কোর >= ৬০) {
    লিখো("ভাল!");
} নাহলে {
    লিখো("আরো চেষ্টা করুন।");
}`
    },
    {
      title: "Arrays & Loops",
      code: `সংখ্যা ফল = ["আম", "কলা", "আপেল"];

জন্য (সংখ্যা i = ০; i < ফল.length; i++) {
    লিখো("ফল: " + ফল[i]);
}

// forEach লুপ
ফল.forEach(অনুষ্ঠান(ফল) {
    লিখো("আমি " + ফল + " পছন্দ করি");
});`
    }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 border-b border-border">
        <div className="container px-4 py-8">
          <div className="mb-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="mb-3 text-4xl font-bold">Interactive Playground</h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Write BanglaScript code and see it transpile to JavaScript in real-time. Run your code to see the output.
              </p>
            </motion.div>
          </div>

          {/* Example Buttons */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {examples.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setBanglaCode(example.code)}
                  className="text-xs"
                >
                  <Lightbulb className="h-3 w-3 mr-1" />
                  {example.title}
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-3">
            <Button onClick={handleRun} disabled={isProcessing} className="glow-accent">
              <Play className="mr-2 h-4 w-4" />
              {isProcessing ? 'Processing...' : 'Run Code'}
            </Button>
            <Button onClick={handleTranspile} disabled={isProcessing} variant="outline">
              Transpile Only
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            {jsCode && (
              <>
                <Button onClick={handleCopy} variant="outline">
                  {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copied ? "Copied!" : "Copy JS"}
                </Button>
                <Button onClick={handleDownload} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download JS
                </Button>
              </>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="font-mono text-sm font-bold text-primary-foreground">বা</span>
                </div>
                <h2 className="text-lg font-semibold">BanglaScript Input</h2>
              </div>
              <Textarea
                value={banglaCode}
                onChange={(e) => setBanglaCode(e.target.value)}
                className="font-mono text-sm min-h-[500px] resize-none"
                placeholder="Write your BanglaScript code here..."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Tabs defaultValue="javascript" className="h-full">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Output</h2>
                  <TabsList>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="console">Console</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="javascript" className="mt-0">
                  <div className="bg-muted rounded-md p-4 min-h-[500px]">
                    {jsCode ? (
                      <pre className="font-mono text-sm overflow-auto">
                        <code>{jsCode}</code>
                      </pre>
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        Transpiled JavaScript will appear here...
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="console" className="mt-0">
                  <div className="bg-black text-green-400 rounded-md p-4 min-h-[500px] font-mono text-sm overflow-auto">
                    {error ? (
                      <pre className="text-red-400">Error: {error}</pre>
                    ) : output ? (
                      <pre>{output}</pre>
                    ) : (
                      <div className="text-gray-500 flex h-full items-center justify-center">Run your code to see the output here...</div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Quick Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Variables</h4>
                    <code className="text-xs">সংখ্যা নাম = "মান"</code><br />
                    <code className="text-xs">ধ্রুবক সংখ্যা = ১০</code>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Functions</h4>
                    <code className="text-xs">অনুষ্ঠান নাম() {`{}`}</code><br />
                    <code className="text-xs">প্রেরণ মান</code>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Conditionals</h4>
                    <code className="text-xs">যদি (শর্ত) {`{}`}</code><br />
                    <code className="text-xs">নাহলে {`{}`}</code>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Loops</h4>
                    <code className="text-xs">{"জন্য (i = ০; i < ১০; i++) {}"}</code><br />
                    <code className="text-xs">যখন (শর্ত) {`{}`}</code>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Numbers</h4>
                    <code className="text-xs">০ ১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯</code>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Console</h4>
                    <code className="text-xs">লিখো("বার্তা")</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
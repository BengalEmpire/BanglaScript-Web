// lib/transpiler.ts
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import * as Sanscript from "@indic-transliteration/sanscript";

export interface Token {
  type: string;
  text: string;
}

const KEYWORDS: { [key: string]: string } = {
  'সংখ্যা': 'let',
  'শব্দ': 'let',
  'বাক্য': 'let',
  'ধ্রুবক': 'const',
  'অনুষ্ঠান': 'function',
  'প্রেরণ': 'return',
  'যদি': 'if',
  'নাহলে': 'else',
  'অন্যথায়': 'else',
  'অন্যথায়': 'else',
  'যখন': 'while',
  'জন্য': 'for',
  'থামাও': 'break',
  'চালিয়ে_যাও': 'continue',
  'চালিয়ে_যাও': 'continue',
  'নতুন': 'new',
  'শ্রেণী': 'class',
  'গঠন': 'constructor',
  'লিখো': 'console.log',
  'সমস্যা_লিখো': 'console.error',
  'পাওয়া': 'console.info',
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

export function tokenizePreserve(code: string): Token[] {
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

    if (ch === '/' && i + 1 < n && code[i+1] === '/') {
      let j = i + 2;
      while (j < n && code[j] !== '\n') j++;
      tokens.push({ type: 'comment', text: code.slice(i, j) });
      i = j;
      continue;
    }

    if (ch === '/' && i + 1 < n && code[i+1] === '*') {
      let j = i + 2;
      while (j + 1 < n && !(code[j] === '*' && code[j+1] === '/')) j++;
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

    tokens.push({ type: 'symbol', text: ch });
    i++;
  }

  return tokens;
}

export function tokensToInterimJS(tokens: Token[]): string {
  return tokens.map(t => {
    if (t.type === 'string' || t.type === 'comment') return t.text;
    if (t.type === 'word') {
      if (KEYWORDS.hasOwnProperty(t.text)) return KEYWORDS[t.text];
      // Transliterate Bengali identifiers to ITRANS
      try {
        return Sanscript.t(t.text, 'bengali', 'itrans');
      } catch (e) {
        // Fallback to original if transliteration fails
        return t.text;
      }
    }
    if (t.type === 'number') {
      return bengaliDigitsToAscii(t.text);
    }
    return t.text;
  }).join('');
}

export function transpile(code_bjs: string): { success: boolean; output: string; error?: string } {
  try {
    const tokens = tokenizePreserve(code_bjs);
    const interimJS = tokensToInterimJS(tokens);
    // Use Babel to parse and generate pretty code
    const ast = parse(interimJS, { 
      sourceType: 'module', 
      plugins: ['jsx', 'classProperties', 'typescript'] 
    });
    const gen = generate(ast, { retainLines: true });
    return { success: true, output: gen.code || interimJS };
  } catch (err: any) {
    // Fallback to raw interimJS if Babel fails
    const tokens = tokenizePreserve(code_bjs);
    const interimJS = tokensToInterimJS(tokens);
    return { success: true, output: interimJS, error: 'Babel formatting failed, using raw output: ' + err.message };
  }
}

export function executeCode(jsCode: string): { success: boolean; output: string; error?: string } {
  try {
    const outputs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => outputs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
      error: (...args: any[]) => outputs.push(`❌ Error: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}`),
      info: (...args: any[]) => outputs.push(`ℹ️ Info: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}`),
      warn: (...args: any[]) => outputs.push(`⚠️ Warn: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}`),
    };
    const func = new Function('console', jsCode);
    func(customConsole);
    return { success: true, output: outputs.join('\n') || '✓ Code executed successfully (no output)' };
  } catch (err: any) {
    return { success: false, output: '', error: err.message };
  }
}
import { tokenizePreserve } from "@/lib/transpiler"; 
import { KEYWORDS } from '@/data/keywords'

export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function highlightBangla(code: string): string {
  // Assuming tokenizePreserve and KEYWORDS are imported
  const tokens = tokenizePreserve(code);
  return tokens.map(t => {
    let className = '';
    if (t.type === 'comment') className = 'text-green-600 italic';
    else if (t.type === 'string') className = 'text-emerald-400';
    else if (t.type === 'number') className = 'text-amber-400';
    else if (t.type === 'word') {
      if (KEYWORDS[t.text.normalize('NFC')]) className = 'text-purple-400 font-semibold'; 
      else className = 'text-blue-300';
    } else {
      className = 'text-orange-400';
    }
    return `<span class="${className}">${escapeHtml(t.text)}</span>`;
  }).join('');
}

export function highlightJS(code: string): string {
  // Assuming tokenizePreserve and JS_KEYWORDS are defined/imported
  const JS_KEYWORDS = [
    'let', 'var', 'const', 'function', 'return', 'if', 'else', 'while', 'for', 'do',
    'break', 'continue', 'new', 'class', 'constructor', 'true', 'false', 'null',
    'undefined', 'try', 'catch', 'finally', 'throw', 'await', 'async', 'switch',
    'case', 'default', 'import', 'export', 'from', 'as', 'delete', 'in', 'of',
    'this', 'extends', 'static', 'console'
  ];
  const tokens = tokenizePreserve(code);
  return tokens.map(t => {
    let className = '';
    if (t.type === 'comment') className = 'text-green-600 italic';
    else if (t.type === 'string') className = 'text-green-400';
    else if (t.type === 'number') className = 'text-yellow-400';
    else if (t.type === 'word') {
      if (JS_KEYWORDS.includes(t.text)) className = 'text-blue-400';
      else className = 'text-blue-300';
    } else {
      className = 'text-pink-400';
    }
    return `<span class="${className}">${escapeHtml(t.text)}</span>`;
  }).join('');
}
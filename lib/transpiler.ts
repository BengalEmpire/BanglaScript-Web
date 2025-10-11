import { KEYWORDS } from '@/data/keywords.js';
import { COMMON_MAP } from '@/data/common_map.js';

const BENGALI_DIGIT_START = 0x09E6;

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
    tokens.push({ type: 'symbol', text: ch });
    i++;
  }
  return tokens;
}

export function simpleTransliterate(word: string): string {
  if (word.includes("_")) {
    const parts = word.split("_");
    const transliteratedParts = parts.map(part => COMMON_MAP[part] || simpleTransliterate(part));
    return transliteratedParts.join("_");
  }

  if (COMMON_MAP[word]) return COMMON_MAP[word];
  return word
    .replace(/[অ]/g, "o")
    .replace(/[আ]/g, "a")
    .replace(/[ই]/g, "i")
    .replace(/[ঈ]/g, "ee")
    .replace(/[উ]/g, "u")
    .replace(/[ঊ]/g, "oo")
    .replace(/[এ]/g, "e")
    .replace(/[ঐ]/g, "oi")
    .replace(/[ও]/g, "o")
    .replace(/[ঔ]/g, "ou")
    .replace(/[ক-হ]/g, "x");
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

export function transpile(code: string): { success: boolean; output: string; error?: string } {
  try {
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
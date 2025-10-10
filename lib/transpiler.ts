// app/lib/transpiler.ts
export const KEYWORDS = {
  'সংখ্যা': 'let',
  'শব্দ': 'let',
  'বাক্য': 'let',
  'চলক': 'let',
  'পরিবর্তনশীল': 'var',
  'ধ্রুবক': 'const',
  'অনুষ্ঠান': 'function',
  'ফাংশন': 'function',
  'প্রেরণ': 'return',
  'ফেরত': 'return',
  'যদি': 'if',
  'নাহলে': 'else',
  'অন্যথায়': 'else',
  'নাহলে_যদি': 'else if',
  'যখন': 'while',
  'জন্য': 'for',
  'প্রতিটি': 'for',
  'করো': 'do',
  'থামাও': 'break',
  'চালিয়ে_যাও': 'continue',
  'নতুন': 'new',
  'শ্রেণী': 'class',
  'ক্লাস': 'class',
  'গঠন': 'constructor',
  'লিখো': 'console.log',
  'ছাপাও': 'console.log',
  'সমস্যা_লিখো': 'console.error',
  'সতর্কতা': 'console.warn',
  'তথ্য': 'console.info',
  'সত্য': 'true',
  'মিথ্যা': 'false',
  'শূন্য': 'null',
  'শুন্য': 'null',
  'অনির্ধারিত': 'undefined',
  'চেষ্টা': 'try',
  'ধরো': 'catch',
  'অবশেষে': 'finally',
  'ফেলা': 'throw',
  'অপেক্ষা': 'await',
  'অ্যাসিঙ্ক': 'async',
  'সুইচ': 'switch',
  'কেস': 'case',
  'ডিফল্ট': 'default',
  'আমদানি': 'import',
  'রপ্তানি': 'export',
  'থেকে': 'from',
  'হিসেবে': 'as',
  'মুছো': 'delete',
  'ইন': 'in',
  'অফ': 'of',
  'এটি': 'this',
  'বিস্তৃত': 'extends',
  'স্ট্যাটিক': 'static',
  'স্থির': 'static'
};

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
  const map: { [key: string]: string } = {
  "পরিবার": "paribar",
  "সমাজ":"socity",
  "নাম": "name",
  "বয়স": "boyos",
  "পরিচয়": "poricoy",
  "ফলাফল": "result",
  "শুভেচ্ছা": "shubhochcha",
  "যোগফল": "jogfol",
  "বাক্য": "bakyo",
  "বর্ণ":"borno",
  "মান":"value",
  "i": "i",
  "j": "j",
  "k": "k",

  "ব্যবহারকারী": "byabaharkari",
  "ছাত্র": "chhatro",
  "শিক্ষক": "shikkhok",
  "মানুষ": "manush",
  "গ্রাহক": "grahok",
  "কর্মী": "kormi",
  "পণ্য": "ponno",
  "পেশা": "pesha",
  "বই": "boi",
  "গাড়ি": "gari",
  "ঠিকানা": "thikana",
  "ফোন": "phone",
  "ইমেল": "email",
  "পাসওয়ার্ড": "password",
  "অ্যাকাউন্ট": "account",

  "বোতাম": "button",
  "ফর্ম": "form",
  "ইনপুট": "input",
  "বাটন": "button",
  "লেবেল": "label",
  "ছবি": "chobi",
  "চিত্র": "chitra",
  "টেক্সট": "text",
  "বার্তাসমূহ": "bartasomuho",

  "সংখ্যা": "songkha",
  "গণনা": "gonona",
  "গড়": "gor",
  "তালিকা": "talika",
  "অ্যারে": "array",
  "অবজেক্ট": "object",
  "ডাটা": "data",

  "সময়": "shomoy",
  "তারিখ": "tarikh",
  "দিন": "din",
  "মাস": "mas",
  "বছর": "bochor",
  "মুহূর্ত": "muhurt",
  "ঘণ্টা": "ghonta",
  "সেকেন্ড": "second",

  "অবস্থা": "obostha",
  "শর্ত": "shorot",
  "গণিত": "gonit",
  "পরীক্ষা": "porikkha",
  "ফল": "fol",
  "মন্তব্য": "montobbo",
  "বিবরণ": "bibron",
  "প্রশ্ন":"prosno",

  "যোগ": "jog",
  "বিয়োগ": "biyog",
  "গুন": "gun",
  "ভাগ": "vag",
  "নাম্বার": "number",
  "নম্বর": "number",
  "চালাও": "chalaw",
  "দেখাও": "dekhaw",
  "লিখো": "likho",
  "নাও": "nao",
  "পাঠাও": "pathaw",
  "ফিরিয়ে_দাও": "feriye_dao",
  "সংরক্ষণ": "songrokkhon",
  "সম্পাদনা": "shompodona",
  "মুছে_ফেলো": "muche_felo",

  "ফাইল": "file",
  "ফোল্ডার": "folder",
  "নেটওয়ার্ক": "network",
  "অনুরোধ": "onurodh",
  "উত্তর": "response",
  "ইউআরএল": "url",
  "সার্ভার": "server",
  "ডাটাবেস": "database",
  "সংযোগ": "shongjog",
  "সংরক্ষিত": "stored",

  "লগইন": "login",
  "লগআউট": "logout",
  "নিবন্ধন": "register",
  "প্রমাণীকরণ": "auth",
  "টোকেন": "token",
  "ব্যবহার": "use",

  "লোডিং": "loading",
  "ত্রুটি": "error",
  "সাফল্য": "success",
  "সতর্কতা": "warning",
  "বার্তা": "message",

  "শহর": "shohor",
  "দেশ": "desh",
  "ঠিক": "thik",

  "লিংক": "link",
  "ছাত্রছাত্রী": "chhatrochhatri",
  "প্রকল্প": "projokt",

  "ফাংশন": "function",

  "ফ্যাক্টরিয়াল":"factorial",
  "আইন":"laws",
  "বিচার":"Justice",
  "ভ্রমণ":"Travel",
  "অভিযান":"Operation",
  "অভিনয়":"Acting",
  "গান":"Song",
  "নাচ":"Dance",
  "চলচ্চিত্র":"Movie",
  "সঙ্গীত":"Music",
  "কবিতা":"Poetry",
  "গল্প":"Story",
  "উপন্যাস":"Novel",
  "ক্যাম্পাস":"Campus",
  "বিশ্ববিদ্যালয়":"University",
  "কলেজ":"College",
  "স্কুল":"School",
  "শিক্ষা":"Education",
  "জীবন":"Life",
  "ভালোবাসা":"Love",
  "বন্ধুত্ব":"Friendship",

  "প্রাথমিক":"Primary",
  "মাধ্যমিক":"Secondary",
  "উচ্চমাধ্যমিক":"HigherSecondary",
  "স্নাতক":"Graduate",
  "স্নাতকোত্তর":"PostGraduate",
  "ডক্টরেট":"Doctorate",
  "পিএইচডি":"PhD",
  "গবেষণা":"Research",

  "অ্যাপ": "app",
  "অ্যাপ্লিকেশন": "application",
  "সফটওয়্যার": "software",
  "হার্ডওয়্যার": "hardware",
  "ইন্টারফেস": "interface",
  "ব্যাকএন্ড": "backend",
  "ফ্রন্টএন্ড": "frontend",
  "ডিজাইন": "design",
  "উন্নয়ন": "development",

  "user": "user",
  "data": "data",
  "info": "info",
  "name": "nam",
  "age": "boyos",
  "email": "email",
  "password": "password",
  "result": "folafol",
  "value": "man",
  "count": "gonona",
  "index": "shuchok",
  "total": "mot",
  "sum": "jogfol",
  "average": "gor",
  "print": "likho",
  "show": "dekhao",
  "message": "barta",
  "error": "vul",
  "success": "shafollo",
  "warning": "shotorkota",
  };
  return map[word] || word.replace(/[হ-া]/g, 'x');
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

export function executeCode(jsCode: string): { success: boolean; output: string; error?: string } {
  try {
    const outputs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => outputs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
      error: (...args: any[]) => outputs.push(`❌ Error: ${args.join(' ')}`),
      info: (...args: any[]) => outputs.push(`ℹ️ Info: ${args.join(' ')}`),
      warn: (...args: any[]) => outputs.push(`⚠️ Warn: ${args.join(' ')}`),
    };
    const func = new Function('console', jsCode);
    func(customConsole);
    return { success: true, output: outputs.join('\n') || '✓ কোড সফলভাবে চলেছে (কোনো আউটপুট নেই)' };
  } catch (err) {
    return { success: false, output: '', error: (err as Error).message };
  }
}
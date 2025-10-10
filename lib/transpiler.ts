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
  "সমাজ": "society",
  "পরিচয়": "porichoy",
  "নাম": "nam",
  "পেশা":"occupation",
  "বয়স": "boyos",
  "লিঙ্গ": "gender",
  "মান": "value",
  "ধরন": "type",
  "প্রকার": "prokar",
  "ফলাফল": "result",
  "শুভেচ্ছা": "shubhochcha",
  "যোগফল": "jogfol",
  "বাক্য": "bakyo",
  "বর্ণ": "borno",
  "বিবৃতি": "statement",
  "চিহ্ন": "chinho",
  "আইডি": "id",
  "কোড": "code",
  "বিবরণ": "biboron",


  "ব্যবহারকারী": "user",
  "ছাত্র": "chhatro",
  "ছাত্রী": "chhatri",
  "ছাত্রছাত্রী": "chhatrochhatri",
  "শিক্ষক": "teacher",
  "শিক্ষার্থী": "student",
  "মানুষ": "manush",
  "গ্রাহক": "grahok",
  "কর্মী": "kormi",
  "কর্মচারী": "kormochari",
  "অ্যাডমিন": "admin",
  "ব্যবস্থাপক": "manager",
  "অতিথি": "guest",
  "নেতা": "neta",
  "কর্মকর্তা": "officer",
  "লেখক": "lekhok",
  "পাঠক": "pathok",


  "স্কুল": "school",
  "কলেজ": "college",
  "বিশ্ববিদ্যালয়": "university",
  "ক্যাম্পাস": "campus",
  "শিক্ষা": "education",
  "পাঠ": "lesson",
  "বিষয়": "subject",
  "অধ্যায়": "chapter",
  "প্রশ্ন": "question",
  "উত্তর": "answer",
  "পরীক্ষা": "exam",
  "ফল": "result",
  "গবেষণা": "research",
  "প্রাথমিক": "primary",
  "মাধ্যমিক": "secondary",
  "উচ্চমাধ্যমিক": "higher_secondary",
  "স্নাতক": "graduate",
  "স্নাতকোত্তর": "post_graduate",
  "ডক্টরেট": "doctorate",
  "পিএইচডি": "phd",


  "গণিত": "math",
  "বিজ্ঞান": "science",
  "ফ্যাক্টরিয়াল": "factorial",
  "গড়": "average",
  "সংখ্যা": "number",
  "গণনা": "count",
  "গুন": "multiply",
  "ভাগ": "divide",
  "বিয়োগ": "subtract",
  "যোগ": "add",
  "সমীকরণ": "equation",
  "ফর্মুলা": "formula",
  "তালিকা": "list",
  "অ্যারে": "array",
  "অবজেক্ট": "object",
  "ডাটা": "data",
  "ইউনিট": "unit",
  "গতি": "speed",
  "ওজন": "weight",
  "দৈর্ঘ্য": "length",
  "প্রস্থ": "width",
  "উচ্চতা": "height",
  "এলাকা": "area",
  "আয়তন": "volume",


  "সময়": "time",
  "তারিখ": "date",
  "দিন": "day",
  "মাস": "month",
  "বছর": "year",
  "মুহূর্ত": "moment",
  "ঘণ্টা": "hour",
  "সেকেন্ড": "second",
  "মিনিট": "minute",
  "সপ্তাহ": "week",
  "আজ": "today",
  "কাল": "tomorrow",
  "গতকাল": "yesterday",
  "এখন": "now",
  "পরে": "later",


  "ঠিকানা": "address",
  "শহর": "city",
  "গ্রাম": "village",
  "উপজেলা": "upozela",
  "জেলা": "zilla",
  "দেশ": "country",
  "মহাদেশ": "continent",
  "মানচিত্র": "map",
  "অবস্থান": "location",


  "বোতাম": "button",
  "ফর্ম": "form",
  "ইনপুট": "input",
  "বাটন": "button",
  "লেবেল": "label",
  "ছবি": "image",
  "চিত্র": "chitra",
  "টেক্সট": "text",
  "বার্তা": "message",
  "মেনু": "menu",
  "লিস্ট": "list",
  "ট্যাব": "tab",
  "পেজ": "page",
  "অ্যাপ": "app",
  "অ্যাপ্লিকেশন": "application",
  "সফটওয়্যার": "software",
  "হার্ডওয়্যার": "hardware",
  "ইন্টারফেস": "interface",
  "ব্যাকএন্ড": "backend",
  "ফ্রন্টএন্ড": "frontend",
  "ডিজাইন": "design",
  "উন্নয়ন": "development",
  "মডাল": "modal",
  "উইন্ডো": "window",
  "বোর্ড": "board",
  "নেভিগেশন": "navigation",
  "প্যানেল": "panel",
  "ড্যাশবোর্ড": "dashboard",
  "আইকন": "icon",


  "ফাইল": "file",
  "ফোল্ডার": "folder",
  "নেটওয়ার্ক": "network",
  "অনুরোধ": "request",
  "ইউআরএল": "url",
  "সার্ভার": "server",
  "ডাটাবেস": "database",
  "সংযোগ": "connection",
  "ক্লায়েন্ট": "client",
  "ইন্টারনেট": "internet",
  "এপিআই": "api",
  "রাউট": "route",
  "পাথ": "path",
  "হেডার": "header",
  "বডি": "body",
  "ফেচ": "fetch",
  "পোস্ট": "post",
  "গেট": "get",


  "লগইন": "login",
  "লগআউট": "logout",
  "নিবন্ধন": "register",
  "প্রমাণীকরণ": "auth",
  "টোকেন": "token",
  "পাসওয়ার্ড": "password",
  "ব্যবহার": "use",
  "ভেরিফাই": "verify",
  "সেশন": "session",
  "অ্যাকাউন্ট": "account",
  "নতুন_ব্যবহারকারী": "new_user",


  "অবস্থা": "state",
  "শর্ত": "condition",
  "যাচাই": "validate",
  "তুলনা": "compare",
  "সক্রিয়": "active",
  "নিষ্ক্রিয়": "inactive",
  "লোডিং": "loading",
  "ত্রুটি": "error",
  "সাফল্য": "success",
  "সতর্কতা": "warning",
  "প্রক্রিয়াধীন": "processing",
  "সম্পন্ন": "complete",


  "চালাও": "run",
  "দেখাও": "show",
  "লিখো": "write",
  "নাও": "take",
  "পাঠাও": "send",
  "ফিরিয়ে_দাও": "return",
  "সংরক্ষণ": "save",
  "সম্পাদনা": "edit",
  "মুছে_ফেলো": "delete",
  "তৈরি_করো": "create",
  "সংযোগ_করো": "connect",
  "যোগ_করো": "add",
  "সরাও": "remove",
  "নির্বাচন_করো": "select",
  "রিসেট": "reset",
  "রিফ্রেশ": "refresh",
  "খুলো": "open",
  "বন্ধ_করো": "close",
  "চলাও": "execute",


  "গান": "song",
  "নাচ": "dance",
  "চলচ্চিত্র": "movie",
  "সঙ্গীত": "music",
  "কবিতা": "poetry",
  "গল্প": "story",
  "উপন্যাস": "novel",
  "অভিনয়": "acting",
  "অভিযান": "operation",
  "ভ্রমণ": "travel",
  "শিল্প": "art",
  "সংস্কৃতি": "culture",


  "জীবন": "life",
  "ভালোবাসা": "love",
  "বন্ধুত্ব": "friendship",
  "আনন্দ": "joy",
  "দুঃখ": "sadness",
  "রাগ": "anger",
  "শান্তি": "peace",
  "আশা": "hope",
  "বিশ্বাস": "trust",


  "আইন": "law",
  "বিচার": "justice",
  "সংবিধান": "constitution",
  "সরকার": "government",
  "নীতি": "policy",
  "নিয়ম": "rule",


  "লিংক": "link",
  "কমেন্ট": "comment",
  "রেটিং": "rating",
  "স্কোর": "score",
  "প্রতিক্রিয়া": "feedback",
  "উদ্দেশ্য": "goal",
  "প্রকল্প": "project",
  "ইভেন্ট": "event",
  "অ্যাকশন": "action",
  "মোড": "mode",

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
  "warning": "shotorkota"
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
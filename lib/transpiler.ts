const keywordMap: Record<string, string> = {
  সংখ্যা: 'let',
  বাক্য: 'let',
  ধ্রুবক: 'const',
  অনুষ্ঠান: 'function',
  প্রেরণ: 'return',
  যদি: 'if',
  নাহলে: 'else',
  অন্যথায়: 'else',
  যখন: 'while',
  জন্য: 'for',
  থামাও: 'break',
  চালিয়ে_যাও: 'continue',
  নতুন: 'new',
  শ্রেণী: 'class',
  গঠন: 'constructor',
  লিখো: 'console.log',
  সমস্যা_লিখো: 'console.error',
  পাওয়া: 'console.info',
  পাঠাও: 'console.warn',
  সত্য: 'true',
  মিথ্যা: 'false',
  শূন্য: 'null',
  শুন্য: 'null',
  চেষ্টা: 'try',
  ধরো: 'catch',
  অবশেষে: 'finally',
  ফেলা: 'throw',
  অপেক্ষা: 'await',
  প্রতিজ্ঞা: 'Promise'
}

export function transpile(banglaCode: string): { success: boolean; output: string; error?: string } {
  try {
    let jsCode = banglaCode

    // Sort keywords by length (longest first) to avoid partial replacements
    const sortedKeywords = Object.keys(keywordMap).sort((a, b) => b.length - a.length)

    // Replace Bengali keywords with JavaScript keywords
    for (const banglaKeyword of sortedKeywords) {
      const jsKeyword = keywordMap[banglaKeyword]
      // Use word boundaries to avoid replacing parts of words
      const regex = new RegExp(`\\b${banglaKeyword}\\b`, "g")
      jsCode = jsCode.replace(regex, jsKeyword)
    }

    // Convert Bengali numerals to Arabic numerals
    const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"]
    const arabicNumerals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

    for (let i = 0; i < bengaliNumerals.length; i++) {
      const regex = new RegExp(bengaliNumerals[i], "g")
      jsCode = jsCode.replace(regex, arabicNumerals[i])
    }

    return {
      success: true,
      output: jsCode,
    }
  } catch (error) {
    return {
      success: false,
      output: "",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export function executeCode(jsCode: string): { success: boolean; output: string; error?: string } {
  try {
    // Capture console.log output
    const logs: string[] = []
    const originalLog = console.log

    console.log = (...args: unknown[]) => {
      logs.push(args.map((arg) => String(arg)).join(" "))
    }

    // Execute the code
    // eslint-disable-next-line no-eval
    eval(jsCode)

    // Restore console.log
    console.log = originalLog

    return {
      success: true,
      output: logs.join("\n") || "Code executed successfully (no output)",
    }
  } catch (error) {
    return {
      success: false,
      output: "",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

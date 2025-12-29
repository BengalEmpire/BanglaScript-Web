"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Copy, Check, ChevronDown, ChevronUp, Lightbulb, Terminal, Code2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

interface CodeExampleProps {
    title: string;
    titleBn: string;
    description: string;
    code: string;
    output: string;
    explanation?: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: string;
}

const difficultyColors = {
    beginner: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' },
    intermediate: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' },
    advanced: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20' }
};

export function InteractiveCodeExample({
    title,
    titleBn,
    description,
    code,
    output,
    explanation,
    difficulty,
    category
}: CodeExampleProps) {
    const [showOutput, setShowOutput] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyCode = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const colors = difficultyColors[difficulty];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card overflow-hidden"
        >
            {/* Header */}
            <div className="p-5 border-b border-border bg-muted/30">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-bold mb-1">{titleBn}</h3>
                        <p className="text-sm text-muted-foreground">{title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "px-2 py-1 rounded-md text-xs font-medium",
                            colors.bg, colors.text, colors.border, "border"
                        )}>
                            {difficulty}
                        </span>
                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                            {category}
                        </span>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            {/* Code Editor */}
            <div className="relative">
                {/* Action Buttons */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                    <button
                        onClick={copyCode}
                        className="p-2 rounded-lg bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                        title="Copy code"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-500" />
                        ) : (
                            <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                    </button>
                </div>

                {/* Code Block */}
                <div className="overflow-x-auto">
                    <SyntaxHighlighter
                        language="javascript"
                        style={vscDarkPlus}
                        customStyle={{
                            margin: 0,
                            padding: '1.25rem',
                            background: 'rgb(30 30 30)',
                            fontSize: '0.875rem',
                            lineHeight: '1.6',
                            borderRadius: 0
                        }}
                        showLineNumbers
                        lineNumberStyle={{
                            color: 'rgba(255,255,255,0.3)',
                            paddingRight: '1rem',
                            minWidth: '2rem'
                        }}
                    >
                        {code}
                    </SyntaxHighlighter>
                </div>
            </div>

            {/* Output Section */}
            <div className="border-t border-border">
                <button
                    onClick={() => setShowOutput(!showOutput)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-primary" />
                        <span className="font-medium text-sm">আউটপুট দেখুন</span>
                    </div>
                    {showOutput ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                </button>

                <motion.div
                    initial={false}
                    animate={{ height: showOutput ? 'auto' : 0, opacity: showOutput ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                >
                    <div className="px-4 pb-4">
                        <pre className="p-4 rounded-lg bg-muted font-mono text-sm whitespace-pre-wrap">
                            {output}
                        </pre>
                    </div>
                </motion.div>
            </div>

            {/* Explanation Section */}
            {explanation && (
                <div className="border-t border-border">
                    <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            <span className="font-medium text-sm">ব্যাখ্যা</span>
                        </div>
                        {showExplanation ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                    </button>

                    <motion.div
                        initial={false}
                        animate={{ height: showExplanation ? 'auto' : 0, opacity: showExplanation ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4">
                            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm leading-relaxed">
                                {explanation}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}

// Pre-built code examples for the learning page
export const codeExamples: CodeExampleProps[] = [
    {
        title: "Hello World",
        titleBn: "১. হ্যালো ওয়ার্ল্ড",
        description: "আপনার প্রথম বাংলাস্ক্রিপ্ট প্রোগ্রাম",
        code: `// এটি একটি কমেন্ট
লিখো("হ্যালো বিশ্ব!");
লিখো("আমি বাংলাস্ক্রিপ্ট শিখছি!");`,
        output: `হ্যালো বিশ্ব!
আমি বাংলাস্ক্রিপ্ট শিখছি!`,
        explanation: "`লিখো()` হলো console.log() এর বাংলা সমতুল্য। এটি আপনার টেক্সট কনসোলে প্রিন্ট করে।",
        difficulty: "beginner",
        category: "Basics"
    },
    {
        title: "Variables & Numbers",
        titleBn: "২. ভেরিয়েবল ও বাংলা সংখ্যা",
        description: "ভেরিয়েবল তৈরি এবং বাংলা সংখ্যা ব্যবহার",
        code: `ধ্রুবক নাম = "মাহমুদ";
চলক বয়স = ২০;
সংখ্যা উচ্চতা = ১৭৬;

লিখো("নাম: " + নাম);
লিখো("বয়স: " + বয়স);
লিখো("উচ্চতা: " + উচ্চতা + " সেমি");`,
        output: `নাম: মাহমুদ
বয়স: 20
উচ্চতা: 176 সেমি`,
        explanation: "`ধ্রুবক` = const (পরিবর্তন হবে না), `চলক`/`সংখ্যা` = let (পরিবর্তন হতে পারে)। বাংলা সংখ্যা (০-৯) স্বয়ংক্রিয়ভাবে ইংরেজিতে রূপান্তরিত হয়।",
        difficulty: "beginner",
        category: "Variables"
    },
    {
        title: "Conditions",
        titleBn: "৩. শর্ত (যদি-নাহলে)",
        description: "কন্ডিশনাল স্টেটমেন্ট ব্যবহার",
        code: `সংখ্যা নম্বর = ৭৫;

যদি (নম্বর >= ৮০) {
    লিখো("গ্রেড: A+");
} নাহলে যদি (নম্বর >= ৭০) {
    লিখো("গ্রেড: A");
} নাহলে যদি (নম্বর >= ৬০) {
    লিখো("গ্রেড: B");
} নাহলে {
    লিখো("আরও পরিশ্রম করুন!");
}`,
        output: `গ্রেড: A`,
        explanation: "`যদি` = if, `নাহলে` = else, `নাহলে যদি` = else if। শর্ত সত্য হলে ব্লকের ভিতরের কোড চলবে।",
        difficulty: "beginner",
        category: "Conditions"
    },
    {
        title: "Loops",
        titleBn: "৪. লুপ (জন্য)",
        description: "ফর লুপ দিয়ে পুনরাবৃত্তি",
        code: `// ১ থেকে ৫ পর্যন্ত গণনা
জন্য (সংখ্যা i = ১; i <= ৫; i++) {
    লিখো("সংখ্যা: " + i);
}`,
        output: `সংখ্যা: 1
সংখ্যা: 2
সংখ্যা: 3
সংখ্যা: 4
সংখ্যা: 5`,
        explanation: "`জন্য` = for লুপ। এটি একটি কাউন্টার দিয়ে নির্দিষ্ট সংখ্যকবার কোড চালায়।",
        difficulty: "beginner",
        category: "Loops"
    },
    {
        title: "Functions",
        titleBn: "৫. অনুষ্ঠান (Function)",
        description: "ফাংশন তৈরি এবং ব্যবহার",
        code: `অনুষ্ঠান যোগ(ক, খ) {
    প্রেরণ ক + খ;
}

অনুষ্ঠান শুভেচ্ছা(নাম) {
    লিখো("স্বাগতম, " + নাম + "!");
}

ধ্রুবক ফলাফল = যোগ(১০, ২০);
লিখো("যোগফল: " + ফলাফল);
শুভেচ্ছা("রহিম");`,
        output: `যোগফল: 30
স্বাগতম, রহিম!`,
        explanation: "`অনুষ্ঠান` = function, `প্রেরণ` = return। ফাংশন পুনরায় ব্যবহারযোগ্য কোড ব্লক তৈরি করে।",
        difficulty: "beginner",
        category: "Functions"
    },
    {
        title: "Arrays",
        titleBn: "৬. অ্যারে (Array)",
        description: "অ্যারে তৈরি এবং ম্যানিপুলেশন",
        code: `ধ্রুবক ফলসমূহ = ["আম", "জাম", "কাঁঠাল", "লিচু"];

// অ্যাক্সেস করা
লিখো("প্রথম ফল: " + ফলসমূহ[০]);
লিখো("মোট ফল: " + ফলসমূহ.দৈর্ঘ্য);

// নতুন আইটেম যোগ
ফলসমূহ.ঠেলো("কলা");
লিখো("আপডেটেড: " + ফলসমূহ);`,
        output: `প্রথম ফল: আম
মোট ফল: 4
আপডেটেড: আম,জাম,কাঁঠাল,লিচু,কলা`,
        explanation: "অ্যারে হলো একাধিক আইটেমের তালিকা। `ঠেলো` = push, `দৈর্ঘ্য` = length।",
        difficulty: "intermediate",
        category: "Arrays"
    },
    {
        title: "Objects",
        titleBn: "৭. অবজেক্ট (Object)",
        description: "অবজেক্ট তৈরি এবং প্রপার্টি অ্যাক্সেস",
        code: `ধ্রুবক ছাত্র = {
    নাম: "রহিম",
    বয়স: ২০,
    শ্রেণী: "দশম",
    রোল: ৫,
    বিষয়সমূহ: ["বাংলা", "ইংরেজি", "গণিত"]
};

লিখো("নাম: " + ছাত্র.নাম);
লিখো("বয়স: " + ছাত্র.বয়স);
লিখো("প্রথম বিষয়: " + ছাত্র.বিষয়সমূহ[০]);`,
        output: `নাম: রহিম
বয়স: 20
প্রথম বিষয়: বাংলা`,
        explanation: "অবজেক্ট key-value পেয়ার ধারণ করে। ডট (.) বা ব্র্যাকেট ([]) দিয়ে অ্যাক্সেস করা যায়।",
        difficulty: "intermediate",
        category: "Objects"
    },
    {
        title: "Classes",
        titleBn: "৮. ক্লাস (Class)",
        description: "ক্লাস তৈরি এবং অবজেক্ট ইনস্ট্যান্সিয়েশন",
        code: `ক্লাস মানুষ {
    নির্মাতা(নাম, বয়স) {
        এই.নাম = নাম;
        এই.বয়স = বয়স;
    }
    
    পরিচয়() {
        লিখো("নাম: " + এই.নাম + ", বয়স: " + এই.বয়স);
    }
}

ধ্রুবক ব্যক্তি১ = নতুন মানুষ("রহিম", ২৫);
ব্যক্তি১.পরিচয়();`,
        output: `নাম: রহিম, বয়স: 25`,
        explanation: "`ক্লাস` = class, `নির্মাতা` = constructor, `এই` = this, `নতুন` = new। ক্লাস অবজেক্ট তৈরির টেমপ্লেট।",
        difficulty: "intermediate",
        category: "Classes"
    },
    {
        title: "Async/Await",
        titleBn: "৯. অ্যাসিঙ্ক প্রোগ্রামিং",
        description: "Promise এবং async/await ব্যবহার",
        code: `অ্যাসিঙ্ক অনুষ্ঠান ডাটা_আনো() {
    লিখো("ডাটা লোড হচ্ছে...");
    
    চেষ্টা {
        ধ্রুবক response = অপেক্ষা fetch("https://api.example.com/data");
        ধ্রুবক ডাটা = অপেক্ষা response.json();
        লিখো("ডাটা পাওয়া গেছে!");
        প্রেরণ ডাটা;
    } ধরো (ত্রুটি) {
        ত্রুটি_লিখো("সমস্যা: " + ত্রুটি.message);
    }
}

ডাটা_আনো();`,
        output: `ডাটা লোড হচ্ছে...
ডাটা পাওয়া গেছে!`,
        explanation: "`অ্যাসিঙ্ক` = async, `অপেক্ষা` = await। এটি অ্যাসিঙ্ক্রোনাস অপারেশন (যেমন API কল) সহজে হ্যান্ডেল করে।",
        difficulty: "advanced",
        category: "Async"
    },
    {
        title: "Error Handling",
        titleBn: "১০. এরর হ্যান্ডলিং",
        description: "try-catch দিয়ে ত্রুটি সামলানো",
        code: `অনুষ্ঠান ভাগ_করো(ক, খ) {
    চেষ্টা {
        যদি (খ === ০) {
            ছুড়ে_দাও নতুন Error("শূন্য দিয়ে ভাগ করা যায় না!");
        }
        ধ্রুবক ফলাফল = ক / খ;
        লিখো("ফলাফল: " + ফলাফল);
        প্রেরণ ফলাফল;
    } ধরো (ত্রুটি) {
        ত্রুটি_লিখো("এরর: " + ত্রুটি.message);
    } অবশেষে {
        লিখো("অপারেশন শেষ");
    }
}

ভাগ_করো(২০, ৪);
ভাগ_করো(১০, ০);`,
        output: `ফলাফল: 5
অপারেশন শেষ
এরর: শূন্য দিয়ে ভাগ করা যায় না!
অপারেশন শেষ`,
        explanation: "`চেষ্টা` = try, `ধরো` = catch, `অবশেষে` = finally, `ছুড়ে_দাও` = throw। এটি ত্রুটি নিরাপদে হ্যান্ডেল করে।",
        difficulty: "advanced",
        category: "Error Handling"
    }
];

export function CodeExamplesSection() {
    const [activeFilter, setActiveFilter] = useState<string>('all');

    const categories = ['all', 'Basics', 'Variables', 'Conditions', 'Loops', 'Functions', 'Arrays', 'Objects', 'Classes', 'Async', 'Error Handling'];

    const filteredExamples = activeFilter === 'all'
        ? codeExamples
        : codeExamples.filter(ex => ex.category === activeFilter);

    return (
        <section className="py-16 md:py-24">
            <div className="container px-4">
                <div className="mx-auto max-w-4xl">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                            <Code2 className="h-4 w-4" />
                            Practice Programs
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            প্র্যাকটিস করুন <span className="text-primary">Interactive Examples</span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Hands-on code examples to practice and understand BanglaScript concepts.
                        </p>
                    </motion.div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                                    activeFilter === cat
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                                )}
                            >
                                {cat === 'all' ? 'All' : cat}
                            </button>
                        ))}
                    </div>

                    {/* Code Examples */}
                    <div className="space-y-6">
                        {filteredExamples.map((example, index) => (
                            <InteractiveCodeExample key={index} {...example} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

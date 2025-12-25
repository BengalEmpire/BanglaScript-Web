"use client"

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Copy, Check, BookOpen, Sparkles, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KeywordCategory {
    name: string;
    nameBn: string;
    keywords: { bangla: string; javascript: string }[];
}

const keywordCategories: KeywordCategory[] = [
    {
        name: "Variables",
        nameBn: "ভেরিয়েবল",
        keywords: [
            { bangla: "ধ্রুবক", javascript: "const" },
            { bangla: "চলক", javascript: "let" },
            { bangla: "সংখ্যা", javascript: "let" },
            { bangla: "পরিবর্তনশীল", javascript: "var" },
            { bangla: "ব্যাক্তি", javascript: "const" },
            { bangla: "বাক্য", javascript: "let" }
        ]
    },
    {
        name: "Values",
        nameBn: "মান",
        keywords: [
            { bangla: "সত্য", javascript: "true" },
            { bangla: "মিথ্যা", javascript: "false" },
            { bangla: "শূন্য", javascript: "null" },
            { bangla: "অনির্ধারিত", javascript: "undefined" }
        ]
    },
    {
        name: "Functions",
        nameBn: "ফাংশন",
        keywords: [
            { bangla: "অনুষ্ঠান", javascript: "function" },
            { bangla: "প্রেরণ", javascript: "return" },
            { bangla: "ফেরত", javascript: "return" },
            { bangla: "অ্যাসিঙ্ক", javascript: "async" },
            { bangla: "অপেক্ষা", javascript: "await" }
        ]
    },
    {
        name: "Conditions",
        nameBn: "শর্ত",
        keywords: [
            { bangla: "যদি", javascript: "if" },
            { bangla: "নাহলে", javascript: "else" },
            { bangla: "নাহলে যদি", javascript: "else if" },
            { bangla: "সুইচ", javascript: "switch" },
            { bangla: "কেস", javascript: "case" },
            { bangla: "সাধারণ", javascript: "default" }
        ]
    },
    {
        name: "Loops",
        nameBn: "লুপ",
        keywords: [
            { bangla: "জন্য", javascript: "for" },
            { bangla: "যখন", javascript: "while" },
            { bangla: "করো", javascript: "do" },
            { bangla: "থামাও", javascript: "break" },
            { bangla: "চালিয়ে_যাও", javascript: "continue" }
        ]
    },
    {
        name: "Classes",
        nameBn: "ক্লাস",
        keywords: [
            { bangla: "ক্লাস", javascript: "class" },
            { bangla: "নির্মাতা", javascript: "constructor" },
            { bangla: "এই", javascript: "this" },
            { bangla: "নতুন", javascript: "new" },
            { bangla: "বিস্তৃত", javascript: "extends" },
            { bangla: "সুপার", javascript: "super" }
        ]
    },
    {
        name: "Console",
        nameBn: "কনসোল",
        keywords: [
            { bangla: "লিখো", javascript: "console.log" },
            { bangla: "ত্রুটি_লিখো", javascript: "console.error" },
            { bangla: "লিখো_সতর্কতা", javascript: "console.warn" },
            { bangla: "পরিষ্কার_করো", javascript: "console.clear" }
        ]
    },
    {
        name: "Error Handling",
        nameBn: "এরর হ্যান্ডলিং",
        keywords: [
            { bangla: "চেষ্টা", javascript: "try" },
            { bangla: "ধরো", javascript: "catch" },
            { bangla: "অবশেষে", javascript: "finally" },
            { bangla: "ছুড়ে_দাও", javascript: "throw" }
        ]
    },
    {
        name: "Array Methods",
        nameBn: "অ্যারে মেথড",
        keywords: [
            { bangla: "ঠেলো", javascript: "push" },
            { bangla: "তোলা", javascript: "pop" },
            { bangla: "ম্যাপ", javascript: "map" },
            { bangla: "ফিল্টার", javascript: "filter" },
            { bangla: "খুঁজে", javascript: "find" },
            { bangla: "প্রতিটিতে", javascript: "forEach" },
            { bangla: "দৈর্ঘ্য", javascript: "length" },
            { bangla: "অন্তর্ভুক্ত", javascript: "includes" }
        ]
    },
    {
        name: "DOM",
        nameBn: "DOM",
        keywords: [
            { bangla: "দস্তাবেজ", javascript: "document" },
            { bangla: "সিলেক্টর_দ্বারা_পাও", javascript: "querySelector" },
            { bangla: "আইডি_দ্বারা_পাও", javascript: "getElementById" },
            { bangla: "ইভেন্ট_যোগ_করো", javascript: "addEventListener" },
            { bangla: "টেক্সট_পরিবর্তন_করো", javascript: "innerText" },
            { bangla: "বিষয়বস্তু_পরিবর্তন_করো", javascript: "innerHTML" }
        ]
    }
];

export function KeywordReference() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

    const filteredCategories = useMemo(() => {
        if (!searchQuery && !activeCategory) return keywordCategories;

        return keywordCategories
            .filter(cat => !activeCategory || cat.name === activeCategory)
            .map(category => ({
                ...category,
                keywords: category.keywords.filter(kw =>
                    !searchQuery ||
                    kw.bangla.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    kw.javascript.toLowerCase().includes(searchQuery.toLowerCase())
                )
            }))
            .filter(category => category.keywords.length > 0);
    }, [searchQuery, activeCategory]);

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedKeyword(text);
        setTimeout(() => setCopiedKeyword(null), 2000);
    };

    return (
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="container px-4">
                <div className="mx-auto max-w-6xl">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                            <BookOpen className="h-4 w-4" />
                            Quick Reference
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            কীওয়ার্ড রেফারেন্স <span className="text-primary">Card</span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            All BanglaScript keywords mapped to their JavaScript equivalents. Search, filter, and copy!
                        </p>
                    </motion.div>

                    {/* Search & Filter Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="mb-8"
                    >
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search Input */}
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search keywords... (e.g., লিখো, console)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                                <button
                                    onClick={() => setActiveCategory(null)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                                        !activeCategory
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted hover:bg-muted/80"
                                    )}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    All
                                </button>
                                {keywordCategories.slice(0, 5).map(cat => (
                                    <button
                                        key={cat.name}
                                        onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                                            activeCategory === cat.name
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted hover:bg-muted/80"
                                        )}
                                    >
                                        {cat.nameBn}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Keywords Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {filteredCategories.map((category, catIndex) => (
                                <motion.div
                                    key={category.name}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: catIndex * 0.05 }}
                                    className="bg-card rounded-2xl border border-border overflow-hidden"
                                >
                                    {/* Category Header */}
                                    <div className="px-5 py-4 bg-muted/50 border-b border-border">
                                        <h3 className="font-semibold text-lg">
                                            {category.nameBn} <span className="text-muted-foreground font-normal">({category.name})</span>
                                        </h3>
                                    </div>

                                    {/* Keywords List */}
                                    <div className="p-4">
                                        <div className="space-y-2">
                                            {category.keywords.map((kw, kwIndex) => (
                                                <motion.div
                                                    key={kw.bangla}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.2, delay: kwIndex * 0.03 }}
                                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <code className="px-2 py-1 rounded bg-primary/10 text-primary font-mono text-sm">
                                                            {kw.bangla}
                                                        </code>
                                                        <span className="text-muted-foreground">→</span>
                                                        <code className="px-2 py-1 rounded bg-muted font-mono text-sm">
                                                            {kw.javascript}
                                                        </code>
                                                    </div>
                                                    <button
                                                        onClick={() => copyToClipboard(kw.bangla)}
                                                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-muted transition-all"
                                                        title="Copy keyword"
                                                    >
                                                        {copiedKeyword === kw.bangla ? (
                                                            <Check className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <Copy className="w-4 h-4 text-muted-foreground" />
                                                        )}
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* No Results */}
                    {filteredCategories.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-lg text-muted-foreground">No keywords found matching your search.</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}

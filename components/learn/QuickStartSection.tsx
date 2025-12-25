"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Copy, Check, Download, Package, FolderOpen, Play, Rocket, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CommandStep {
    command: string;
    description: string;
    icon: React.ElementType;
}

const installSteps: CommandStep[] = [
    {
        command: "npm install -g banglascript",
        description: "Install BanglaScript globally",
        icon: Package
    },
    {
        command: "bjs init my-project",
        description: "Create a new project",
        icon: FolderOpen
    },
    {
        command: "cd my-project",
        description: "Enter project directory",
        icon: Terminal
    },
    {
        command: "npm run build && npm start",
        description: "Build and run",
        icon: Play
    }
];

const CommandBlock: React.FC<{ command: string; className?: string }> = ({ command, className }) => {
    const [copied, setCopied] = useState(false);

    const copyCommand = async () => {
        await navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn(
            "relative group flex items-center gap-3 px-4 py-3 bg-zinc-900 rounded-xl border border-zinc-700/50",
            className
        )}>
            <Terminal className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <code className="text-emerald-300 font-mono text-sm flex-1 overflow-x-auto">
                {command}
            </code>
            <button
                onClick={copyCommand}
                className="p-1.5 rounded-md hover:bg-zinc-800 transition-colors opacity-0 group-hover:opacity-100"
                title="Copy command"
            >
                {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                ) : (
                    <Copy className="w-4 h-4 text-zinc-400" />
                )}
            </button>
        </div>
    );
};

export function QuickStartSection() {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-primary/5">
            <div className="container px-4">
                <div className="mx-auto max-w-5xl">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                            <Rocket className="h-4 w-4" />
                            Quick Start
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            শুরু করুন <span className="text-primary">৫ মিনিটে</span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Follow these simple steps to set up BanglaScript and write your first program.
                        </p>
                    </motion.div>

                    {/* Main Content Grid */}
                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Left: Installation Steps */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Download className="w-5 h-5 text-primary" />
                                Installation Steps
                            </h3>

                            {installSteps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="relative"
                                >
                                    {/* Connection Line */}
                                    {index < installSteps.length - 1 && (
                                        <div className="absolute left-6 top-14 w-0.5 h-8 bg-border" />
                                    )}

                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                            <span className="text-lg font-bold text-primary">{index + 1}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium mb-2">{step.description}</p>
                                            <CommandBlock command={step.command} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Right: First Program */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Play className="w-5 h-5 text-primary" />
                                Your First Program
                            </h3>

                            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                                {/* File Header */}
                                <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <span className="text-sm text-muted-foreground font-mono ml-2">src/main.bjs</span>
                                </div>

                                {/* Code Content */}
                                <div className="p-5 bg-zinc-900">
                                    <pre className="text-sm font-mono leading-relaxed">
                                        <span className="text-zinc-500">// আপনার প্রথম বাংলাস্ক্রিপ্ট প্রোগ্রাম</span>
                                        {'\n\n'}
                                        <span className="text-purple-400">ধ্রুবক</span>{' '}
                                        <span className="text-blue-300">নাম</span>{' '}
                                        <span className="text-white">=</span>{' '}
                                        <span className="text-emerald-300">"বিশ্ব"</span>
                                        <span className="text-white">;</span>
                                        {'\n\n'}
                                        <span className="text-yellow-300">লিখো</span>
                                        <span className="text-white">(</span>
                                        <span className="text-emerald-300">"হ্যালো, "</span>{' '}
                                        <span className="text-white">+</span>{' '}
                                        <span className="text-blue-300">নাম</span>{' '}
                                        <span className="text-white">+</span>{' '}
                                        <span className="text-emerald-300">"!"</span>
                                        <span className="text-white">);</span>
                                        {'\n\n'}
                                        <span className="text-purple-400">অনুষ্ঠান</span>{' '}
                                        <span className="text-yellow-300">যোগ</span>
                                        <span className="text-white">(</span>
                                        <span className="text-orange-300">ক</span>
                                        <span className="text-white">,</span>{' '}
                                        <span className="text-orange-300">খ</span>
                                        <span className="text-white">)</span>{' '}
                                        <span className="text-white">{'{'}</span>
                                        {'\n'}
                                        {'    '}<span className="text-purple-400">প্রেরণ</span>{' '}
                                        <span className="text-orange-300">ক</span>{' '}
                                        <span className="text-white">+</span>{' '}
                                        <span className="text-orange-300">খ</span>
                                        <span className="text-white">;</span>
                                        {'\n'}
                                        <span className="text-white">{'}'}</span>
                                        {'\n\n'}
                                        <span className="text-purple-400">সংখ্যা</span>{' '}
                                        <span className="text-blue-300">ফলাফল</span>{' '}
                                        <span className="text-white">=</span>{' '}
                                        <span className="text-yellow-300">যোগ</span>
                                        <span className="text-white">(</span>
                                        <span className="text-amber-400">৫</span>
                                        <span className="text-white">,</span>{' '}
                                        <span className="text-amber-400">৩</span>
                                        <span className="text-white">);</span>
                                        {'\n'}
                                        <span className="text-yellow-300">লিখো</span>
                                        <span className="text-white">(</span>
                                        <span className="text-emerald-300">"যোগফল: "</span>{' '}
                                        <span className="text-white">+</span>{' '}
                                        <span className="text-blue-300">ফলাফল</span>
                                        <span className="text-white">);</span>
                                    </pre>
                                </div>

                                {/* Output */}
                                <div className="px-5 py-4 bg-muted/30 border-t border-border">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Terminal className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium text-muted-foreground">Output</span>
                                    </div>
                                    <pre className="text-sm font-mono text-emerald-500">
                                        হ্যালো, বিশ্ব!{'\n'}
                                        যোগফল: 8
                                    </pre>
                                </div>
                            </div>

                            {/* Run Command */}
                            <div className="mt-4">
                                <p className="text-sm text-muted-foreground mb-2">Run your program:</p>
                                <CommandBlock command="bjs run src/main.bjs" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Prerequisites Note */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="mt-12 p-6 rounded-2xl bg-muted/50 border border-border"
                    >
                        <h4 className="font-bold mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            Prerequisites
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-primary font-bold text-sm">1</span>
                                </div>
                                <div>
                                    <p className="font-medium">Node.js 16+</p>
                                    <p className="text-sm text-muted-foreground">
                                        Download from <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">nodejs.org</a>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-primary font-bold text-sm">2</span>
                                </div>
                                <div>
                                    <p className="font-medium">VS Code (Recommended)</p>
                                    <p className="text-sm text-muted-foreground">
                                        Install <a href="https://marketplace.visualstudio.com/items?itemName=BengalEmpire.banglascript" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">BanglaScript Extension</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

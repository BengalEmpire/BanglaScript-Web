"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, BookOpen, Code, Zap, Trophy, Star, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function LearnBanglaScriptCTA() {
    return (
        <section className="py-16 md:py-24 overflow-hidden">
            <div className="container px-4">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="relative rounded-3xl overflow-hidden"
                    >
                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

                        {/* Decorative Elements */}
                        <motion.div
                            className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.7, 0.5]
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-primary/20 blur-3xl"
                            animate={{
                                scale: [1.2, 1, 1.2],
                                opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{ duration: 5, repeat: Infinity }}
                        />

                        <div className="relative grid gap-8 lg:grid-cols-2 p-8 md:p-12">
                            {/* Left Content */}
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                                    <GraduationCap className="h-4 w-4" />
                                    Free Learning Path
                                </div>

                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                                    বাংলায় কোডিং শিখুন
                                    <br />
                                    <span className="text-primary">Zero to Hero</span>
                                </h2>

                                <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                                    ইংরেজি না জেনেও প্রোগ্রামিং শিখতে পারবেন। আমাদের সম্পূর্ণ বাংলা গাইড আপনাকে নিয়ে যাবে শুরু থেকে এক্সপার্ট পর্যন্ত।
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button size="lg" asChild className="glow-accent">
                                        <Link href="/learn-banglascript">
                                            Start Learning
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" asChild>
                                        <Link href="/docs">
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            View Docs
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Right Content - Features Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: BookOpen, title: "৪টি লেভেল", desc: "Beginner to Master" },
                                    { icon: Code, title: "৫০+ উদাহরণ", desc: "Real-world code" },
                                    { icon: Zap, title: "ইন্টার‍্যাক্টিভ", desc: "Practice & learn" },
                                    { icon: Trophy, title: "প্রজেক্ট", desc: "Build real apps" },
                                ].map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: i * 0.1 }}
                                        viewport={{ once: true }}
                                        className="p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors"
                                    >
                                        <feature.icon className="w-6 h-6 text-primary mb-2" />
                                        <h3 className="font-semibold mb-1">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Stats Bar */}
                        <div className="relative border-t border-border bg-muted/30 px-8 py-4">
                            <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="w-4 h-4 text-primary" />
                                    <span>১০০০+ শিক্ষার্থী</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Star className="w-4 h-4 text-amber-500" />
                                    <span>সম্পূর্ণ বিনামূল্যে</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span>প্রায় ২ ঘন্টায় শিখুন</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, Play, Star, Trophy, Zap, BookOpen, Code, Rocket, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelProps {
    level: number;
    title: string;
    titleBn: string;
    description: string;
    icon: React.ElementType;
    topics: string[];
    isLocked?: boolean;
    isCompleted?: boolean;
    isCurrent?: boolean;
    color: string;
    gradientFrom: string;
    gradientTo: string;
}

const levels: LevelProps[] = [
    {
        level: 1,
        title: "Beginner",
        titleBn: "শুরুর পাঠ",
        description: "Learn variables, data types, conditions, and loops",
        icon: BookOpen,
        topics: ["ভেরিয়েবল", "ডাটা টাইপ", "শর্ত", "লুপ", "ফাংশন"],
        isCompleted: false,
        isCurrent: true,
        color: "emerald",
        gradientFrom: "from-emerald-500",
        gradientTo: "to-teal-500"
    },
    {
        level: 2,
        title: "Intermediate",
        titleBn: "মধ্যবর্তী পাঠ",
        description: "Master arrays, objects, classes, and error handling",
        icon: Code,
        topics: ["অ্যারে", "অবজেক্ট", "ক্লাস", "এরর হ্যান্ডলিং", "সুইচ"],
        isLocked: false,
        color: "blue",
        gradientFrom: "from-blue-500",
        gradientTo: "to-indigo-500"
    },
    {
        level: 3,
        title: "Advanced",
        titleBn: "উন্নত পাঠ",
        description: "Async programming, DOM manipulation, and web apps",
        icon: Rocket,
        topics: ["Promise", "Async/Await", "DOM", "API", "ওয়েব অ্যাপ"],
        isLocked: false,
        color: "purple",
        gradientFrom: "from-purple-500",
        gradientTo: "to-pink-500"
    },
    {
        level: 4,
        title: "Master",
        titleBn: "মাস্টার লেভেল",
        description: "Modules, API servers, and advanced patterns",
        icon: Crown,
        topics: ["মডিউল", "সার্ভার", "Math", "প্রজেক্ট"],
        isLocked: false,
        color: "amber",
        gradientFrom: "from-amber-500",
        gradientTo: "to-orange-500"
    }
];

const LevelCard: React.FC<LevelProps & { index: number }> = ({
    level,
    title,
    titleBn,
    description,
    icon: Icon,
    topics,
    isLocked,
    isCompleted,
    isCurrent,
    color,
    gradientFrom,
    gradientTo,
    index
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative group"
        >
            {/* Connection Line */}
            {index < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-border to-transparent" />
            )}

            <div className={cn(
                "relative overflow-hidden rounded-2xl border transition-all duration-500",
                "hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2",
                isCurrent ? "border-primary shadow-lg shadow-primary/20" : "border-border",
                isLocked ? "opacity-60" : ""
            )}>
                {/* Gradient Header */}
                <div className={cn(
                    "h-2 w-full bg-gradient-to-r",
                    gradientFrom,
                    gradientTo
                )} />

                {/* Card Content */}
                <div className="p-6 bg-card">
                    {/* Level Badge */}
                    <div className="flex items-center justify-between mb-4">
                        <div className={cn(
                            "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
                            "bg-gradient-to-r text-white",
                            gradientFrom,
                            gradientTo
                        )}>
                            <span>Level {level}</span>
                            {isCompleted && <Check className="w-4 h-4" />}
                            {isLocked && <Lock className="w-4 h-4" />}
                        </div>
                        <div className={cn(
                            "p-2 rounded-xl bg-gradient-to-br",
                            gradientFrom,
                            gradientTo
                        )}>
                            <Icon className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-1">{titleBn}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{title}</p>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                        {description}
                    </p>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {topics.map((topic, i) => (
                            <span
                                key={i}
                                className="px-2 py-1 bg-muted rounded-md text-xs text-muted-foreground"
                            >
                                {topic}
                            </span>
                        ))}
                    </div>

                    {/* Action Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLocked}
                        className={cn(
                            "w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all",
                            isLocked
                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : cn("bg-gradient-to-r text-white", gradientFrom, gradientTo, "hover:opacity-90")
                        )}
                    >
                        {isLocked ? (
                            <>
                                <Lock className="w-4 h-4" />
                                Locked
                            </>
                        ) : isCurrent ? (
                            <>
                                <Play className="w-4 h-4" />
                                Start Learning
                            </>
                        ) : isCompleted ? (
                            <>
                                <Check className="w-4 h-4" />
                                Review
                            </>
                        ) : (
                            <>
                                <BookOpen className="w-4 h-4" />
                                Explore
                            </>
                        )}
                    </motion.button>
                </div>

                {/* Current Indicator */}
                {isCurrent && (
                    <div className="absolute -top-1 -right-1">
                        <span className="relative flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export function LearningPath() {
    return (
        <section className="py-16 md:py-24">
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
                            <Trophy className="h-4 w-4" />
                            Learning Path
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            শেখার পথ <span className="text-primary">Zero to Hero</span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Start from the basics and progress to mastery. Each level builds upon the previous one.
                        </p>
                    </motion.div>

                    {/* Level Cards Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {levels.map((level, index) => (
                            <LevelCard key={level.level} {...level} index={index} />
                        ))}
                    </div>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {[
                            { icon: BookOpen, value: "50+", label: "Lessons" },
                            { icon: Code, value: "100+", label: "Code Examples" },
                            { icon: Zap, value: "25+", label: "Exercises" },
                            { icon: Star, value: "4", label: "Projects" }
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <stat.icon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

"use client"

import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Sparkles, ArrowRight, Play, Github, Download, Star, Users, Code2, Terminal, Zap, Trophy, Rocket, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { LearningPath, KeywordReference, QuickStartSection, CodeExamplesSection } from "@/components/learn";

export default function LearnBanglaScriptPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-grow">
        <div className="mx-auto w-full max-w-7xl">
          {/* Hero Section */}
          <section className="relative overflow-hidden border-b border-border">
            {/* Background Pattern */}
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

            {/* Floating Elements */}
            <motion.div
              className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/10 blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />

            <div className="container relative px-4 py-20 md:py-28">
              <div className="mx-auto max-w-4xl text-center">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
                >
                  <GraduationCap className="h-4 w-4" />
                  Zero to Hero Learning Path
                </motion.div>

                {/* Main Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
                >
                  বাংলাস্ক্রিপ্ট <span className="text-primary">শিখুন</span>
                  <br />
                  <span className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-normal">
                    Learn BanglaScript from Scratch
                  </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-8 text-lg text-muted-foreground md:text-xl leading-relaxed max-w-2xl mx-auto"
                >
                  বাংলায় প্রোগ্রামিং শিখুন একদম শুরু থেকে। এই গাইডে আপনি শিখবেন ভেরিয়েবল, ফাংশন, ক্লাস, অ্যাসিঙ্ক প্রোগ্রামিং এবং আরও অনেক কিছু!
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                  <Button size="lg" asChild className="glow-accent">
                    <a href="#quick-start">
                      <Rocket className="mr-2 h-4 w-4" />
                      Start Learning
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/playground">
                      <Play className="mr-2 h-4 w-4" />
                      Try Playground
                    </Link>
                  </Button>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                  {[
                    { icon: BookOpen, value: "4", label: "Levels" },
                    { icon: Code2, value: "50+", label: "Examples" },
                    { icon: Terminal, value: "10+", label: "Projects" },
                    { icon: Zap, value: "100%", label: "Free" }
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center p-4 rounded-xl bg-muted/30 border border-border">
                      <stat.icon className="w-5 h-5 text-primary mb-2" />
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          {/* Quick Start Section */}
          <div id="quick-start">
            <QuickStartSection />
          </div>

          {/* Learning Path Section */}
          <LearningPath />

          {/* Code Examples Section */}
          <CodeExamplesSection />

          {/* Keyword Reference Section */}
          <KeywordReference />

          {/* CLI Commands Section */}
          <section className="py-16 md:py-24 border-t border-border">
            <div className="container px-4">
              <div className="mx-auto max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                    <Terminal className="h-4 w-4" />
                    CLI Commands
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    কমান্ড লাইন <span className="text-primary">Reference</span>
                  </h2>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="grid gap-4 md:grid-cols-2"
                >
                  {[
                    { cmd: "bjs init <name>", desc: "নতুন প্রজেক্ট তৈরি করুন" },
                    { cmd: "bjs init --web <name>", desc: "Web প্রজেক্ট তৈরি করুন" },
                    { cmd: "bjs init --api <name>", desc: "API প্রজেক্ট তৈরি করুন" },
                    { cmd: "bjs run <file>.bjs", desc: "ফাইল রান করুন" },
                    { cmd: "bjs build <file>.bjs", desc: "JavaScript-এ কম্পাইল করুন" },
                    { cmd: "bjs watch <file>.bjs", desc: "পরিবর্তন দেখুন ও অটো-রান" },
                    { cmd: "bjs repl", desc: "ইন্টার‍্যাক্টিভ মোড" },
                    { cmd: "bjs keywords", desc: "সব কীওয়ার্ড দেখুন" }
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/50 transition-colors"
                    >
                      <code className="text-sm font-mono text-primary">{item.cmd}</code>
                      <span className="text-sm text-muted-foreground">{item.desc}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          {/* Resources & Next Steps */}
          <section className="py-16 md:py-24 bg-muted/30 border-t border-border">
            <div className="container px-4">
              <div className="mx-auto max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                    <Sparkles className="h-4 w-4" />
                    Resources
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    আরও শিখুন <span className="text-primary">& Connect</span>
                  </h2>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="grid gap-6 md:grid-cols-3"
                >
                  {[
                    {
                      icon: BookOpen,
                      title: "Documentation",
                      titleBn: "ডকুমেন্টেশন",
                      description: "সম্পূর্ণ API রেফারেন্স এবং গাইড",
                      link: "/docs",
                      color: "from-blue-500 to-indigo-500"
                    },
                    {
                      icon: Github,
                      title: "GitHub",
                      titleBn: "গিটহাব",
                      description: "সোর্স কোড এবং কন্ট্রিবিউট করুন",
                      link: "https://github.com/BengalEmpire/BanglaScript",
                      external: true,
                      color: "from-purple-500 to-pink-500"
                    },
                    {
                      icon: Users,
                      title: "Community",
                      titleBn: "কমিউনিটি",
                      description: "অন্যান্য ডেভেলপারদের সাথে যুক্ত হন",
                      link: "/community",
                      color: "from-emerald-500 to-teal-500"
                    }
                  ].map((resource, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {resource.external ? (
                        <a
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all group"
                        >
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${resource.color} flex items-center justify-center mb-4`}>
                            <resource.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-lg font-bold mb-1">
                            {resource.titleBn}
                            <ChevronRight className="inline w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h3>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                        </a>
                      ) : (
                        <Link
                          href={resource.link}
                          className="block p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all group"
                        >
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${resource.color} flex items-center justify-center mb-4`}>
                            <resource.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-lg font-bold mb-1">
                            {resource.titleBn}
                            <ChevronRight className="inline w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h3>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-16 md:py-24 border-t border-border">
            <div className="container px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="mx-auto max-w-3xl text-center p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-primary/5 border border-primary/20"
              >
                <Trophy className="w-12 h-12 text-primary mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  আপনি এখন প্রস্তুত! 🎉
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  এই গাইড শেষ করলে আপনি বাংলাস্ক্রিপ্টে প্রোগ্রামিং করতে পারবেন। অনুশীলন করুন এবং আপনার প্রথম প্রজেক্ট তৈরি করুন!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" asChild className="glow-accent">
                    <Link href="/playground">
                      <Play className="mr-2 h-4 w-4" />
                      অনুশীলন করুন
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/docs">
                      <BookOpen className="mr-2 h-4 w-4" />
                      ডকুমেন্টেশন দেখুন
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
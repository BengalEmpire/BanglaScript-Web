"use client"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import NewFeature from "@/components/Feature-Modal"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Code2, Globe, GraduationCap, Sparkles, Github, BookOpen } from "lucide-react"
import Link from "next/link"
import { CodeBlock } from "@/components/code-block"
import Image from 'next/image'
import { LearnBanglaScriptCTA } from "@/components/LearnBanglaScriptCTA"

export default function HomePage() {

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);


  const banglaCode = `বাক্য নাম = "বিশ্ব"
লিখো("হ্যালো, " + নাম + "!")

অনুষ্ঠান যোগ(ক, খ) {
  প্রেরণ ক + খ
}

সংখ্যা ফলাফল = যোগ(৫, ৩)
লিখো("যোগফল: " + ফলাফল)`

  const jsCode = `let name = "বিশ্ব"
console.log("হ্যালো, " + name + "!")

function addition(ক, খ) {
  return ক + খ
}

let Results = addition(5, 3)
console.log("যোগফল: " + Results)`

  const features = [
    {
      icon: Globe,
      title: "Accessibility",
      description: "Write code in your native Bengali language, making programming more accessible and intuitive.",
    },
    {
      icon: GraduationCap,
      title: "Education",
      description: "Perfect for teaching programming concepts to Bengali-speaking students and beginners.",
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Bridge the gap between Bengali language and modern JavaScript development.",
    },
    {
      icon: Code2,
      title: "Pure JavaScript",
      description: "Transpiles to clean, readable JavaScript that runs anywhere JS runs.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="mx-auto w-full max-w-7xl">
          {/* Hero Section */}
          <section className="relative overflow-hidden border-b border-border">
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="container relative px-4 py-24 md:py-32">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  <Sparkles className="h-4 w-4" />
                  Open Source & Free
                </div>

                <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight md:text-7xl">
                  Write in <span className="underline decoration-[#F0DB4F]">বাংলা</span>,
                  <br />
                  <span className="text-primary">Run in <span className="underline decoration-[#F0DB4F]">JavaScript</span></span>
                </h1>

                <p className="mb-8 text-balance text-lg text-muted-foreground md:text-xl leading-relaxed">
                  BanglaScript is a language transpiler that enables developers to write programs in Bengali syntax, which
                  then compiles to pure JavaScript. <span className="underline decoration-wavy hover:decoration-solid hover:underline-offset-2 hover:uppercase decoration-pink-500">লিখো বাংলায়, চালাও জাভাস্ক্রিপ্ট!</span>
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button size="lg" asChild className="glow-accent">
                    <Link href="/docs">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/playground">
                      <Code2 className="mr-2 h-4 w-4" />
                      Try Playground
                    </Link>
                  </Button>
                  <Button size="lg" variant="ghost" asChild>
                    <a href="https://github.com/BengalEmpire/BanglaScript" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      View on GitHub
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Code Demo Section */}
          <section className="border-b border-border bg-muted/20 py-16 md:py-24">
            <div className="container px-4">
              <div className="mx-auto max-w-6xl">
                <div className="mb-12 text-center">
                  <h2 className="mb-4 text-3xl font-bold md:text-4xl">See It In Action</h2>
                  <p className="text-lg text-muted-foreground">
                    Write Bengali code on the left, get JavaScript on the right
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center bg-[#F7DF1E]">
                        <span className="font-mono text-sm font-bold text-[#000000]">ব</span>
                      </div>
                      <h3 className="font-semibold">BanglaScript</h3>
                    </div>
                    <CodeBlock code={banglaCode} language="banglascript" showLineNumbers />
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Image
                        src="/assets/javascript-logo-svgrepo-com.svg"
                        width={30}
                        height={30}
                        alt="Js-Logo"
                      />
                      <h3 className="font-semibold">JavaScript Output</h3>
                    </div>
                    <CodeBlock code={jsCode} language="javascript" showLineNumbers />
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Button asChild variant="outline">
                    <Link href="/playground">
                      Try it yourself in the Playground
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Why BanglaScript Section */}
          <section className="py-16 md:py-24">
            <div className="container px-4">
              <div className="mx-auto max-w-6xl">
                <div className="mb-12 text-center">
                  <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why BanglaScript?</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Empowering Bengali speakers to learn and create with code
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {features.map((feature, index) => (
                    <Card key={index} className="border-border bg-card p-6 transition-all hover:border-primary/50">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="border-b border-border bg-muted/20 py-16 md:py-24">
            <div className="container px-4">
              <div className="mx-auto max-w-6xl">
                <div className="grid gap-12 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      <BookOpen className="h-4 w-4" />
                      Easy to Learn
                    </div>
                    <h2 className="text-3xl font-bold md:text-4xl">Familiar Syntax, Native Language</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      BanglaScript uses Bengali keywords and syntax that feel natural to Bengali speakers. No need to
                      memorize English programming terms - write code the way you think.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Image
                          src="/assets/pulse.svg"
                          width={25}
                          height={25}
                          alt="https://github.com/mahmud-r-farhan/Realtime-Location-Tracker/blob/master/public/assets/unknown-log.svg"
                        />
                        <span className="text-muted-foreground">Bengali keywords like সংখ্যা, অনুষ্ঠান, প্রেরণ</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Image
                          src="/assets/pulse.svg"
                          width={25}
                          height={25}
                          alt="https://github.com/mahmud-r-farhan/Realtime-Location-Tracker/blob/master/public/assets/unknown-log.svg"
                        />
                        <span className="text-muted-foreground">Compiles to clean, readable JavaScript</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Image
                          src="/assets/pulse.svg"
                          width={25}
                          height={25}
                          alt="https://github.com/mahmud-r-farhan/Realtime-Location-Tracker/blob/master/public/assets/unknown-log.svg"
                        />
                        <span className="text-muted-foreground">Works with existing JavaScript libraries</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      <Code2 className="h-4 w-4" />
                      Developer Friendly
                    </div>
                    <h2 className="text-3xl font-bold md:text-4xl">Built for Modern Development</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Integrate BanglaScript into your existing workflow. Use it with Node.js, web browsers, and your
                      favorite build tools.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Image
                          src="/assets/pulse.svg"
                          width={25}
                          height={25}
                          alt="https://github.com/mahmud-r-farhan/Realtime-Location-Tracker/blob/master/public/assets/unknown-log.svg"
                        />
                        <span className="text-muted-foreground">CLI tool for quick transpilation</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Image
                          src="/assets/pulse.svg"
                          width={25}
                          height={25}
                          alt="https://github.com/mahmud-r-farhan/Realtime-Location-Tracker/blob/master/public/assets/unknown-log.svg"
                        />
                        <span className="text-muted-foreground">Node.js integration for server-side code</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Image
                          src="/assets/pulse.svg"
                          width={25}
                          height={25}
                          alt="https://github.com/mahmud-r-farhan/Realtime-Location-Tracker/blob/master/public/assets/unknown-log.svg"
                        />
                        <span className="text-muted-foreground">Browser support for client-side applications</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Learn BanglaScript CTA */}
          <LearnBanglaScriptCTA />

          {/* CTA Section */}
          <section className="border-t border-border py-16 md:py-24">
            <div className="container px-4">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Get Started?</h2>
                <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                  Join the community of Bengali developers writing code in their native language.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button size="lg" asChild className="glow-accent">
                    <Link href="/docs">
                      Read Documentation
                      <BookOpen className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/community">Join Community</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
import Link from "next/link"
import { Github, Twitter, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container px-4 py-12 mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="font-mono text-lg font-bold text-primary-foreground">বা</span>
              </div>
              <span className="text-lg font-bold">BanglaScript</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Write in Bangla, Run in JavaScript. Making programming accessible for Bengali speakers.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Documentation</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-primary transition-colors">
                  Getting Started
                </Link>
              </li>
              <li>
                <Link href="/docs/installation" className="text-muted-foreground hover:text-primary transition-colors">
                  Installation
                </Link>
              </li>
              <li>
                <Link href="/docs/syntax" className="text-muted-foreground hover:text-primary transition-colors">
                  Syntax Guide
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                 Terms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/playground" className="text-muted-foreground hover:text-primary transition-colors">
                  Playground
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-muted-foreground hover:text-primary transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/banglascript"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Connect</h3>
            <div className="flex gap-3">
              <a
                href="https://github.com/BengalEmpire/BanglaScript"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Youtube className="h-4 w-4" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} BanglaScript. Open source under MIT License.</p>
        </div>
      </div>
    </footer>
  )
}

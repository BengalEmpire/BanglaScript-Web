"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface DocItem {
  title: string
  slug: string
}

interface DocSection {
  title: string
  items: DocItem[]
}

interface DocsSidebarProps {
  sections: DocSection[]
}

export function DocsSidebar({ sections }: DocsSidebarProps) {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    sections.reduce(
      (acc, section) => ({
        ...acc,
        [section.title]: true,
      }),
      {},
    ),
  )

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r border-border bg-card/50 p-6">
      <nav className="space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <button
              onClick={() => toggleSection(section.title)}
              className="mb-2 flex w-full items-center justify-between text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              {section.title}
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", openSections[section.title] ? "rotate-180" : "")}
              />
            </button>

            {openSections[section.title] && (
              <ul className="space-y-1 border-l border-border pl-4">
                {section.items.map((item) => {
                  const href = `/docs/${item.slug}`
                  const isActive = pathname === href

                  return (
                    <li key={item.slug}>
                      <Link
                        href={href}
                        className={cn(
                          "block rounded px-3 py-1.5 text-sm transition-colors",
                          isActive
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        {item.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}

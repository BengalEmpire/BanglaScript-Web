import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DocsSidebar } from "@/components/docs-sidebar"
import docsData from "@/data/docs.json"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <DocsSidebar sections={docsData.sections} />
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  )
}

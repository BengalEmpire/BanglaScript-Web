import { DocsContent } from "@/components/docs-content"
import { notFound } from "next/navigation"
import docsData from "@/data/docs.json"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs: string[] = []

  docsData.sections.forEach((section) => {
    section.items.forEach((item) => {
      slugs.push(item.slug)
    })
  })

  return slugs.map((slug) => ({ slug }))
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params

  let docContent = null

  for (const section of docsData.sections) {
    const item = section.items.find((i) => i.slug === slug)
    if (item) {
      docContent = item.content
      break
    }
  }

  if (!docContent) {
    notFound()
  }

  return (
    <div className="container max-w-5xl px-4 py-12">
      <DocsContent content={docContent} />
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params

  let docContent = null

  for (const section of docsData.sections) {
    const item = section.items.find((i) => i.slug === slug)
    if (item) {
      docContent = item.content
      break
    }
  }

  if (!docContent) {
    return {
      title: "Not Found",
    }
  }

  return {
    title: `${docContent.title} - BanglaScript Documentation`,
    description: docContent.description,
  }
}

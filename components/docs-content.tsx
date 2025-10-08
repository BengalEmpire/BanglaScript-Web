import { CodeBlock } from "@/components/code-block"

interface ContentSection {
  heading?: string
  content?: string
  code?: string
  language?: string
  list?: string[]
}

interface DocContent {
  title: string
  description: string
  sections: ContentSection[]
}

interface DocsContentProps {
  content: DocContent
}

export function DocsContent({ content }: DocsContentProps) {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="mb-3 text-4xl font-bold">{content.title}</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">{content.description}</p>
      </div>

      <div className="space-y-8">
        {content.sections.map((section, index) => (
          <section key={index} className="space-y-4">
            {section.heading && <h2 className="text-2xl font-bold">{section.heading}</h2>}

            {section.content && <p className="text-muted-foreground leading-relaxed">{section.content}</p>}

            {section.code && (
              <div className="my-4">
                <CodeBlock code={section.code} language={section.language || "javascript"} showLineNumbers />
              </div>
            )}

            {section.list && (
              <ul className="space-y-2">
                {section.list.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-2 flex h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </article>
  )
}

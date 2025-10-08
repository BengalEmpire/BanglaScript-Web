"use client"

import type React from "react"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  placeholder?: string
  readOnly?: boolean
}

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  placeholder,
  readOnly = false,
}: CodeEditorProps) {
  const [lineCount, setLineCount] = useState(1)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setLineCount(newValue.split("\n").length)
  }

  const lines = Array.from({ length: Math.max(lineCount, 20) }, (_, i) => i + 1)

  return (
    <div className="flex h-full overflow-hidden rounded-lg border border-border bg-muted/50">
      <div className="flex select-none flex-col border-r border-border bg-muted px-3 py-4 text-right text-sm text-muted-foreground">
        {lines.map((line) => (
          <div key={line} className="leading-6">
            {line}
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
        <Textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className="h-full min-h-[500px] resize-none border-0 bg-transparent p-4 font-mono text-sm leading-6 focus-visible:ring-0"
          spellCheck={false}
        />
      </div>
    </div>
  )
}

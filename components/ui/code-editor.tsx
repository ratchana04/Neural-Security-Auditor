"use client"

import { useState, useEffect } from "react"

interface CodeEditorProps {
  value: string
  onChange: (val: string) => void
  onLineClick?: (line: number) => void
}

export function CodeEditor({ value, onChange, onLineClick }: CodeEditorProps) {
  const [selectedLine, setSelectedLine] = useState<number | null>(null)
  
  // Split the dynamic value into lines for the display
  const lines = value.split("\n")

  const handleLineClick = (lineNum: number) => {
    setSelectedLine(lineNum)
    onLineClick?.(lineNum)
  }

  return (
    <div className="flex h-full min-h-[400px] flex-col rounded-lg border border-border bg-card font-mono text-sm shadow-xl overflow-hidden">
      {/* Tab Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-destructive/50" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
          <span className="ml-2 text-xs text-muted-foreground select-none">security-audit-sandbox.ts</span>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
          Editable Mode
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden flex">
        {/* Line Numbers Column */}
        <div className="w-12 bg-muted/10 border-r border-border py-4 text-right pr-3 select-none text-muted-foreground/40">
          {lines.map((_, i) => (
            <div key={i} className="leading-6 h-6">{i + 1}</div>
          ))}
        </div>

        {/* Textarea for Input */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="absolute inset-0 w-full h-full bg-transparent pl-[60px] py-4 leading-6 text-foreground resize-none focus:outline-none z-10 caret-primary"
          style={{ whiteSpace: 'pre', overflowWrap: 'unset' }}
        />

        {/* Highlighting Layer (Shows under the textarea) */}
        <div className="absolute inset-0 w-full h-full pl-[60px] py-4 leading-6 pointer-events-none select-none">
          {lines.map((line, idx) => {
            const isVulnerable = line.toLowerCase().includes("vulnerability") || line.toLowerCase().includes("danger");
            return (
              <div 
                key={idx} 
                className={`h-6 w-full ${isVulnerable ? "bg-destructive/10 border-l-2 border-destructive" : ""}`}
              >
                {isVulnerable && (
                   <span className="sr-only">Vulnerable line detected</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-border bg-muted/20 px-4 py-1 flex justify-end">
        <span className="text-[10px] text-muted-foreground">UTF-8 | TypeScript</span>
      </div>
    </div>
  )
}
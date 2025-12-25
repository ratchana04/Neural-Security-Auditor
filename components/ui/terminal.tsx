"use client"

import { useEffect, useRef } from "react"
import { TerminalIcon, Zap } from "lucide-react"

// Define the type to match your audit logic in lib/audit-logic.ts
export type LogEntry = {
  time: string
  text: string
  type: "info" | "success" | "warning" | "error" | "agent"
  agentName?: string
}

// Fixed the interface to accept the logs prop from page.tsx
interface TerminalProps {
  logs: LogEntry[]
}

export function Terminal({ logs }: TerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-black/90 shadow-2xl overflow-hidden font-mono min-h-[300px]">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 bg-muted/20">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-primary/80">
            AI Orchestrator Shell
          </span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-auto p-4 text-[11px] leading-relaxed custom-scrollbar"
      >
        {logs && logs.length > 0 ? (
          logs.map((log, idx) => (
            <div key={idx} className="mb-1.5 flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-muted-foreground shrink-0 select-none">
                [{log?.time}]
              </span>
              <div className="flex flex-col">
                <span className={
                  log?.type === "success" ? "text-emerald-400" :
                  log?.type === "warning" ? "text-amber-400" :
                  log?.type === "error" ? "text-rose-400" :
                  log?.type === "agent" ? "text-cyan-400 font-bold" : "text-blue-300"
                }>
                  {log?.agentName && <span className="mr-2 opacity-80 underline italic">{log.agentName}:</span>}
                  {log?.text}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40 gap-2">
            <Zap className="h-8 w-8 animate-pulse" />
            <p className="italic text-sm">Awaiting neural link establishment...</p>
          </div>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-primary opacity-50">root@auditor:~$</span>
          <span className="inline-block w-2 h-4 bg-primary animate-pulse" />
        </div>
      </div>
    </div>
  )
}
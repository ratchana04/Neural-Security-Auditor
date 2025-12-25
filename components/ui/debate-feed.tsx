"use client"

import { Shield, Code, CheckCircle2, MessageSquare } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type AuditLog } from "@/lib/audit-logic"

// Define the interface to accept the logs prop from page.tsx
interface DebateFeedProps {
  logs: AuditLog[]
}

export function DebateFeed({ logs }: DebateFeedProps) {
  // We filter the logs to only show entries from specific agents 
  // to simulate the "reasoning" flow in this specific feed
  const debateLogs = logs.filter(
    (log) => log.type === "agent" || log.type === "warning" || log.type === "error"
  )

  // Helper to map agent names to icons and colors
  const getAgentTheme = (name?: string) => {
    switch (name) {
      case "Researcher":
        return { icon: Shield, color: "text-primary" }
      case "Architect":
        return { icon: Code, color: "text-blue-400" }
      case "Verifier":
        return { icon: CheckCircle2, color: "text-emerald-400" }
      default:
        return { icon: MessageSquare, color: "text-muted-foreground" }
    }
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      <div className="border-b border-border bg-muted/30 px-4 py-3">
        <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          Multi-Agent Reasoning
        </h3>
        <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
          Live Agent Cross-Examination
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {debateLogs.length > 0 ? (
            debateLogs.map((log, idx) => {
              const theme = getAgentTheme(log.agentName)
              const Icon = theme.icon

              return (
                <div key={idx} className="group space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-2">
                    <div className={`rounded-md p-1 bg-background border border-border ${theme.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-foreground uppercase tracking-tight">
                      {log.agentName || "System"}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-auto tabular-nums opacity-50">
                      {log.time}
                    </span>
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      log.type === 'error' ? 'bg-destructive animate-pulse' : 
                      log.type === 'warning' ? 'bg-amber-500' : 'bg-primary/40'
                    }`} />
                  </div>
                  
                  <div className="relative pl-7">
                    {/* Decorative vertical line */}
                    <div className="absolute left-[11px] top-0 bottom-0 w-[1px] bg-border group-last:bg-transparent" />
                    
                    <p className={`text-xs leading-relaxed py-1 px-3 rounded-r-md border-l-2 ${
                      log.type === 'error' ? 'text-destructive border-destructive bg-destructive/5' : 
                      log.type === 'warning' ? 'text-amber-200 border-amber-500 bg-amber-500/5' : 
                      'text-muted-foreground border-primary/30'
                    }`}>
                      {log.text}
                    </p>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-center space-y-2">
              <div className="p-3 rounded-full bg-muted/20 border border-dashed border-border">
                <MessageSquare className="h-5 w-5 text-muted-foreground/40" />
              </div>
              <p className="text-xs italic text-muted-foreground/50 px-4">
                Awaiting agent initialization to begin neural debate...
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
"use client"

import { AlertCircle, AlertTriangle, ShieldAlert, Info, ArrowRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { type AuditLog } from "@/lib/audit-logic"

interface IssueFeedProps {
  logs: AuditLog[]
  onSelectIssue: (log: AuditLog) => void
}

export function IssueFeed({ logs, onSelectIssue }: IssueFeedProps) {
  const issues = logs.filter((log) => log.type === "warning" || log.type === "error")

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="border-b border-border px-4 py-3 bg-muted/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1 rounded-md">
              <ShieldAlert className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-bold text-card-foreground">Security Findings</h3>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono bg-background">
            {issues.length} DETECTED
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {issues.length > 0 ? (
            issues.map((issue, idx) => (
              <div key={idx} className={`rounded-lg border p-3 transition-all ${
                issue.type === "error" ? "border-destructive/30 bg-destructive/5" : "border-amber-500/30 bg-amber-500/5"
              }`}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-muted-foreground">
                      {issue.agentName} Analysis
                    </span>
                  </div>
                  <p className="text-[11px] font-medium leading-snug">{issue.text}</p>
                  <button 
                    onClick={() => onSelectIssue(issue)}
                    className="flex items-center gap-1 text-[9px] font-bold text-primary uppercase hover:opacity-70 transition-opacity"
                  >
                    Fix Code <ArrowRight className="h-2.5 w-2.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] opacity-40">
              <Info className="h-6 w-6 mb-2" />
              <p className="text-[10px] uppercase font-bold">Queue Empty</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
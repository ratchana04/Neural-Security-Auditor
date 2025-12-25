"use client"

import { X, ShieldCheck, Zap, Copy, Terminal } from "lucide-react"
import { Button } from "./button"
import { type AuditLog } from "@/lib/audit-logic"

interface RemediationModalProps {
  issue: AuditLog | null
  onClose: () => void
  onApply: (issue: AuditLog) => void
}

export function RemediationModal({ issue, onClose, onApply }: RemediationModalProps) {
  if (!issue) return null

  const isSql = issue.text.toLowerCase().includes("sql")
  const isSecret = issue.text.toLowerCase().includes("secret") || issue.text.toLowerCase().includes(".env")

  const fixedCode = isSql 
    ? `// SECURE: Use parameterized queries\nconst query = "SELECT * FROM users WHERE username = $1";\nconst user = await db.query(query, [username]);`
    : isSecret 
    ? `// SECURE: Use environment variables\nconst apiKey = process.env.API_KEY;\n// Ensure .env is added to .gitignore`
    : `// SECURE: Suggested fix\n// npm audit fix --force`

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose} // Clicking the backdrop closes the modal
    >
      <div 
        className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking the white area
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-widest">Architect Remediation</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase text-destructive flex items-center gap-2">
              <Zap className="h-3 w-3" /> Finding
            </h4>
            <p className="text-sm font-medium">{issue.text}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black uppercase text-primary flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5" /> Proposed Secure Implementation
              </h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-[9px] gap-1"
                onClick={() => navigator.clipboard.writeText(fixedCode)}
              >
                <Copy className="h-3 w-3" /> COPY
              </Button>
            </div>
            <pre className="p-4 rounded-xl bg-black text-emerald-400 font-mono text-[11px] leading-relaxed border border-primary/20 overflow-x-auto">
              <code>{fixedCode}</code>
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-muted/20 border-t border-border flex justify-end gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose} 
            className="text-[10px] font-bold"
          >
            DISMISS
          </Button>
          <Button 
            size="sm" 
            className="text-[10px] font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={(e) => {
               e.stopPropagation(); // Stop click from bubbling
               console.log("Modal: Apply Patch clicked");
               onApply(issue);
            }}
          >
            APPLY PATCH
          </Button>
        </div>
      </div>
    </div>
  )
}
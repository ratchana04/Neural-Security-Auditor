import { BookOpen } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const STANDARDS = [
  {
    title: "OWASP A03:2021 - Injection",
    description:
      "An application is vulnerable to attack when user-supplied data is not validated, filtered, or sanitized.",
    link: "owasp.org/Top10/A03",
  },
  {
    title: "NIST 800-53 - IA-5",
    description: "The information system enforces password complexity by minimum requirements.",
    link: "csrc.nist.gov/publications",
  },
  {
    title: "CWE-89: SQL Injection",
    description: "The software constructs SQL queries using externally-influenced input without proper sanitization.",
    link: "cwe.mitre.org/data/89",
  },
]

export function RAGContext() {
  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-card-foreground">Security Standards</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Retrieved from knowledge base</p>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {STANDARDS.map((standard, idx) => (
            <div key={idx} className="rounded-lg border border-border/50 bg-secondary/30 p-3 space-y-1">
              <h4 className="text-xs font-semibold text-foreground">{standard.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{standard.description}</p>
              <a href={`https://${standard.link}`} className="text-xs text-primary hover:underline inline-block mt-1">
                {standard.link} →
              </a>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

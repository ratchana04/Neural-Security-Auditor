"use client"

import { Button } from "@/components/ui/button"
import { GitBranch } from "lucide-react"

const CURRENT_CODE = `const user = await query(
  \`SELECT * FROM users WHERE username = '\${username}'\`
)

if (user.password === password) {
  return Response.json({ token: generateToken(user) })
}`

const FIXED_CODE = `const user = await query(
  'SELECT * FROM users WHERE username = $1',
  [username]
)

if (await bcrypt.compare(password, user.passwordHash)) {
  return Response.json({ token: generateToken(user) })
}`

export function DiffViewer() {
  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card glow-border-blue">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-card-foreground">Self-Healing Code Review</h3>
        <Button size="sm" className="gap-2">
          <GitBranch className="h-3 w-3" />
          Commit to GitHub
        </Button>
      </div>
      <div className="flex flex-1 divide-x divide-border">
        <div className="flex-1 flex flex-col">
          <div className="border-b border-border bg-destructive/10 px-4 py-2">
            <span className="text-xs font-medium text-destructive">Current Code (Vulnerable)</span>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-xs">
            <pre className="text-foreground/80">
              {CURRENT_CODE.split("\n").map((line, idx) => (
                <div key={idx} className="hover:bg-destructive/5">
                  <span className="inline-block w-8 select-none text-muted-foreground">{idx + 1}</span>
                  {line}
                </div>
              ))}
            </pre>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="border-b border-border bg-chart-4/10 px-4 py-2">
            <span className="text-xs font-medium text-chart-4">AI-Fixed Code (Secure)</span>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-xs">
            <pre className="text-foreground/80">
              {FIXED_CODE.split("\n").map((line, idx) => (
                <div key={idx} className="hover:bg-chart-4/5">
                  <span className="inline-block w-8 select-none text-muted-foreground">{idx + 1}</span>
                  {line}
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

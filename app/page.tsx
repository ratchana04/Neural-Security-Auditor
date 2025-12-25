"use client"

import { useState, useMemo, useEffect } from "react"
import { TechCursor } from "@/components/ui/tech-cursor"
import { CodeEditor } from "@/components/ui/code-editor" 
import { Terminal } from "@/components/ui/terminal"
import { MultiAgentStatus } from "@/components/ui/multi-agent-status"
import { DebateFeed } from "@/components/ui/debate-feed"
import { RAGContext } from "@/components/ui/rag-context"
import { SecurityGauge } from "@/components/ui/security-gauge"
import { IssueFeed } from "@/components/ui/issue-feed"
import { VulnerabilityMap } from "@/components/ui/vulnerability-map"
import { RemediationModal } from "@/components/ui/remediation-modal" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge" 
import { 
  Play, 
  Shield, 
  Github, 
  Code2, 
  Loader2, 
  RefreshCcw, 
  GitBranch, 
  Globe,
  Lock,
  Download
} from "lucide-react"
import { runComplexAudit, type AuditLog } from "@/lib/audit-logic"

export default function SecurityAuditorDashboard() {
  const [mounted, setMounted] = useState(false)
  const [inputMode, setInputMode] = useState<"paste" | "repo">("paste")
  const [sourceCode, setSourceCode] = useState(`export async function POST(request: Request) {
  const { username, password } = await request.json()
  
  // VULNERABLE: Direct interpolation
  const user = await query(\`SELECT * FROM users WHERE username = '\${username}'\`)
  
  if (user.password === password) {
    return Response.json({ token: "secret" })
  }
}`)
  const [repoUrl, setRepoUrl] = useState("")
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [isPatching, setIsPatching] = useState(false) // New state for PR creation
  const [selectedIssue, setSelectedIssue] = useState<AuditLog | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Dynamic Security Score Calculation
  const securityScore = useMemo(() => {
    const criticalIssues = logs.filter(l => l.type === "error" || l.type === "warning")
    if (criticalIssues.length === 0) return 100
    
    const totalPenalty = logs.reduce((acc, log) => {
      if (log.severity) return acc + log.severity;
      if (log.type === "error") return acc + 25;
      if (log.type === "warning") return acc + 15;
      return acc;
    }, 0)

    return Math.max(0, Math.min(100, 100 - totalPenalty))
  }, [logs])

  const handleRunScan = async () => {
    setIsScanning(true)
    setLogs([]) 
    const contentToAnalyze = inputMode === "paste" ? sourceCode : repoUrl
    try {
      await runComplexAudit(contentToAnalyze, (newLog) => {
        setLogs((prev) => [...prev, newLog])
      })
    } catch (error) {
      console.error("Audit Engine Error:", error)
    } finally {
      setIsScanning(false)
    }
  }

  /**
   * UPDATED: handleApplyPatch
   * This logic now connects to your live /api/github/patch route
   */
  const handleApplyPatch = async (fixedIssue: AuditLog) => {
    setIsPatching(true);
    
    // Log intent to the terminal
    setLogs(prev => [...prev, {
      text: `PATCH INITIATED: Creating GitHub Pull Request for ${fixedIssue.filePath || 'selected file'}...`,
      type: "info",
      time: new Date().toLocaleTimeString(),
      agentName: "Architect"
    }]);

    try {
      const response = await fetch("/api/github/patch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl: repoUrl,
          patchCode: fixedIssue.snippet, 
          issueTitle: fixedIssue.text,
          filePath: fixedIssue.filePath
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Success: Clean up finding and show the link
        setLogs((prevLogs) => prevLogs.filter((log) => 
          !(log.text === fixedIssue.text && log.time === fixedIssue.time)
        ));

        setLogs(prev => [...prev, {
          text: `GITHUB INTEGRATION SUCCESSFUL: PR created at ${data.url}`,
          type: "success",
          agentName: "Architect",
          time: new Date().toLocaleTimeString(),
        }]);

        // Feedback: Open the PR in a new tab
        window.open(data.url, '_blank');
      } else {
        throw new Error(data.error || "GitHub API Error");
      }
    } catch (error: any) {
      setLogs(prev => [...prev, {
        text: `PATCH FAILED: ${error.message}. Check your GITHUB_TOKEN in .env.local`,
        type: "error",
        agentName: "System",
        time: new Date().toLocaleTimeString(),
      }]);
    } finally {
      setIsPatching(false);
      setSelectedIssue(null);
    }
  }

  const downloadReport = () => {
    const reportText = logs.map(l => `[${l.time}] ${l.agentName || 'SYSTEM'}: ${l.text}`).join('\n')
    const blob = new Blob([reportText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Security_Report_${new Date().getTime()}.txt`
    a.click()
  }

  const handleReset = () => {
    setLogs([])
    setIsScanning(false)
    setSelectedIssue(null)
  }

  if (!mounted) return null

  return (
    <div className="relative min-h-screen w-full bg-background overflow-x-hidden">
      <TechCursor />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md px-6">
        <div className="flex h-14 items-center justify-between max-w-[1800px] mx-auto">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <h1 className="text-sm font-black tracking-tighter uppercase italic">
              Neural<span className="text-primary font-light">Auditor</span>
            </h1>
          </div>
          
          <div className="flex bg-muted/50 p-1 rounded-md border border-border">
            <Button variant={inputMode === "paste" ? "secondary" : "ghost"} size="sm" onClick={() => setInputMode("paste")} className="h-7 text-[10px] uppercase font-bold px-4">
              <Code2 className="h-3.5 w-3.5 mr-2" /> Paste
            </Button>
            <Button variant={inputMode === "repo" ? "secondary" : "ghost"} size="sm" onClick={() => setInputMode("repo")} className="h-7 text-[10px] uppercase font-bold px-4">
              <Github className="h-3.5 w-3.5 mr-2" /> Repository
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {logs.length > 0 && (
              <Button variant="outline" size="sm" onClick={downloadReport} className="h-8 gap-2 text-[10px] font-bold border-primary/20">
                <Download className="h-3.5 w-3.5" /> REPORT
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleReset} className="h-8 w-8 p-0 border-dashed">
              <RefreshCcw className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
            <Button 
              size="sm" 
              className="h-8 gap-2 px-6 text-[11px] font-black shadow-lg shadow-primary/20 transition-all active:scale-95" 
              onClick={handleRunScan} 
              disabled={isScanning}
            >
              {isScanning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
              {isScanning ? "SCANNING..." : "RUN SECURITY AUDIT"}
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-[1800px] mx-auto space-y-6">
        <div className="grid gap-6 lg:grid-cols-4">
          <SecurityGauge score={securityScore} />
          <div className="lg:col-span-3">
            <MultiAgentStatus isScanning={isScanning} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            {inputMode === "paste" ? (
              <CodeEditor value={sourceCode} onChange={setSourceCode} />
            ) : (
              <div className="flex flex-col h-[550px] rounded-xl border border-border bg-card/30 backdrop-blur-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase text-muted-foreground">
                    <Github className="h-4 w-4" /> Repo Integration Mode
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-[9px] font-mono"><GitBranch className="h-3 w-3 mr-1"/> main</Badge>
                    <Badge variant="outline" className="text-[9px] font-mono border-emerald-500/50 text-emerald-500"><Lock className="h-3 w-3 mr-1"/> Protected</Badge>
                  </div>
                </div>
                <div className="flex flex-1 overflow-hidden">
                  <div className="w-80 border-r border-border bg-muted/5">
                    <VulnerabilityMap logs={logs} />
                  </div>
                  <div className="flex-1 p-10 flex flex-col justify-center items-center gap-6">
                    <Globe className="h-32 w-32 opacity-10 animate-pulse" />
                    <Input 
                      placeholder="https://github.com/user/repo" 
                      value={repoUrl} 
                      onChange={(e) => setRepoUrl(e.target.value)} 
                      className="h-12 bg-background/50 text-center font-mono border-primary/20 max-w-md" 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <IssueFeed logs={logs} onSelectIssue={setSelectedIssue} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Terminal logs={logs} />
          <DebateFeed logs={logs} />
          <RAGContext />
        </div>
      </main>

      {selectedIssue && (
        <RemediationModal 
          issue={selectedIssue} 
          onClose={() => setSelectedIssue(null)} 
          onApply={handleApplyPatch} 
        />
      )}

      {/* Optional: Add a screen-wide loader if patching is active */}
      {isPatching && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-sm font-bold animate-pulse tracking-widest uppercase">Generating GitHub PR...</p>
          </div>
        </div>
      )}
    </div>
  )
}
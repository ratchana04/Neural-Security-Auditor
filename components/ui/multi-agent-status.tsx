"use client"

import { Shield, Code, AlertTriangle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

// Define the interface to receive the isScanning prop from page.tsx
interface MultiAgentStatusProps {
  isScanning: boolean
}

export function MultiAgentStatus({ isScanning }: MultiAgentStatusProps) {
  // Define agents dynamically based on the scanning state
  const agents = [
    { 
      name: "Security Researcher", 
      icon: Shield, 
      status: isScanning ? "active" : "idle", 
      color: "text-primary" 
    },
    { 
      name: "False-Positive Verifier", 
      icon: AlertTriangle, 
      status: isScanning ? "thinking" : "idle", 
      color: "text-amber-500" 
    },
    { 
      name: "Software Architect", 
      icon: Code, 
      status: "idle", 
      color: "text-blue-500" 
    },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Multi-Agent Status
        </h3>
        {isScanning && (
          <div className="flex items-center gap-1 text-[10px] text-primary font-bold">
            <Loader2 className="h-3 w-3 animate-spin" />
            LIVE ANALYSIS
          </div>
        )}
      </div>

      {agents.map((agent, idx) => (
        <div 
          key={idx} 
          className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
            agent.status !== "idle" ? "border-primary/30 bg-primary/5 shadow-sm" : "border-border bg-card/50"
          }`}
        >
          <div className="relative">
            <agent.icon className={`h-5 w-5 ${agent.status === "idle" ? "text-muted-foreground opacity-40" : agent.color}`} />
            
            {/* Animation for Active State */}
            {agent.status === "active" && (
              <motion.div
                className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-emerald-500"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
            
            {/* Animation for Thinking State */}
            {agent.status === "thinking" && (
              <motion.div
                className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-amber-500"
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className={`text-xs font-semibold truncate ${agent.status === "idle" ? "text-muted-foreground" : "text-card-foreground"}`}>
              {agent.name}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] uppercase font-bold tracking-tighter ${
                agent.status === "active" ? "text-emerald-500" : 
                agent.status === "thinking" ? "text-amber-500" : 
                "text-muted-foreground/50"
              }`}>
                {agent.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
"use client"

import { motion } from "framer-motion"

export function SecurityGauge({ score = 67 }: { score?: number }) {
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6">
      <h3 className="text-sm font-semibold text-card-foreground">Security Health Score</h3>
      <div className="relative">
        <svg className="h-32 w-32 -rotate-90 transform">
          <circle cx="64" cy="64" r="45" stroke="currentColor" strokeWidth="8" fill="none" className="text-secondary" />
          <motion.circle
            cx="64"
            cy="64"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={score >= 80 ? "text-chart-4" : score >= 60 ? "text-chart-5" : "text-destructive"}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">{score}</div>
            <div className="text-xs text-muted-foreground">/ 100</div>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground max-w-[200px] leading-relaxed">
        {score >= 80
          ? "Excellent security posture"
          : score >= 60
            ? "Moderate security concerns"
            : "Critical vulnerabilities detected"}
      </p>
    </div>
  )
}

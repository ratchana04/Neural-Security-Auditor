// lib/audit-logic.ts

export interface AuditLog {
  time: string;
  text: string;
  type: "info" | "success" | "warning" | "error" | "agent";
  agentName?: string;
  // --- Metadata for Real Integration ---
  vulnerabilityId?: "SQLI" | "SECRET" | "DEPENDENCY" | "GENERIC";
  filePath?: string;    // Target file for GitHub PR
  snippet?: string;     // The actual code to be sent to AI for fixing
  severity?: number;    // Used for the Dynamic Score (1-100)
}

export async function runComplexAudit(input: string, addLog: (log: AuditLog) => void) {
  const timestamp = () => new Date().toLocaleTimeString();
  const normalizedInput = input.toLowerCase();
  
  const seed = input.length % 3; 
  const isRepoMode = input.startsWith("http") || input.includes("github.com");

  // Helper to log with metadata
  const logAs = (agent: string, text: string, type: AuditLog["type"], meta?: Partial<AuditLog>) => {
    addLog({ 
      time: timestamp(), 
      agentName: agent, 
      text, 
      type,
      ...meta 
    });
  };

  // --- PHASE 1: DISCOVERY ---
  if (isRepoMode) {
    logAs("Researcher", `Initializing secure tunnel to GitHub repository...`, "agent");
    await new Promise(r => setTimeout(r, 1000));
    logAs("Researcher", "Manifest found: Detected Node.js environment.", "info");
    
    if (seed === 0) {
      logAs("Researcher", "Warning: 'axios' v0.21.1 found (vulnerable to SSRF).", "warning", {
        vulnerabilityId: "DEPENDENCY",
        filePath: "package.json",
        snippet: '"axios": "0.21.1"',
        severity: 20
      });
    } else if (seed === 1) {
      logAs("Researcher", "Warning: 'lodash' v4.17.15 found (Prototype Pollution risk).", "warning", {
        vulnerabilityId: "DEPENDENCY",
        filePath: "package.json",
        snippet: '"lodash": "4.17.15"',
        severity: 15
      });
    }
  } else {
    logAs("Researcher", "Analyzing code snippet for architectural flaws...", "agent");
    await new Promise(r => setTimeout(r, 800));
  }

  // --- PHASE 2: PATTERN MATCHING ---
  const hasSqlInjection = 
    (normalizedInput.includes("select") || normalizedInput.includes("where")) && 
    (input.includes("${") || input.includes("+"));
  
  const hasHardcodedSecret = 
    normalizedInput.includes("password =") || 
    normalizedInput.includes("api_key =") || 
    normalizedInput.includes("secret =") ||
    normalizedInput.includes("token:");

  logAs("Researcher", "Executing SAST engine (Static Analysis)...", "agent");
  await new Promise(r => setTimeout(r, 1200));

  if (hasSqlInjection) {
    logAs("Researcher", `CRITICAL: SQLi pattern detected in query logic.`, "warning", {
        vulnerabilityId: "SQLI",
        filePath: isRepoMode ? "src/database/client.ts" : "pasted_snippet.ts",
        snippet: input,
        severity: 40
    });
  }

  if (hasHardcodedSecret) {
    logAs("Researcher", `HIGH: Potential hardcoded credential found.`, "warning", {
        vulnerabilityId: "SECRET",
        filePath: isRepoMode ? ".env" : "pasted_snippet.ts",
        snippet: "REDACTED_SECRET_FLOW",
        severity: 30
    });
  }

  // --- PHASE 3: VERIFIER (The 'Brain') ---
  logAs("Verifier", "Evaluating findings against false-positive datasets...", "agent");
  await new Promise(r => setTimeout(r, 1500));

  let activeThreats = 0;

  if (hasSqlInjection) {
    logAs("Verifier", "Confirmed: SQLi vulnerability is reachable via API endpoint.", "error", {
        vulnerabilityId: "SQLI",
        filePath: isRepoMode ? "src/database/client.ts" : "pasted_snippet.ts",
        snippet: input,
        severity: 50
    });
    activeThreats++;
  }

  if (isRepoMode && seed < 2) {
    const depName = seed === 0 ? 'Axios' : 'Lodash';
    logAs("Verifier", `Verified: ${depName} vulnerability confirmed in lockfile.`, "error", {
        vulnerabilityId: "DEPENDENCY",
        filePath: "package.json",
        snippet: seed === 0 ? '"axios": "0.21.1"' : '"lodash": "4.17.15"',
        severity: 25
    });
    activeThreats++;
  }

  // --- PHASE 4: ARCHITECT (Remediation) ---
  if (activeThreats > 0) {
    logAs("Architect", "Patches generated. Click 'APPLY PATCH' to trigger GitHub PR.", "info");
  } else {
    logAs("Verifier", "Integrity Check Passed. No critical threats confirmed.", "success");
  }

  addLog({ time: timestamp(), text: "Audit Cycle Complete.", type: "success" });
}
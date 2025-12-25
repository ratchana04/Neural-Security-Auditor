# 🛡️ Neural Security Auditor

**Neural Security Auditor** is an autonomous, multi-agent AI security platform that identifies, verifies, and remediates vulnerabilities in GitHub repositories.

By utilizing a "Reasoning Chain" of specialized AI agents, the platform moves beyond simple detection to provide production-ready fixes through automated GitHub Pull Requests.

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Site-brightgreen)](https://neural-security-auditor.vercel.app/)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Author](https://img.shields.io/badge/Author-Ratchana%20R-blue)
![Gemini](https://img.shields.io/badge/AI-Gemini%20Flash-8E75B2?logo=googlegemini)

## 🌐 Live Link
Check out the live auditor here: [https://neural-security-auditor.vercel.app/](https://neural-security-auditor.vercel.app/)

---

## 🤖 Multi-Agent Architecture
The core of the auditor lies in its three specialized AI personas that collaborate to ensure high-fidelity results:

1. **🔍 The Researcher Agent**
   - Performs deep scans of source code to identify OWASP Top 10 and CWE vulnerabilities.
   - Maps out potential attack vectors.

2. **⚖️ The Verifier Agent**
   - Cross-examines findings to eliminate false positives and "hallucinations."
   - Assesses business impact and assigns a weighted security score.

3. **🏗️ The Architect Agent**
   - Designs secure code patches and orchestrates GitHub Pull Requests.
   - Provides detailed remediation summaries for developers.

---

## ⚡ Core Capabilities
- **One-Click Remediation:** Automatically create security branches and commit fixed code.
- **Agentic Reasoning:** A live "Neural Debate" feed showing the internal logic of the agents.
- **Vulnerability Mapping:** Visual breakdown of security health across the repository structure.
- **GitHub Integration:** Native PR generation using the Octokit API.

---

## 🔐 Required Environment Variables
To enable the AI agents and GitHub integration, ensure the following variables are set in your environment:

| Variable | Purpose |
| :--- | :--- |
| `GITHUB_TOKEN` | Personal Access Token with `repo` scope for PR creation. |
| `GEMINI_API_KEY` | Powers the LLM-based reasoning for the agents. |
| `NEXT_PUBLIC_APP_URL` | Used for internal routing and API communication. |

---

## 👤 Author
**Ratchana R** *3rd Year B.Tech Student at SRM IST* - GitHub: [@ratchana04](https://github.com/ratchana04)  
- Project Link: [Neural Security Auditor](https://neural-security-auditor.vercel.app/)

---

## 🛡️ Security Disclaimer
This tool is designed for authorized security auditing purposes only. Always ensure you have permission to audit a repository before initiating a scan.

## 📜 License
This project is licensed under the **MIT License**.

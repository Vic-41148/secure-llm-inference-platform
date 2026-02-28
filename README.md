# 🛡️ NEURO-SENTRY DEFENSE SYSTEM
## Complete Full-Stack LLM Security Platform

<img src="src/banner.png" alt="Neuro-Sentry Dashboard" style="display:block;max-width:400px;width:80%;height:auto;margin:auto;">

> **A systematic framework for simulating, detecting, and mitigating prompt injection and jailbreak attacks on Large Language Models.**

![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95-green)
![React](https://img.shields.io/badge/Frontend-React-cyan)
![Groq](https://img.shields.io/badge/LLM-Groq_API-orange)
![Ollama](https://img.shields.io/badge/LLM-Ollama%2FLocal-orange)
![Railway](https://img.shields.io/badge/Backend-Railway-blueviolet)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black)
![Status](https://img.shields.io/badge/Status-Active_Development-brightgreen)

---
[![Live Demo](https://img.shields.io/badge/Live_Demo-neuro--sentry.vercel.app-blueviolet?style=for-the-badge&logo=vercel)](https://neuro-sentry.vercel.app/)
---

## 🏫 Project & Academic Details

**Institution:** [KR Mangalam University](https://www.krmangalam.edu.in/)  
**Course:** BCA (AI & Data Science)  
**Semester:** 4  
**Internal Coordinator:** Dr. Ravinder Beniwal  
**Email:** ravinder.beniwal@krmangalam.edu.in  

<img src="https://cdn-ilakggn.nitrocdn.com/qfLlPHxtFDGRhIOUKhiZcDNvbHvEtWcT/assets/images/optimized/rev-5a3e233/www.krmangalam.edu.in/wp-content/uploads/2025/11/KRMU-Logo-NAAC.webp" alt="KRMU Logo" style="display:block;max-width:300px;width:90%;height:auto;">

---

### 👥 The Team

| Name | Roll Number | Role |
| :--- | :--- | :--- |
| **Aditya Shibu** | 2401201047 | **Team Leader** / Backend Architect / Attack Simulation / Red Teaming |
| **Akash Sharma** | 2401201108 | Defense Logic / Blue Teaming |
| **Bhavya Rattan, Lakshya Dangwal** | 2401201004 | Frontend & Visualization |

---

## 📖 Project Overview

As Large Language Models (LLMs) like GPT-4 and Llama-3 become integral to software, they introduce critical security vulnerabilities. **Prompt Injection** and **Jailbreaking** allow malicious users to manipulate LLM outputs, bypass safety filters, and leak sensitive data.

**NEURO-SENTRY DEFENSE SYSTEM** is a complete full-stack production platform designed to:
1. **Demonstrate** vulnerabilities in standard LLM deployments
2. **Simulate** real-world attacks (DAN, Roleplay, Obfuscation, Encoding)
3. **Implement** a layered 3-stage hybrid detection pipeline
4. **Evaluate** security performance using quantitative metrics
5. **Provide** direct LLM interaction with real-time threat detection and audit logging

---

## ⚙️ System Architecture

The platform runs in two modes depending on environment:

```
─── PRODUCTION (Vercel + Railway + Groq) ────────────────────
┌─────────────────────────────────────────────────────┐
│                  Vercel (Frontend)                  │
│              React + Tailwind + Vite                │
└────────────────────────┬────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────┐
│               Railway (Backend)                     │
│               FastAPI + PostgreSQL                  │
│  ┌──────────┐   ┌──────────────┐   ┌─────────────┐ │
│  │  rules   │ → │  classifier  │ → │   pipeline  │ │
│  │  .py     │   │  .py (Groq)  │   │   fusion    │ │
│  └──────────┘   └──────────────┘   └─────────────┘ │
│       audit.py + adaptive.py + db.py                │
└────────────────────────┬────────────────────────────┘
                         │ API calls
┌────────────────────────▼────────────────────────────┐
│  Groq Cloud API — llama-3.3-70b / llama-3.1-8b      │
└─────────────────────────────────────────────────────┘

─── LOCAL DEV (start-all.sh + Ollama) ───────────────────────
┌─────────────────────────────────────────────────────┐
│        Vite Dev Server  (localhost:5173)             │
└────────────────────────┬────────────────────────────┘
                         │ localhost
┌────────────────────────▼────────────────────────────┐
│        FastAPI Backend  (localhost:8000)             │
│        SQLite DB  +  same pipeline modules          │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│        Ollama  (localhost:11434)                     │
│        Auto-selects: llama3-gpu > llama3 > mistral  │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features

### 🔴 Red Team (Attack Engine)
* **Direct Injection:** Overriding system prompts to force unintended behaviors
* **Jailbreak Library:** Automated testing of known jailbreaks (DAN, Mongo Tom, AIM)
* **Encoding Attacks:** Base64, ROT13, and obfuscation bypass attempts
* **Social Engineering:** Authority impersonation and credential-based attacks
* **Attack Lab:** Interactive testing interface with pre-built attack vectors

### 🔵 Blue Team (3-Stage Defense Pipeline)
* **Stage 1 — Rule Engine:** Regex + heuristic pattern matching (zero latency, catches obvious threats)
* **Stage 2 — Groq Classifier:** LLM-based semantic classification (`llama-3.1-8b-instant`)
* **Stage 3 — Score Fusion:** Weighted risk score combining both stages → block / flag / allow
* **Fast-Block Path:** High-confidence attacks (score ≥ 85) skip Stage 2 entirely
* **Adaptive Blocking:** Session tracking escalates repeated attackers automatically

### 📊 Security Ops Dashboard (MonitoringPanel)
* Real-time audit log of every request with risk scores and decisions
* Session-level threat tracking and escalation visibility
* Live stats: total blocked, flagged, allowed, block rate
* Defense ON/OFF toggle for testing bypass vs. detection behavior

### 💬 Direct Neural Link
* Live LLM chat proxied through the secured backend
* Session-level adaptive risk tracking applies here too
* Real-time connection status indicator

---

## 🧪 Synopsis Evaluation

**Date:** 2026-01-31  

**Evaluation Focus:**  
Real-time detection using prompt classification (benign vs malicious) combined with rule-based and ML/LLM-based filters before inference. Emphasis on logging, risk scoring, and adaptive blocking to assess enterprise readiness.

### Evaluation Checklist (Current Status)

| Item | Status |
| :--- | :---: |
| Real-time prompt classification (Benign vs Malicious) | ✅ |
| Rule-based pre-inference filtering | ✅ |
| ML/LLM-based pre-inference filtering (Groq) | ✅ |
| Combined hybrid detection pipeline (Rules + ML) | ✅ |
| Centralized logging of prompts and decisions | ✅ |
| Risk scoring per request | ✅ |
| Adaptive blocking based on risk thresholds | ✅ |
| Enterprise-ready monitoring & audit trail | ⚑ partial (dashboard built, wiring in progress) |

**Current score: ~6–7 / 8**

---

## 📦 Repository Structure

```
secure-llm-inference-platform/
├── src/                        # React frontend (Vite)
│   ├── components/
│   │   ├── MonitoringPanel.jsx # Security Ops dashboard
│   │   ├── DirectChat.jsx      # Direct Neural Link chat
│   │   ├── AttackLab.jsx       # Attack testing interface
│   │   └── ...
│   └── services/
│       └── api.js              # Backend API client
├── backend/                    # FastAPI backend (Railway)
│   ├── app/
│   │   ├── main.py             # FastAPI app + routes
│   │   ├── pipeline.py         # 3-stage detection pipeline
│   │   ├── rules.py            # Rule-based pattern engine
│   │   ├── classifier.py       # Groq LLM classifier
│   │   ├── inference.py        # Groq inference (chat)
│   │   ├── adaptive.py         # Session-level threat tracking
│   │   ├── audit.py            # Audit logger
│   │   ├── db.py               # SQLite / Postgres abstraction
│   │   └── config.py           # Env-var driven config
│   └── requirements.txt
├── attacks/                    # Attack vector definitions
├── logs/                       # Local dev logs
└── README.md
```

---

## 🛠️ Technology Stack

| Layer | Local Dev | Production |
| :--- | :--- | :--- |
| Frontend | React 18 + Tailwind + Vite | Same → Vercel |
| Backend | FastAPI + Uvicorn | Same → Railway |
| LLM Inference | Ollama (llama3-gpu / llama3 / mistral) | Groq — `llama-3.3-70b-versatile` |
| LLM Classifier | Ollama fallback | Groq — `llama-3.1-8b-instant` |
| Database | SQLite (auto) | PostgreSQL (Railway) |
| Launcher | `./start-all.sh` / `start-all.bat` | Vercel + Railway CI |
| Tools | Git, Postman, VS Code | — |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Service info |
| `GET` | `/health` | Health check + database mode |
| `POST` | `/chat` | Direct LLM chat (Neural Link) |
| `POST` | `/api/prompt` | Full security pipeline analysis |
| `GET` | `/api/stats` | Live request statistics |
| `GET` | `/api/audit` | Audit log with filters |
| `GET` | `/api/audit/summary` | Aggregated audit summary |
| `GET` | `/api/adaptive/sessions` | Active session threat levels |

---

## 🌐 Local Development Setup

The launcher (`start-all.sh` / `start-all.bat`) handles everything automatically — installs deps, detects your Ollama model, and brings all services up with one command.

### Prerequisites
- Node.js 18+
- Python 3.10+
- [Ollama](https://ollama.ai) installed and running

### 🐧 Linux / macOS

```bash
chmod +x start-all.sh   # first time only
./start-all.sh
```

### 🪟 Windows

```cmd
start-all.bat
```

Or with PowerShell (if you get a script execution error, run this once as Admin first):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\start-all.ps1
```

### What the launcher does

1. Checks Node, Python, Ollama
2. Auto-selects best available model: `llama3-gpu` → `llama3` → `mistral` → pulls `llama3` if none found
3. Installs frontend + backend dependencies
4. Starts Ollama, FastAPI backend, and Vite dev server
5. Prints local + network access URLs (mobile-accessible on same WiFi)
6. `Ctrl+C` stops everything cleanly

**Frontend:** http://localhost:5173  
**Backend:** http://localhost:8000

### Environment (optional overrides)

```env
# Backend (.env) — only needed for production / Groq mode
GROQ_API_KEY=gsk_...
INFERENCE_MODEL=llama-3.3-70b-versatile
CLASSIFIER_MODEL=llama-3.1-8b-instant
NEURO_SENTRY_API_KEY=ns_your_strong_key
DATABASE_URL=                        # leave blank → SQLite in dev

# Frontend (.env.local) — only needed for production
VITE_API_URL=https://your-backend.up.railway.app
VITE_API_KEY=ns_your_strong_key
```

> Local dev uses `VITE_API_URL=auto` which smart-detects the backend on the same machine — no config needed.

---

## 🔒 Security Notes

- Rule engine catches known jailbreak patterns before any LLM call is made
- Fast-block path short-circuits Stage 2 on obvious attacks (saves Groq tokens)
- Adaptive session tracker escalates users who probe repeatedly
- All requests — blocked or allowed — are written to the audit log
- Defense OFF mode lets attacks through intentionally, for red-team testing

**This platform is for security research and education only.**

---

## 🐛 Debugging

```bash
# Local backend health
curl http://localhost:8000/health

# Production backend health
curl https://your-backend.up.railway.app/health

# Expected response:
# { "status": "online", "database": "postgresql" }   ← prod
# { "status": "online", "database": "sqlite" }        ← local dev

# View backend logs (local)
tail -f backend/logs/backend_*.log

# Check Ollama (local only)
ollama list
curl http://localhost:11434/api/tags
```

**Common issues:**

- `"Permission denied" ./start-all.sh` → run `chmod +x start-all.sh` first
- `"Ollama not found"` → install from https://ollama.ai
- `"Backend won't start"` → check `backend/logs/backend_*.log`
- `"No LLM response"` → verify Ollama is running: `ollama list`

---

## 🎉 That's It

The live platform is at **[neuro-sentry.vercel.app](https://neuro-sentry.vercel.app/)** — no local setup required to explore it.

```
███╗   ██╗███████╗██╗   ██╗██████╗  ██████╗     
████╗  ██║██╔════╝██║   ██║██╔══██╗██╔═══██╗    
██╔██╗ ██║█████╗  ██║   ██║██████╔╝██║   ██║    
██║╚██╗██║██╔══╝  ██║   ██║██╔══██╗██║   ██║    
██║ ╚████║███████╗╚██████╔╝██║  ██║╚██████╔╝    
╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝     

███████╗███████╗███╗   ██╗████████╗██████╗ ██╗   ██╗
██╔════╝██╔════╝████╗  ██║╚══██╔══╝██╔══██╗╚██╗ ██╔╝
███████╗█████╗  ██╔██╗ ██║   ██║   ██████╔╝ ╚████╔╝ 
╚════██║██╔══╝  ██║╚██╗██║   ██║   ██╔══██╗  ╚██╔╝  
███████║███████╗██║ ╚████║   ██║   ██║  ██║   ██║   
╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   
```

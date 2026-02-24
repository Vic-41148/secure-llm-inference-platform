# 🛡️ NEURO-SENTRY DEFENSE SYSTEM
## Complete Full-Stack LLM Security Platform

<img src="src/banner.png" alt="Project Banner / Dashboard Screenshot Placeholder" style="display:block;max-width:400px;width:80%;height:auto;margin:auto;">

> **A systematic framework for simulating, detecting, and mitigating prompt injection and jailbreak attacks on Large Language Models.**

![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95-green)
![React](https://img.shields.io/badge/Frontend-React-cyan)
![Ollama](https://img.shields.io/badge/LLM-Ollama%2FLocal-orange)
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

**NEURO-SENTRY DEFENSE SYSTEM** (formerly LLM-Guard) is a complete full-stack platform designed to:
1. **Demonstrate** vulnerabilities in standard LLM deployments
2. **Simulate** real-world attacks (DAN, Roleplay, Obfuscation)
3. **Implement** layered defense mechanisms (Sanitization, Vector Analysis)
4. **Evaluate** security performance using quantitative metrics
5. **Provide** direct LLM interaction with real-time threat detection

---

## ⚡ Quick Start

### 🐧 Linux / macOS

**Step 1 — Install Ollama**
```bash
curl https://ollama.ai/install.sh | sh
```

**Step 2 — Make the launcher executable** *(only needed once after cloning/extracting)*
```bash
chmod +x start-all.sh
```

**Step 3 — Run**
```bash
cd neuro-sentry-merged
./start-all.sh
```

**Step 4 — Done!**  
Open http://localhost:5173

---

### 🪟 Windows

**Step 1 — Install Ollama**  
Download and run the installer from: https://ollama.ai

**Step 2 — Run**

**Option A — Batch file (recommended, no extra setup):**
```cmd
cd neuro-sentry-merged
start-all.bat
```

**Option B — PowerShell script:**

If you get a *"script cannot be loaded because running scripts is disabled"* error, you need to allow script execution first. Open PowerShell **as Administrator** and run once:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then launch normally:
```powershell
cd neuro-sentry-merged
.\start-all.ps1
```
> ℹ️ `RemoteSigned` allows local scripts to run while still blocking unsigned scripts downloaded from the internet. You only need to set this once.

**Step 3 — Done!**  
Open http://localhost:5173

---

## 🎯 What's Included

### ✅ Frontend (React + Tailwind)
- Command Center dashboard
- Attack Lab testing interface
- **Direct Neural Link** - Live LLM chat
- Real-time console logs
- Cyberpunk UI

### ✅ Backend (FastAPI + Ollama)
- Auto-detects best Ollama model (llama3-gpu > llama3 > mistral)
- Real LLM integration
- Threat pattern detection
- Comprehensive logging to `backend/logs/`
- Health monitoring

### ✅ Smart Launcher
- Auto-installs everything
- Detects and downloads Ollama models if missing
- Handles all setup automatically
- One command to rule them all

---

## 📦 Package Structure

```
neuro-sentry-merged/
├── src/                    # Frontend React app
│   ├── components/
│   │   ├── DirectChat.jsx  # Live LLM chat
│   │   ├── AttackLab.jsx   # Attack testing
│   │   └── ...
│   └── services/
│       └── api.js          # Backend integration
├── backend/                # FastAPI backend
│   ├── app/
│   │   └── main.py        # Auto-detecting backend
│   ├── logs/              # All logs go here
│   └── requirements.txt
├── start-all.sh           # Linux/macOS launcher
├── start-all.bat          # Windows launcher (batch)
├── start-all.ps1          # Windows launcher (PowerShell)
└── README.md              # This file
```

---

## 🚀 Key Features

### 🔴 Red Team (Attack Engine)
* **Direct Injection:** Overriding system prompts to force unintended behaviors
* **Jailbreak Library:** Automated testing of known jailbreaks (e.g., DAN, Mongo Tom)
* **RAG Poisoning:** Simulating indirect injections via compromised document retrieval
* **Attack Lab:** Interactive testing interface with pre-built attack vectors

### 🔵 Blue Team (Defense Layer)
* **Context Isolation:** Separating user data from system instructions
* **Input Filtering:** Detecting aggressive or manipulative patterns before inference
* **PII Redaction:** Automatically masking sensitive data in outputs
* **Real-time Detection:** Live threat detection with security toggle (ON/OFF)

### 📊 Analytics Dashboard
* Real-time toggle for **Defense ON/OFF**
* Visual metrics comparing attack success rates
* Live chat log with security flagging
* System metrics and health monitoring

### 💬 Direct Neural Link
* **Live LLM Chat:** Direct interaction with local LLM (llama3-gpu preferred)
* **Real-time Streaming:** Immediate responses with no filtering
* **Connection Status:** Real-time monitoring of LLM connectivity

---

## 🧪 Synopsis Evaluation  
**Date:** 2026-01-31  

**Evaluation Focus:**  
Real-time detection using prompt classification (benign vs malicious) combined with rule-based and ML/LLM-based filters before inference. Emphasis on logging, risk scoring, and adaptive blocking to assess enterprise readiness.

### Evaluation Checklist (Current Status)

- ❌ Real-time prompt classification (Benign vs Malicious)  
- ❌ Rule-based pre-inference filtering  
- ❌ ML/LLM-based pre-inference filtering  
- ❌ Combined hybrid detection pipeline (Rules + ML)  
- ❌ Centralized logging of prompts and decisions  
- ❌ Risk scoring per request  
- ❌ Adaptive blocking based on risk thresholds  
- ❌ Enterprise-ready monitoring & audit trail  

**Last Evaluation Conducted:** 31 January 2026

---

## 🤖 Model Selection

The backend automatically uses the best available model:

**Priority:**
1. `llama3-gpu` (GPU accelerated) ⚡
2. `llama3` (standard)
3. `mistral` (fallback)
4. First available model

**Your models:**
```bash
ollama list
# NAME                 ID              SIZE
# llama3-gpu:latest    51ad047ed961    4.7 GB  ← Will use this!
# mistral:latest       6577803aa9a0    4.4 GB
# llama3:latest        365c0bd3c000    4.7 GB
```

The backend will automatically use `llama3-gpu` for maximum performance!

---

## 📡 API Endpoints

The backend exposes:

- `GET /` - Service info
- `GET /health` - Health + model info
- `POST /chat` - Direct LLM chat (Direct Neural Link)
- `POST /api/prompt` - Security analysis (Attack Lab)
- `GET /api/stats` - Statistics
- `GET /api/logs` - Recent logs

---

## 📝 Logging

All backend logs are saved to `backend/logs/`

**View logs in real-time:**
```bash
tail -f backend/logs/backend_*.log
```

**Logs include:**
- Model detection
- Every API request
- LLM responses
- Threat detections
- Errors and warnings

---

## 🛠️ Technology Stack

* **Core Logic:** Python 3.10
* **API Framework:** FastAPI + Uvicorn
* **Model Runtime:** Ollama (Local Inference)
* **LLMs Used:** LLaMA-3, Mistral
* **Vector Database:** FAISS (for RAG experiments)
* **Frontend:** React.js + Tailwind CSS + Vite
* **Tools:** Postman, Git, VS Code

---

## 🐛 Debugging

### Check Services

```bash
# Backend health
curl http://localhost:8000/health

# Frontend
curl http://localhost:5173

# Ollama
curl http://localhost:11434/api/tags
```

### View Logs

```bash
# Backend logs
ls -lh backend/logs/

# Latest log
tail -f backend/logs/backend_*.log
```

### Common Issues

**"Permission denied" when running `./start-all.sh`** *(Linux/macOS)*
```bash
chmod +x start-all.sh
```

**"Ollama not found"**
```bash
# Linux/macOS
curl https://ollama.ai/install.sh | sh

# Windows: download installer from https://ollama.ai
```

**"Script cannot be loaded"** *(Windows PowerShell only — use start-all.bat to avoid this)*
```powershell
# Run PowerShell as Administrator, then:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**"Backend won't start"**
```bash
cd backend
cat logs/backend_*.log  # Check the logs
```

**"No LLM response"**
- Check backend logs
- Verify Ollama is running: `ollama list`
- Test Ollama: `ollama run llama3-gpu "test"`

---

## 🎮 Usage

### Test Attack Lab
1. Open http://localhost:5173
2. Click "Attack Lab" tab
3. Select an attack from sidebar
4. Click "Execute Attack Vector"
5. Watch console for real LLM response

### Use Direct Neural Link
1. Click "Direct Neural Link" tab
2. Type your message
3. Get real responses from llama3-gpu
4. No filtering - direct access

### Toggle Security
- Green button = Defense ON (blocks threats)
- Red button = Defense OFF (allows everything)

---

## 🔒 Security Notes

- Backend detects jailbreak, injection, extraction attempts
- When Defense ON: threats are blocked
- When Defense OFF: everything goes through (for testing)
- All activity is logged

**This is for security research and education only.**

---

## 💾 Requirements

- **Node.js** 18+ 
- **Python** 3.8+
- **Ollama** (auto-downloaded if missing)
- **LLaMA 3** model (auto-pulled if missing)

Total disk space: ~5GB for model + dependencies

---

## ✅ Verification Checklist

After running the launcher:

- [ ] Ollama detected your llama3-gpu model
- [ ] Backend started successfully
- [ ] Frontend loaded at http://localhost:5173
- [ ] Header shows "MAINFRAME LINK: OK" (green)
- [ ] Direct Neural Link tab works
- [ ] Attack Lab gets real responses
- [ ] Console shows live logs

---

## 🆕 What's New in v2.0

✨ **Auto-Detection** - Finds best Ollama model automatically  
🚀 **One Command** - Launcher does everything  
📝 **Comprehensive Logging** - Every action logged to files  
⚡ **GPU Support** - Automatically uses llama3-gpu if available  
💬 **Direct Neural Link** - Live chat with your LLM  
🔧 **Zero Config** - No manual setup required  
🐛 **Better Debugging** - Detailed logs for troubleshooting  

---

## 📞 Support

**Logs are your friend:**
```bash
backend/logs/backend_*.log  # Backend activity
Browser Console (F12)        # Frontend errors
```

**Test connectivity:**
```bash
curl http://localhost:8000/health
```

---

## 🎉 That's It!

**Linux/macOS** — one-time setup, then just run:
```bash
chmod +x start-all.sh  # first time only
./start-all.sh
```

**Windows** — just double-click or run:
```cmd
start-all.bat
```

**Welcome to the Matrix.** 🛡️

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

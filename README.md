# 🛡️ NEURO-SENTRY DEFENSE SYSTEM

## Complete Full-Stack LLM Security Platform

**v2.0.0 - COMPLETE EDITION**

Everything included. No external dependencies. One command to run.

---

## ⚡ Quick Start (3 Steps)

### 1. Install Ollama

```bash
curl https://ollama.ai/install.sh | sh
```

### 2. Extract and Run

```bash
cd neuro-sentry-merged
./start-all.sh
```

### 3. Done!

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
├── start-all.sh           # Launch everything
└── README.md              # This file
```

---

## 🚀 How It Works

### The Launcher Does Everything:

1. ✅ Checks Node.js, Python, Ollama
2. ✅ Detects Ollama models (prefers llama3-gpu for GPU)
3. ✅ Downloads llama3 if missing
4. ✅ Installs frontend dependencies
5. ✅ Sets up Python venv
6. ✅ Installs backend dependencies
7. ✅ Starts Ollama
8. ✅ Starts FastAPI backend
9. ✅ Starts Vite frontend
10. ✅ Opens your browser

**You just run: `./start-all.sh`**

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

## 📊 Features

### Command Center
- System metrics dashboard
- Defense integrity monitoring
- Threat vector analysis
- Real-time statistics

### Attack Lab
- Test prompt injections
- Jailbreak simulations
- Security toggle (ON/OFF)
- Live threat detection
- **Real LLM responses via backend**

### Direct Neural Link
- **NEW**: Direct chat with your LLM
- Uses llama3-gpu for fast responses
- No filtering (raw access)
- Real-time streaming
- Connection status indicator

### Console
- Live system logs
- Color-coded messages
- Auto-scroll
- Terminal aesthetic

---

## 🔧 Configuration

Everything is auto-configured. No manual setup needed.

**Optional:** Edit `.env` to change API URL:
```env
VITE_API_URL=http://localhost:8000
```

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

**"Ollama not found"**
```bash
curl https://ollama.ai/install.sh | sh
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

## 📡 API Endpoints

The backend exposes:

- `GET /` - Service info
- `GET /health` - Health + model info
- `POST /chat` - Direct LLM chat (Direct Neural Link)
- `POST /api/prompt` - Security analysis (Attack Lab)
- `GET /api/stats` - Statistics
- `GET /api/logs` - Recent logs

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

After running `./start-all.sh`:

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
🚀 **One Command** - `./start-all.sh` does everything  
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

One command. Full stack. Real LLM responses.

```bash
./start-all.sh
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

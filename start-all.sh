#!/bin/bash

# Neuro-Sentry Defense System - Complete Launcher
# Auto-detects everything, handles setup, and launches all services

set -e  # Exit on error

# =====================================================
# ⚡ INFERENCE MODE — change this to switch backends
# =====================================================
#   "groq"   — uses Groq API (requires GROQ_API_KEY in .env)
#   "ollama" — uses local Ollama (requires ollama installed + model pulled)
INFERENCE_MODE="groq"
# =====================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$SCRIPT_DIR/backend"

# PID storage
OLLAMA_PID=""
BACKEND_PID=""

# Safe defaults
SELECTED_MODEL=""
MASKED=""

# Network detection
detect_network_ip() {
    if command -v ip &> /dev/null; then
        ip route get 1.1.1.1 2>/dev/null | grep -oP 'src \K[^ ]+' || echo ""
    elif command -v ifconfig &> /dev/null; then
        ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n1 || echo ""
    else
        echo ""
    fi
}

NETWORK_IP=$(detect_network_ip)

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   ███╗   ██╗███████╗██╗   ██╗██████╗  ██████╗              ║${NC}"
echo -e "${CYAN}║   ████╗  ██║██╔════╝██║   ██║██╔══██╗██╔════╝              ║${NC}"
echo -e "${CYAN}║   ██╔██╗ ██║█████╗  ██║   ██║██████╔╝██║                   ║${NC}"
echo -e "${CYAN}║   ██║╚██╗██║██╔══╝  ██║   ██║██╔══██╗██║                   ║${NC}"
echo -e "${CYAN}║   ██║ ╚████║███████╗╚██████╔╝██║  ██║╚██████╗              ║${NC}"
echo -e "${CYAN}║   ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝              ║${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}║        N E U R O  •  S E N T R Y                           ║${NC}"
echo -e "${CYAN}║   LLM Threat Detection | Runtime Integrity | Zero Trust    ║${NC}"
echo -e "${CYAN}║              v3.0.0  —  NETWORK MODE ONLINE                ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# =====================================================
# LOAD .ENV
# =====================================================

if [ -f "$SCRIPT_DIR/.env" ]; then
    set -a
    source "$SCRIPT_DIR/.env"
    set +a
    echo -e "${GREEN}✓${NC} Loaded .env"
else
    echo -e "${YELLOW}⚠️  No .env found — using shell environment${NC}"
fi

# =====================================================
# CHECK REQUIREMENTS
# =====================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}[ PRE-FLIGHT ]  Verifying System Integrity & Dependencies${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    echo -e "${YELLOW}   Install from: https://nodejs.org/${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Node.js: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} npm: $(npm --version)"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 not found${NC}"
    echo -e "${YELLOW}   Install Python 3.8+${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Python: $(python3 --version)"

# ── Mode-specific checks ──────────────────────────────────────────────────────

if [ "$INFERENCE_MODE" = "groq" ]; then
    echo ""
    echo -e "${CYAN}⚡ Inference mode: ${MAGENTA}GROQ${NC}"
    if [ -z "$GROQ_API_KEY" ]; then
        echo -e "${RED}❌ GROQ_API_KEY is not set${NC}"
        echo -e "${YELLOW}   Add it to your .env: GROQ_API_KEY=gsk_...${NC}"
        exit 1
    fi
    MASKED="${GROQ_API_KEY:0:8}...${GROQ_API_KEY: -4}"
    echo -e "${GREEN}✓${NC} GROQ_API_KEY: ${CYAN}${MASKED}${NC}"

elif [ "$INFERENCE_MODE" = "ollama" ]; then
    echo ""
    echo -e "${CYAN}🤖 Inference mode: ${MAGENTA}OLLAMA${NC}"
    if ! command -v ollama &> /dev/null; then
        echo -e "${RED}❌ Ollama not found${NC}"
        echo -e "${YELLOW}   Install from: https://ollama.ai${NC}"
        echo -e "${YELLOW}   Quick install: curl https://ollama.ai/install.sh | sh${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓${NC} Ollama: found"

    echo ""
    echo -e "${CYAN}🤖 Detecting Ollama models...${NC}"
    OLLAMA_MODELS=$(ollama list 2>/dev/null || echo "")

    if echo "$OLLAMA_MODELS" | grep -q "llama3-gpu"; then
        SELECTED_MODEL="llama3-gpu"
        echo -e "${GREEN}✓${NC} Found: ${MAGENTA}llama3-gpu${NC} ${GREEN}(GPU accelerated)${NC} ⚡"
    elif echo "$OLLAMA_MODELS" | grep -q "llama3"; then
        SELECTED_MODEL="llama3"
        echo -e "${GREEN}✓${NC} Found: ${MAGENTA}llama3${NC}"
    else
        echo -e "${YELLOW}⚠️  llama3 not found${NC}"
        echo ""
        echo -e "${CYAN}Available models:${NC}"
        echo "$OLLAMA_MODELS"
        echo ""
        echo -e "${YELLOW}Downloading llama3 model (this may take a few minutes)...${NC}"
        ollama pull llama3
        SELECTED_MODEL="llama3"
        echo -e "${GREEN}✓${NC} Downloaded: llama3"
    fi
    echo -e "${CYAN}   Selected model:${NC} ${MAGENTA}${SELECTED_MODEL}${NC}"

    # Ensure backend falls back to Ollama by clearing the Groq key
    unset GROQ_API_KEY

else
    echo -e "${RED}❌ Unknown INFERENCE_MODE: '$INFERENCE_MODE' — use 'groq' or 'ollama'${NC}"
    exit 1
fi

echo ""

# =====================================================
# FRONTEND SETUP
# =====================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}[ FRONTEND ]  Initializing Interface Layer${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cd "$SCRIPT_DIR"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install --silent
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${GREEN}✓${NC} Frontend dependencies already installed"
fi

if ! grep -q '"qrcode"' package.json 2>/dev/null; then
    echo -e "${YELLOW}📦 Installing qrcode package for network access...${NC}"
    npm install qrcode --save
    echo -e "${GREEN}✓${NC} QR code package installed"
fi

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚙️  Creating .env configuration...${NC}"
    cat > .env << EOF
# API Configuration - set to 'auto' for smart network detection
VITE_API_URL=auto
VITE_APP_NAME="Neuro-Sentry Defense"
VITE_APP_VERSION=3.0.0
EOF
    echo -e "${GREEN}✓${NC} Configuration created"
else
    echo -e "${GREEN}✓${NC} Configuration exists"
fi

echo ""

# =====================================================
# BACKEND SETUP
# =====================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}[ BACKEND ]  Initializing Core Services${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -d "$BACKEND_DIR" ]; then
    cd "$BACKEND_DIR"

    if [ ! -d "venv" ]; then
        echo -e "${YELLOW}📦 Creating Python virtual environment...${NC}"
        python3 -m venv venv
        echo -e "${GREEN}✓${NC} Virtual environment created"
    else
        echo -e "${GREEN}✓${NC} Virtual environment exists"
    fi

    source venv/bin/activate

    if [ -f "requirements.txt" ]; then
        echo -e "${YELLOW}📦 Installing backend dependencies (this may take a minute)...${NC}"
        pip install --upgrade pip > /dev/null 2>&1
        PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1 pip install -r requirements.txt
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓${NC} Backend dependencies installed"
        else
            echo -e "${RED}❌ Failed to install backend dependencies${NC}"
            echo -e "${YELLOW}   Try manually: cd backend && source venv/bin/activate && pip install -r requirements.txt${NC}"
            exit 1
        fi
    fi

    mkdir -p logs
    echo -e "${GREEN}✓${NC} Logs directory ready"

    cd "$SCRIPT_DIR"
else
    echo -e "${RED}❌ Backend directory not found at: $BACKEND_DIR${NC}"
    exit 1
fi

echo ""

# =====================================================
# LAUNCH SERVICES
# =====================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}[ EXECUTION ]  Bringing Services Online${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Start Ollama only if in ollama mode
if [ "$INFERENCE_MODE" = "ollama" ]; then
    if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo -e "${YELLOW}🤖 Starting Ollama service...${NC}"
        ollama serve > /dev/null 2>&1 &
        OLLAMA_PID=$!
        sleep 2
        echo -e "${GREEN}✓${NC} Ollama running (PID: $OLLAMA_PID)"
    else
        echo -e "${GREEN}✓${NC} Ollama already running"
    fi
fi

# Start Backend — pass inference config explicitly as env vars
echo -e "${YELLOW}⚡ Starting FastAPI backend...${NC}"
cd "$BACKEND_DIR"
source venv/bin/activate
INFERENCE_MODE="$INFERENCE_MODE" OLLAMA_MODEL="$SELECTED_MODEL" \
    uvicorn app.main:app --host 0.0.0.0 --port 8000 > /dev/null 2>&1 &
BACKEND_PID=$!
cd "$SCRIPT_DIR"

sleep 3

if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Backend running (PID: $BACKEND_PID)"
    echo -e "${CYAN}   API:${NC} http://localhost:8000"
    echo -e "${CYAN}   Logs:${NC} backend/logs/"
else
    echo -e "${RED}❌ Backend failed to start — check backend/logs/${NC}"
fi

echo ""

# =====================================================
# NETWORK ACCESS
# =====================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}[ ACCESS ]  Network & Connectivity${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${GREEN}✓ Local Access (This Computer):${NC}"
echo -e "  ${WHITE}Frontend:${NC} ${CYAN}http://localhost:5173${NC}"
echo -e "  ${WHITE}Backend:${NC}  ${CYAN}http://localhost:8000${NC}"
echo ""

if [ -n "$NETWORK_IP" ]; then
    echo -e "${GREEN}✓ Network Access (Other Devices):${NC}"
    echo -e "  ${WHITE}Frontend:${NC} ${MAGENTA}http://${NETWORK_IP}:5173${NC}"
    echo -e "  ${WHITE}Backend:${NC}  ${MAGENTA}http://${NETWORK_IP}:8000${NC}"
    echo ""
    echo -e "${YELLOW}📱 Mobile Access:${NC}"
    echo -e "  1. Connect phone to the ${WHITE}same WiFi network${NC}"
    echo -e "  2. Go to: ${MAGENTA}http://${NETWORK_IP}:5173${NC}"
    echo -e "  3. Or click the ${CYAN}Network button${NC} in the app to scan QR code"
else
    echo -e "${YELLOW}⚠️  Network IP could not be detected${NC}"
    echo -e "  The app will still work locally at ${CYAN}http://localhost:5173${NC}"
fi

echo ""

# =====================================================
# STATUS
# =====================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}[ STATUS ]  Live Service Telemetry${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ "$INFERENCE_MODE" = "ollama" ]; then
    echo -e "${GREEN}✓ Ollama:${NC}"
    echo -e "  ${CYAN}Model:${NC} ${MAGENTA}${SELECTED_MODEL}${NC}"
    echo -e "  ${CYAN}Port:${NC} 11434"
    echo ""
else
    echo -e "${GREEN}✓ Groq API:${NC}"
    echo -e "  ${CYAN}Model:${NC} ${MAGENTA}llama-3.3-70b-versatile${NC}"
    echo -e "  ${CYAN}Key:${NC} ${MASKED}"
    echo ""
fi

echo -e "${GREEN}✓ Backend:${NC}"
echo -e "  ${CYAN}API:${NC} http://localhost:8000"
[ -n "$NETWORK_IP" ] && echo -e "  ${CYAN}Network:${NC} http://${NETWORK_IP}:8000"
echo -e "  ${CYAN}Logs:${NC} backend/logs/"
echo ""
echo -e "${GREEN}✓ Frontend:${NC}"
echo -e "  ${CYAN}Local:${NC} http://localhost:5173"
[ -n "$NETWORK_IP" ] && echo -e "  ${CYAN}Network:${NC} http://${NETWORK_IP}:5173"
echo -e "  ${CYAN}Status:${NC} Starting..."
echo ""

# =====================================================
# CLEANUP
# =====================================================

cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down services...${NC}"

    if [ -n "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        echo -e "${GREEN}✓${NC} Backend stopped"
    fi

    if [ -n "$OLLAMA_PID" ]; then
        kill $OLLAMA_PID 2>/dev/null || true
        echo -e "${GREEN}✓${NC} Ollama stopped"
    fi

    echo ""
    echo -e "${CYAN}█████████████████████████████████████████████${NC}"
    echo -e "${CYAN}   NEURO-SENTRY DEFENSE SYSTEM — OFFLINE     ${NC}"
    echo -e "${CYAN}   ALL ACTIVE MONITORS DISENGAGED            ${NC}"
    echo -e "${CYAN}█████████████████████████████████████████████${NC}"
    echo ""
    exit 0
}

trap cleanup INT TERM

echo -e "${YELLOW}⏳ Starting frontend...${NC}"
echo -e "${CYAN}   Press Ctrl+C to stop all services${NC}"
echo ""

cd "$SCRIPT_DIR"
npm run dev

cleanup
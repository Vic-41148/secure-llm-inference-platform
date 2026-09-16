# Neuro-Sentry Defense System - Complete Launcher (Windows)
# Auto-detects everything, handles setup, and launches all services

$ErrorActionPreference = "Stop"

# Colors (ANSI)
$RED     = "`e[0;31m"
$GREEN   = "`e[0;32m"
$YELLOW  = "`e[1;33m"
$BLUE    = "`e[0;34m"
$CYAN    = "`e[0;36m"
$MAGENTA = "`e[0;35m"
$WHITE   = "`e[1;37m"
$NC      = "`e[0m"

# Get script directory
$SCRIPT_DIR  = $PSScriptRoot
$BACKEND_DIR = Join-Path $SCRIPT_DIR "backend"

# PID storage
$OLLAMA_PID  = $null
$BACKEND_PID = $null

# Network detection
function Get-NetworkIP {
    try {
        $ip = (Get-NetIPAddress -AddressFamily IPv4 |
               Where-Object { $_.IPAddress -notmatch '^127\.' -and $_.PrefixOrigin -ne 'WellKnown' } |
               Select-Object -First 1).IPAddress
        return $ip
    } catch {
        return ""
    }
}

$NETWORK_IP = Get-NetworkIP

Write-Host ""
Write-Host "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
Write-Host "${CYAN}║   ███╗   ██╗███████╗██╗   ██╗██████╗  ██████╗              ║${NC}"
Write-Host "${CYAN}║   ████╗  ██║██╔════╝██║   ██║██╔══██╗██╔════╝              ║${NC}"
Write-Host "${CYAN}║   ██╔██╗ ██║█████╗  ██║   ██║██████╔╝██║                   ║${NC}"
Write-Host "${CYAN}║   ██║╚██╗██║██╔══╝  ██║   ██║██╔══██╗██║                   ║${NC}"
Write-Host "${CYAN}║   ██║ ╚████║███████╗╚██████╔╝██║  ██║╚██████╗              ║${NC}"
Write-Host "${CYAN}║   ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝              ║${NC}"
Write-Host "${CYAN}║                                                            ║${NC}"
Write-Host "${CYAN}║        N E U R O  •  S E N T R Y                           ║${NC}"
Write-Host "${CYAN}║   LLM Threat Detection | Runtime Integrity | Zero Trust    ║${NC}"
Write-Host "${CYAN}║              v2.0.0  —  NETWORK MODE ONLINE                ║${NC}"
Write-Host "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
Write-Host ""


# =====================================================
# CHECK REQUIREMENTS
# =====================================================

Write-Host "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
Write-Host "${CYAN}[ PRE-FLIGHT ]  Verifying System Integrity & Dependencies${NC}"
Write-Host "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
Write-Host ""

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "${RED}❌ Node.js not found${NC}"
    Write-Host "${YELLOW}   Install from: https://nodejs.org/${NC}"
    exit 1
}
Write-Host "${GREEN}✓${NC} Node.js: $(node --version)"

# Check npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "${RED}❌ npm not found${NC}"
    exit 1
}
Write-Host "${GREEN}✓${NC} npm: $(npm --version)"

# Check Python
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "${RED}❌ Python 3 not found${NC}"
    Write-Host "${YELLOW}   Install Python 3.8+ from https://python.org/${NC}"
    exit 1
}
Write-Host "${GREEN}✓${NC} Python: $(python --version)"

# Check Ollama
$HAS_OLLAMA = $false
if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
    Write-Host "${YELLOW}⚠️  Ollama not found. Local LLM features will be offline (backend/frontend will still run).${NC}"
    Write-Host "${YELLOW}   Install from: https://ollama.ai to enable local model security testing.${NC}"
    $SELECTED_MODEL = "none"
} else {
    Write-Host "${GREEN}✓${NC} Ollama: found"
    $HAS_OLLAMA = $true

    # Detect Ollama models
    Write-Host ""
    Write-Host "${CYAN}🤖 Detecting Ollama models...${NC}"
    $OLLAMA_MODELS = ollama list 2>$null

    if ($OLLAMA_MODELS -match "llama3-gpu") {
        $SELECTED_MODEL = "llama3-gpu"
        Write-Host "${GREEN}✓${NC} Found: ${MAGENTA}llama3-gpu${NC} ${GREEN}(GPU accelerated)${NC} ⚡"
    } elseif ($OLLAMA_MODELS -match "llama3") {
        $SELECTED_MODEL = "llama3"
        Write-Host "${GREEN}✓${NC} Found: ${MAGENTA}llama3${NC}"
    } else {
        Write-Host "${YELLOW}⚠️  llama3 not found${NC}"
        Write-Host ""
        Write-Host "${CYAN}Available models:${NC}"
        Write-Host $OLLAMA_MODELS
        Write-Host ""
        Write-Host "${YELLOW}Downloading llama3 model (this may take a few minutes)...${NC}"
        ollama pull llama3
        $SELECTED_MODEL = "llama3"
        Write-Host "${GREEN}✓${NC} Downloaded: llama3"
    }

    Write-Host "${CYAN}   Selected model:${NC} ${MAGENTA}${SELECTED_MODEL}${NC}"
    Write-Host ""
}


# =====================================================
# FRONTEND SETUP
# =====================================================

Write-Host "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
Write-Host "${CYAN}[ FRONTEND ]  Initializing Interface Layer${NC}"
Write-Host "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
Write-Host ""

Set-Location $SCRIPT_DIR

# Install frontend dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install --silent
    Write-Host "${GREEN}✓${NC} Frontend dependencies installed"
} else {
    Write-Host "${GREEN}✓${NC} Frontend dependencies already installed"
}

# Check if qrcode is installed
$pkgJson = Get-Content "package.json" -Raw -ErrorAction SilentlyContinue
if ($pkgJson -notmatch '"qrcode"') {
    Write-Host "${YELLOW}📦 Installing qrcode package for network access...${NC}"
    npm install qrcode --save
    Write-Host "${GREEN}✓${NC} QR code package installed"
}

# Create .env if needed
if (-not (Test-Path ".env")) {
    Write-Host "${YELLOW}⚙️  Creating .env configuration...${NC}"
    @"
# API Configuration - set to 'auto' for smart network detection
VITE_API_URL=auto
VITE_APP_NAME=Neuro-Sentry Defense
VITE_APP_VERSION=2.0.0
"@ | Set-Content ".env"
    Write-Host "${GREEN}✓${NC} Configuration created"
} else {
    Write-Host "${GREEN}✓${NC} Configuration exists"
}

Write-Host ""


# =====================================================
# BACKEND SETUP
# =====================================================

Write-Host "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
Write-Host "${CYAN}[ BACKEND ]  Initializing Core Services${NC}"
Write-Host "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
Write-Host ""

if (Test-Path $BACKEND_DIR) {
    Set-Location $BACKEND_DIR

    # Create venv if needed
    if (-not (Test-Path "venv")) {
        Write-Host "${YELLOW}📦 Creating Python virtual environment...${NC}"
        python -m venv venv
        Write-Host "${GREEN}✓${NC} Virtual environment created"
    } else {
        Write-Host "${GREEN}✓${NC} Virtual environment exists"
    }

    # Install backend dependencies
    if (Test-Path "requirements.txt") {
        Write-Host "${YELLOW}📦 Installing backend dependencies (this may take a minute)...${NC}"
        & ".\venv\Scripts\pip.exe" install --upgrade pip 2>&1 | Out-Null
        & ".\venv\Scripts\pip.exe" install -r requirements.txt
        if ($LASTEXITCODE -eq 0) {
            Write-Host "${GREEN}✓${NC} Backend dependencies installed"
        } else {
            Write-Host "${RED}❌ Failed to install backend dependencies${NC}"
            Write-Host "${YELLOW}   Try manually: cd backend && .\venv\Scripts\activate && pip install -r requirements.txt${NC}"
            exit 1
        }
    }

    # Create logs directory
    New-Item -ItemType Directory -Force -Path "logs" | Out-Null
    Write-Host "${GREEN}✓${NC} Logs directory ready"

    Set-Location $SCRIPT_DIR
} else {
    Write-Host "${RED}❌ Backend directory not found at: $BACKEND_DIR${NC}"
    exit 1
}

Write-Host ""


# =====================================================
# LAUNCH SERVICES
# =====================================================

Write-Host "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
Write-Host "${CYAN}[ EXECUTION ]  Bringing Services Online${NC}"
Write-Host "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
Write-Host ""

# Start Ollama if not running
if ($HAS_OLLAMA) {
    try {
        $null = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -TimeoutSec 2
        Write-Host "${GREEN}✓${NC} Ollama already running"
    } catch {
        Write-Host "${YELLOW}🤖 Starting Ollama service...${NC}"
        $ollamaProc = Start-Process ollama -ArgumentList "serve" -PassThru -WindowStyle Hidden
        $OLLAMA_PID = $ollamaProc.Id
        Start-Sleep -Seconds 2
        Write-Host "${GREEN}✓${NC} Ollama running (PID: $OLLAMA_PID)"
    }
} else {
    Write-Host "${YELLOW}⚠️  Skipping Ollama launch (not installed)${NC}"
}

# Start Backend
Write-Host "${YELLOW}⚡ Starting FastAPI backend...${NC}"
$uvicornPath = Join-Path $BACKEND_DIR "venv\Scripts\uvicorn.exe"
$backendProc = Start-Process $uvicornPath `
    -ArgumentList "app.main:app --host 0.0.0.0 --port 8000" `
    -WorkingDirectory $BACKEND_DIR `
    -PassThru -WindowStyle Hidden
$BACKEND_PID = $backendProc.Id

Start-Sleep -Seconds 5

# Check if backend started
try {
    $null = Invoke-RestMethod -Uri "http://localhost:8000/health" -TimeoutSec 2
    Write-Host "${GREEN}✓${NC} Backend running (PID: $BACKEND_PID)"
    Write-Host "${CYAN}   API:${NC} http://localhost:8000"
    Write-Host "${CYAN}   Logs:${NC} backend/logs/"
} catch {
    Write-Host "${RED}❌ Backend failed to start${NC}"
    Write-Host "${YELLOW}   Check logs in: backend/logs/${NC}"
}

Write-Host ""


# =====================================================
# NETWORK ACCESS
# =====================================================

Write-Host "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
Write-Host "${CYAN}[ ACCESS ]  Network & Connectivity${NC}"
Write-Host "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
Write-Host ""

Write-Host "${GREEN}✓ Local Access (This Computer):${NC}"
Write-Host "  ${WHITE}Frontend:${NC} ${CYAN}http://localhost:5173${NC}"
Write-Host "  ${WHITE}Backend:${NC}  ${CYAN}http://localhost:8000${NC}"
Write-Host ""

if ($NETWORK_IP) {
    Write-Host "${GREEN}✓ Network Access (Other Devices):${NC}"
    Write-Host "  ${WHITE}Frontend:${NC} ${MAGENTA}http://${NETWORK_IP}:5173${NC}"
    Write-Host "  ${WHITE}Backend:${NC}  ${MAGENTA}http://${NETWORK_IP}:8000${NC}"
    Write-Host ""
    Write-Host "${YELLOW}📱 Mobile Access:${NC}"
    Write-Host "  1. Connect phone to the ${WHITE}same WiFi network${NC}"
    Write-Host "  2. Go to: ${MAGENTA}http://${NETWORK_IP}:5173${NC}"
    Write-Host "  3. Or click the ${CYAN}Network button${NC} in the app to scan QR code"
} else {
    Write-Host "${YELLOW}⚠️  Network IP could not be detected${NC}"
    Write-Host "  The app will still work locally at ${CYAN}http://localhost:5173${NC}"
}

Write-Host ""


# =====================================================
# STATUS
# =====================================================

Write-Host "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
Write-Host "${CYAN}[ STATUS ]  Live Service Telemetry${NC}"
Write-Host "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
Write-Host ""
if ($HAS_OLLAMA) {
    Write-Host "${GREEN}✓ Ollama:${NC}"
    Write-Host "  ${CYAN}Model:${NC} ${MAGENTA}${SELECTED_MODEL}${NC}"
    Write-Host "  ${CYAN}Port:${NC} 11434"
    Write-Host ""
} else {
    Write-Host "${YELLOW}⚠️  Ollama: Offline (not installed)${NC}"
    Write-Host ""
}
Write-Host "${GREEN}✓ Backend:${NC}"
Write-Host "  ${CYAN}API:${NC} http://localhost:8000"
if ($NETWORK_IP) { Write-Host "  ${CYAN}Network:${NC} http://${NETWORK_IP}:8000" }
Write-Host "  ${CYAN}Logs:${NC} backend/logs/"
Write-Host ""
Write-Host "${GREEN}✓ Frontend:${NC}"
Write-Host "  ${CYAN}Local:${NC} http://localhost:5173"
if ($NETWORK_IP) { Write-Host "  ${CYAN}Network:${NC} http://${NETWORK_IP}:5173" }
Write-Host "  ${CYAN}Status:${NC} Starting..."
Write-Host ""


# =====================================================
# CLEANUP FUNCTION
# =====================================================

function Invoke-Cleanup {
    Write-Host ""
    Write-Host "${YELLOW}🛑 Shutting down services...${NC}"

    if ($BACKEND_PID) {
        Stop-Process -Id $BACKEND_PID -Force -ErrorAction SilentlyContinue
        Write-Host "${GREEN}✓${NC} Backend stopped"
    }
    if ($OLLAMA_PID) {
        Stop-Process -Id $OLLAMA_PID -Force -ErrorAction SilentlyContinue
        Write-Host "${GREEN}✓${NC} Ollama stopped"
    }

    Write-Host ""
    Write-Host "${CYAN}█████████████████████████████████████████████${NC}"
    Write-Host "${CYAN}   NEURO-SENTRY DEFENSE SYSTEM — OFFLINE     ${NC}"
    Write-Host "${CYAN}   ALL ACTIVE MONITORS DISENGAGED            ${NC}"
    Write-Host "${CYAN}█████████████████████████████████████████████${NC}"
    Write-Host ""
}

# Register Ctrl+C handler
try {
    [Console]::TreatControlCAsInput = $false
} catch {
    # Ignored in non-interactive sessions
}
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action { Invoke-Cleanup }

# Start Frontend (this blocks)
Write-Host "${YELLOW}⏳ Starting frontend...${NC}"
Write-Host "${CYAN}   Press Ctrl+C to stop all services${NC}"
Write-Host ""

Set-Location $SCRIPT_DIR
try {
    npm run dev
} finally {
    Invoke-Cleanup
}

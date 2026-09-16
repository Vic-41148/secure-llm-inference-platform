"""
Neuro-Sentry Defense Backend — main.py (refactored)
Ties together all routers, middleware, and lifecycle hooks.

Commits assembled here:
  16: split into routers
  10/11: rotating + JSON logging
  18: settings from env
  20: startup warm-up
  21: shutdown stats dump
   2: rate limiting middleware
"""

from fastapi import FastAPI, HTTPException, Depends, Header as FastAPIHeader
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import json
import os
import time
import logging
import random
from datetime import datetime
from typing import Optional, List
from fastapi import File, UploadFile
from fastapi.responses import StreamingResponse
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

# Import new security modules
from app.dlp import dlp_engine
from app.rules_engine import rules_engine
from app.redteam import redteam_fuzzer
from app.rag_scanner import rag_scanner
# Setup logging
log_dir = os.path.join(os.path.dirname(__file__), "..", "logs")
os.makedirs(log_dir, exist_ok=True)

log_file = os.path.join(log_dir, f"backend_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log")
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

from app.config.settings import settings as app_settings
from app.services.logging_setup import setup_logging
from app.services.ollama_service import ollama_service
from app.services.stats_store import get_stats
from app.middleware.rate_limiter import RateLimitMiddleware

# Import all routers
from app.routes import chat, prompt, stats, health, test_attack, playground, analytics, audit_logs, projects, settings, quotas

# ── Initialise logging first ───────────────────────────────────────────
log_file = setup_logging()
logger = logging.getLogger(__name__)

# Google OAuth Client ID (must match frontend)
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "YOUR_GOOGLE_CLIENT_ID")

# Token verification dependency
async def verify_google_token(authorization: Optional[str] = FastAPIHeader(None)):
    """Verify Google ID token from Authorization header"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    
    token = authorization.split(" ", 1)[1]
    try:
        idinfo = id_token.verify_oauth2_token(
            token, google_requests.Request(), GOOGLE_CLIENT_ID
        )
        logger.info(f"🔐 Authenticated user: {idinfo.get('email', 'unknown')}")
        return idinfo
    except ValueError as e:
        logger.warning(f"⚠️  Token verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")

app = FastAPI(
    title="Neuro-Sentry Defense API",
    description="Backend API for LLM security testing with multi-layer defense pipeline",
    version="3.0.0",
)

# ── Middleware ─────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=app_settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RateLimitMiddleware)

# ── Register routers ───────────────────────────────────────────────────
app.include_router(health.router)
app.include_router(chat.router)
app.include_router(prompt.router)
app.include_router(stats.router)
app.include_router(test_attack.router)
app.include_router(playground.router)
app.include_router(analytics.router)
app.include_router(audit_logs.router)
app.include_router(projects.router)
app.include_router(settings.router)
app.include_router(quotas.router)


class PromptRequest(BaseModel):
    prompt: str
    security_enabled: bool = True

class RuleRequest(BaseModel):
    name: str
    type: str
    pattern: str
    action: str = "block"

# Helper function to call Ollama
def call_ollama(prompt: str, timeout: int = 30) -> str:
    """Call Ollama CLI to get LLM response"""
    try:
        logger.info(f"📤 Sending to {OLLAMA_MODEL}: {prompt[:100]}...")
        
        result = subprocess.run(
            ["ollama", "run", OLLAMA_MODEL, prompt],
            capture_output=True,
            text=True,
            timeout=timeout
        )
        
        if result.returncode != 0:
            logger.error(f"❌ Ollama error: {result.stderr}")
            raise Exception(f"Ollama error: {result.stderr}")
        
        response = result.stdout.strip()
        logger.info(f"📥 Received response ({len(response)} chars)")
        return response
        
    except subprocess.TimeoutExpired:
        logger.error(f"⏱️  Ollama request timed out after {timeout}s")
        raise Exception("Ollama request timed out")
    except FileNotFoundError:
        logger.error("❌ Ollama not found. Please install Ollama.")
        raise Exception("Ollama not found. Install from: https://ollama.ai")
    except Exception as e:
        logger.error(f"❌ Ollama error: {str(e)}")
        raise Exception(f"Ollama error: {str(e)}")

# Security check function
def check_for_threats(prompt: str) -> dict:
    """
    Enhanced security check using Dynamic Rules Engine
    """
    return rules_engine.evaluate(prompt)

@app.on_event("startup")
async def startup_event():
    logger.info("=" * 60)
    logger.info("🛡️  NEURO-SENTRY DEFENSE BACKEND v3.0 STARTING")
    logger.info("=" * 60)
    logger.info(f"🤖 Ollama Model : {ollama_service.model}")
    logger.info(f"📝 Log file     : {log_file}")
    logger.info(f"🌐 CORS origins : {app_settings.CORS_ORIGINS}")
    logger.info(f"🔒 Rate limit   : {app_settings.RATE_LIMIT_PER_MINUTE} req/min")
    logger.info("=" * 60)
    # Commit 20: warm up the model
    ollama_service.warm_up()


@app.get("/health")
async def health():
    """Health check endpoint"""
    # Check if Ollama is available
    try:
        subprocess.run(
            ["ollama", "list"],
            capture_output=True,
            timeout=5
        )
        ollama_status = "online"
    except:
        ollama_status = "offline"
    
    return {
        "status": "online",
        "ollama": ollama_status,
        "model": OLLAMA_MODEL,
        "timestamp": time.time()
    }

@app.on_event("shutdown")
async def shutdown_event():
    """
    On shutdown dump final statistics to a JSON file in logs/.
    """
    if app_settings.STATS_DUMP_ON_SHUTDOWN:
        final_stats = get_stats()
        final_stats["shutdown_at"] = time.time()
        log_dir = os.path.join(os.path.dirname(__file__), "..", "logs")
        os.makedirs(log_dir, exist_ok=True)
        stats_file = os.path.join(log_dir, "shutdown_stats.json")
        try:
            with open(stats_file, "w") as f:
                json.dump(final_stats, f, indent=2)
            logger.info(f"📊 Shutdown stats dumped to {stats_file}")
        except Exception as e:
            logger.error(f"❌ Failed to dump shutdown stats: {e}")

@app.post("/api/prompt")
async def analyze_prompt(request: PromptRequest, user_info: dict = Depends(verify_google_token)):
    """
    Analyze prompt with full security pipeline (Rules + LLM + DLP)
    """
    global stats
    
    stats["total_attempts"] += 1
    logger.info(f"🧪 Attack Lab request #{stats['total_attempts']}")
    logger.info(f"   Security: {'ON' if request.security_enabled else 'OFF'}")
    
    # Check for threats (Dynamic Rules Stage 1)
    threat_check = check_for_threats(request.prompt)
    
    breach_detected = False
    response_text = ""
    dlp_leaks = []
    
    if request.security_enabled:
        if threat_check["is_threat"]:
            stats["total_blocked"] += 1
            breach_detected = False
            response_text = (
                "I appreciate your interest, but I cannot fulfill this request. "
                "It appears to attempt circumventing my safety guidelines. "
                "I'm designed to be helpful, harmless, and honest."
            )
            logger.info(f"🛡️  BLOCKED by Rule: {threat_check['matched_rule_name']}")
        else:
            stats["total_blocked"] += 1 # Actually means successfully processed in this logic context initially
            try:
                raw_response = call_ollama(request.prompt)
                # Output DLP Scan (Stage 4)
                redacted_text, leaked_items, leak_detected = dlp_engine.scan_and_redact(raw_response)
                
                response_text = redacted_text
                dlp_leaks = leaked_items
                breach_detected = False
                logger.info(f"✅ SAFE - Benign request processed")
            except Exception as e:
                response_text = f"Error processing request: {str(e)}"
                logger.error(f"❌ Error: {str(e)}")
    else:
        # Security OFF
        if threat_check["is_threat"]:
            stats["total_leaked"] += 1
            breach_detected = True
            try:
                response_text = call_ollama(request.prompt)
                logger.warning(f"⚠️  BREACH - Security OFF, rule matched: {threat_check['matched_rule_name']}")
            except Exception as e:
                response_text = "⚠️ SECURITY BREACH DETECTED ⚠️\nSystem safeguards offline."
                logger.error(f"❌ Error: {str(e)}")
        else:
            stats["total_blocked"] += 1 # processed ok
            try:
                response_text = call_ollama(request.prompt)
                breach_detected = False
            except Exception as e:
                response_text = f"Error: {str(e)}"
    
    if stats["total_attempts"] > 0:
        stats["block_rate"] = (stats["total_blocked"] / stats["total_attempts"]) * 100
        
    return {
        "response": response_text,
        "breach_detected": breach_detected,
        "threat_type": threat_check["matched_rule_name"] if threat_check["matched_rule_name"] else "none",
        "dlp_leaks": dlp_leaks,
        "security_enabled": request.security_enabled,
        "model": OLLAMA_MODEL,
        "stats": {
            "totalAttempts": stats["total_attempts"],
            "totalBlocked": stats["total_blocked"],
            "totalLeaked": stats["total_leaked"],
            "blockRate": round(stats["block_rate"], 1),
        }
    }

# ---------------------------------------------------------
# New Feature Endpoints
# ---------------------------------------------------------

@app.get("/api/rules")
async def get_rules():
    return {"rules": rules_engine.get_all()}

@app.post("/api/rules")
async def add_rule(rule: RuleRequest):
    new_rule = rules_engine.add_rule(rule.name, rule.type, rule.pattern, rule.action)
    return {"status": "success", "rule": new_rule}

@app.delete("/api/rules/{rule_id}")
async def delete_rule(rule_id: str):
    rules_engine.delete_rule(rule_id)
    return {"status": "success"}

@app.get("/api/redteam/stream")
async def stream_fuzzer(iterations: int = 10, delay: float = 2.0):
    async def event_generator():
        async for status in redteam_fuzzer.start_fuzzing(iterations, delay):
            # Send Server-Sent Events (SSE) format
            yield f"data: {json.dumps(status)}\n\n"
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.post("/api/redteam/stop")
async def stop_fuzzer():
    redteam_fuzzer.stop()
    return {"status": "stopped"}

@app.post("/api/rag/scan")
async def scan_document(file: UploadFile = File(...)):
    result = await rag_scanner.process_file(file, rules_engine.evaluate)
    return result

@app.get("/api/metrics/geodata")
async def get_geodata():
    """Mock geolocation data for the Threat Map"""
    # Returns some hardcoded coordinates roughly matching US/EU/Asia data centers
    points = [
        {"coordinates": [-122.4194, 37.7749], "threat": "jailbreak", "intensity": random.randint(1,5)},
        {"coordinates": [-74.0060, 40.7128], "threat": "injection", "intensity": random.randint(1,5)},
        {"coordinates": [-0.1276, 51.5074], "threat": "data_extraction", "intensity": random.randint(1,5)},
        {"coordinates": [37.6173, 55.7558], "threat": "encoding", "intensity": random.randint(5,10)},
        {"coordinates": [116.4074, 39.9042], "threat": "jailbreak", "intensity": random.randint(3,8)}
    ]
    # Add a few random ones
    import random as rand
    for _ in range(5):
        points.append({
            "coordinates": [rand.uniform(-180, 180), rand.uniform(-90, 90)],
            "threat": rand.choice(["jailbreak", "injection", "encoding", "roleplay"]),
            "intensity": rand.randint(1, 3)
        })
    return {"datapoints": points}

# ---------------------------------------------------------

@app.get("/api/stats")
async def get_stats():
    """Get current system statistics"""
    return {
        "totalAttempts": stats["total_attempts"],
        "totalBlocked": stats["total_blocked"],
        "totalLeaked": stats["total_leaked"],
        "blockRate": round(stats["block_rate"], 1),
        "uptime": "99.97%",
        "neuralLoad": 42,
        "memoryMatrix": 68,
        "synapticLatency": 3,
        "model": OLLAMA_MODEL,
    }


# ── Dev entry point ────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=app_settings.API_HOST,
        port=app_settings.API_PORT,
        reload=True,
    )

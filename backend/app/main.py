"""
Neuro-Sentry Defense Backend — main.py
Ties together all routers, middleware, and lifecycle hooks.
"""

import os
import time
import json
import random
import logging
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Depends, Header as FastAPIHeader, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

# ── Initialise logging first ───────────────────────────────────────────
from app.services.logging_setup import setup_logging
log_file = setup_logging()
logger = logging.getLogger(__name__)

from app.config.settings import settings as app_settings
from app.services.ollama_service import ollama_service
from app.services.stats_store import get_stats
from app.services.audit import audit_service
from app.middleware.rate_limiter import RateLimitMiddleware

# Security modules
from app.dlp import dlp_engine
from app.rules_engine import rules_engine
from app.redteam import redteam_fuzzer
from app.rag_scanner import rag_scanner

# Import all routers
from app.routes import (
    chat,
    prompt,
    stats,
    health,
    test_attack,
    playground,
    analytics,
    audit_logs,
    audit,
    threat_intel,
    intelligence,
    defense_management,
    projects,
    settings,
    quotas,
    diagnostics,
)

# Google OAuth Client ID (must match frontend)
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "YOUR_GOOGLE_CLIENT_ID")

async def verify_google_token(authorization: Optional[str] = FastAPIHeader(None)):
    """Verify Google ID token from Authorization header if present"""
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

# ── Register modular routers ───────────────────────────────────────────
app.include_router(health.router)
app.include_router(chat.router)
app.include_router(prompt.router)
app.include_router(stats.router)
app.include_router(test_attack.router)
app.include_router(playground.router)
app.include_router(analytics.router)
app.include_router(audit_logs.router)
app.include_router(audit.router)
app.include_router(threat_intel.router)
app.include_router(intelligence.router)
app.include_router(defense_management.router)
app.include_router(projects.router)
app.include_router(settings.router)
app.include_router(quotas.router)
app.include_router(diagnostics.router)


# ── Lifecycle events ───────────────────────────────────────────────────
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
    ollama_service.warm_up()


@app.on_event("shutdown")
async def shutdown_event():
    """On shutdown dump final statistics to a JSON file in logs/."""
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


# ── Dynamic Rules, RedTeam, RAG & Geodata Endpoints ────────────────────

class RuleRequest(BaseModel):
    name: str
    type: str
    pattern: str
    action: str = "block"


@app.get("/api/rules")
async def get_rules():
    return {"rules": rules_engine.get_all()}


@app.post("/api/rules")
async def add_rule(rule: RuleRequest):
    new_rule = rules_engine.add_rule(rule.name, rule.type, rule.pattern, rule.action)
    audit_service.log_action(
        action="DEPLOY_RULE",
        actor="rule-engine-admin",
        resource=f"Rule: {rule.name}",
        metadata={"rule_type": rule.type, "pattern": rule.pattern, "action": rule.action},
        status="SUCCESS"
    )
    return {"status": "success", "rule": new_rule}


@app.delete("/api/rules/{rule_id}")
async def delete_rule(rule_id: str):
    rules_engine.delete_rule(rule_id)
    audit_service.log_action(
        action="DELETE_RULE",
        actor="rule-engine-admin",
        resource=f"RuleID: {rule_id}",
        metadata={"rule_id": rule_id},
        status="SUCCESS"
    )
    return {"status": "success"}


@app.get("/api/redteam/stream")
async def stream_fuzzer(iterations: int = 10, delay: float = 2.0):
    async def event_generator():
        async for status in redteam_fuzzer.start_fuzzing(iterations, delay):
            yield f"data: {json.dumps(status)}\n\n"
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.post("/api/redteam/stop")
async def stop_fuzzer():
    redteam_fuzzer.stop()
    return {"status": "stopped"}


@app.post("/api/rag/scan")
async def scan_document(file: UploadFile = File(...)):
    result = await rag_scanner.process_file(file, rules_engine.evaluate)
    audit_service.log_action(
        action="INSPECT_DOCUMENT",
        actor="rag-scanner",
        resource=file.filename or "uploaded_file",
        metadata={"total_chunks": result.get("total_chunks", 0), "threats_found": len(result.get("flagged_chunks", []))},
        status="CLEARED" if not result.get("flagged_chunks") else "BLOCKED"
    )
    return result


@app.get("/api/metrics/geodata")
async def get_geodata():
    """Geolocation telemetry data for the Threat Map"""
    points = [
        {"coordinates": [-122.4194, 37.7749], "threat": "jailbreak", "intensity": random.randint(1, 5)},
        {"coordinates": [-74.0060, 40.7128], "threat": "injection", "intensity": random.randint(1, 5)},
        {"coordinates": [-0.1276, 51.5074], "threat": "data_extraction", "intensity": random.randint(1, 5)},
        {"coordinates": [37.6173, 55.7558], "threat": "encoding", "intensity": random.randint(5, 10)},
        {"coordinates": [116.4074, 39.9042], "threat": "jailbreak", "intensity": random.randint(3, 8)}
    ]
    for _ in range(5):
        points.append({
            "coordinates": [random.uniform(-180, 180), random.uniform(-90, 90)],
            "threat": random.choice(["jailbreak", "injection", "encoding", "roleplay"]),
            "intensity": random.randint(1, 3)
        })
    return {"datapoints": points}


# ── Dev entry point ────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=app_settings.API_HOST,
        port=app_settings.API_PORT,
        reload=True,
    )

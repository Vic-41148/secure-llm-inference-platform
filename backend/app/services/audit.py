import logging
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class AuditService:
    """
    Service to track immutable audit logs of system changes.
    """
    def __init__(self):
        self.logs = []
        self._seed_initial_logs()

    def _seed_initial_logs(self):
        self.log_action("SYSTEM_STARTED", "system", "app", {"version": "3.0.0"}, status="SUCCESS")
        self.log_action("RULE_DB_LOADED", "system", "rules_engine", {"rules_count": 5}, status="SUCCESS")
        self.log_action("DEPLOY_RULE", "admin@sovereign.local", "Rule: Block-API-Keys", {"rule_type": "regex", "pattern": "sk-[a-zA-Z0-9]+"}, status="SUCCESS")
        self.log_action("AUTH_WORKSPACE_KEY", "gateway-proxy", "Workspace: Production", {"key_id": "k-prod-primary", "role": "read_write"}, status="AUTHORIZED")
        self.log_action("INSPECT_DOCUMENT", "rag-scanner", "kb_financial_q3.pdf", {"chunks_scanned": 18, "threats": 0}, status="CLEARED")
        self.log_action("SANITIZE_PII", "dlp-pipeline", "/api/prompt", {"matched": ["SSN", "EMAIL"], "action": "REDACT"}, status="SANITIZED")
        self.log_action("INTERCEPT_PAYLOAD", "security-pipeline", "/api/prompt", {"threat": "SQL_INJECTION", "confidence": 0.99, "ip": "185.220.101.4"}, status="BLOCKED")

    def log_action(
        self,
        action: str,
        actor: str,
        resource: str,
        metadata: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None,
        status: str = "SUCCESS"
    ):
        entry = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow(),
            "action": action,
            "status": status,
            "actor": actor,
            "resource": resource,
            "metadata": metadata or {},
            "ip_address": ip_address
        }
        self.logs.insert(0, entry) # Prepend for newest-first
        logger.info(f"📜 Audit Log: [{status}] {action} by {actor} on {resource}")

    def get_logs(self, limit: int = 100, skip: int = 0) -> List[Dict[str, Any]]:
        return self.logs[skip:skip+limit]
    
    def get_total_count(self) -> int:
        return len(self.logs)

audit_service = AuditService()

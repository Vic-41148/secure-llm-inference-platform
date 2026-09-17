from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class AuditLogEntry(BaseModel):
    id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    action: str = Field(..., description="Action performed, e.g. RULE_CREATED, SYSTEM_RESTARTED")
    status: Optional[str] = Field(default="SUCCESS", description="Execution status: BLOCKED, SANITIZED, CLEARED, SUCCESS, AUTHORIZED, FAILED")
    actor: str = Field(..., description="User or service account that performed the action")
    resource: str = Field(..., description="Resource affected")
    metadata: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None

class AuditLogResponse(BaseModel):
    logs: List[AuditLogEntry]
    total_count: int

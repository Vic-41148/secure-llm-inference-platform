"""
Commits 10 & 11:
  10: rotating log file handler with max size limit
  11: structured JSON logging support
"""

import os
import json
import logging
import logging.handlers
from datetime import datetime, timezone
from app.config.settings import settings

# ──────────────────────────────────────────────
# Commit 11: JSON log formatter
# ──────────────────────────────────────────────

class JsonLogFormatter(logging.Formatter):
    """Format log records as single-line JSON objects for log aggregation tools."""

    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, object] = {
            "ts": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "msg": record.getMessage(),
        }
        # exc_info can be (type, exc, tb) or (None, None, None) — guard before formatting
        exc_info = record.exc_info
        if exc_info and exc_info[0] is not None:
            payload["exc"] = self.formatException(exc_info)  # type: ignore[arg-type]
        # request_id is a non-standard extra field — use getattr to avoid attr error
        request_id: object = getattr(record, "request_id", None)
        if request_id is not None:
            payload["request_id"] = request_id
        return json.dumps(payload, ensure_ascii=False)


# ──────────────────────────────────────────────
# Main setup function
# ──────────────────────────────────────────────

_log_file: str = ""


def setup_logging() -> str:
    """
    Configure application-wide logging.

    - Commit 10: Uses RotatingFileHandler capped at LOG_MAX_BYTES with LOG_BACKUP_COUNT backups.
    - Commit 11: Switches to JsonLogFormatter when LOG_JSON_FORMAT=true in .env.

    Returns the path of the active log file.
    """
    global _log_file

    log_dir = os.path.join(os.path.dirname(__file__), "..", "..", "logs")
    os.makedirs(log_dir, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    _log_file = os.path.join(log_dir, f"backend_{timestamp}.log")

    # Choose formatter
    if settings.LOG_JSON_FORMAT:
        formatter = JsonLogFormatter()
    else:
        formatter = logging.Formatter("%(asctime)s | %(levelname)-8s | %(name)s | %(message)s")

    # Rotating file handler (Commit 10)
    file_handler = logging.handlers.RotatingFileHandler(
        _log_file,
        maxBytes=settings.LOG_MAX_BYTES,
        backupCount=settings.LOG_BACKUP_COUNT,
        encoding="utf-8",
    )
    file_handler.setFormatter(formatter)

    # Console handler (plain text with safe error handling on Windows)
    import sys
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
            sys.stderr.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(
        logging.Formatter("%(asctime)s | %(levelname)-8s | %(message)s")
    )

    root = logging.getLogger()
    root.setLevel(getattr(logging, settings.LOG_LEVEL, logging.INFO))
    root.handlers.clear()
    root.addHandler(file_handler)
    root.addHandler(console_handler)

    logging.getLogger(__name__).info(
        f"📝 Logging initialised — file={_log_file}  "
        f"json={settings.LOG_JSON_FORMAT}  "
        f"max={settings.LOG_MAX_BYTES // 1024}KB  "
        f"backups={settings.LOG_BACKUP_COUNT}"
    )
    return _log_file


def get_log_file() -> str:
    """Return the path of the currently active log file."""
    return _log_file

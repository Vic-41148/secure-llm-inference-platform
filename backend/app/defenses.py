# backend/app/defenses.py
#to be updated later selfrem for vic

FORBIDDEN_KEYWORDS = [
    "ignore previous instructions",
    "ignore instructions",
    "system override",
    "system update",
    "dan",
    "no-limits",
    "debug mode",
    "rules do not exist",
    "stay in character"
]

def check_input(prompt: str) -> bool:
    """
    Returns True if input is safe.
    Returns False if input is blocked.
    """
    prompt_lower = prompt.lower()

    for keyword in FORBIDDEN_KEYWORDS:
        if keyword in prompt_lower:
            return False

    return True

# Texact match case
SECRET_VALUE = "vic41148"

def check_output(response: str) -> str:
    """
    Redact secret if it appears in the model output.
    """
    if SECRET_VALUE in response.lower():
        return "[REDACTED]"
    return response
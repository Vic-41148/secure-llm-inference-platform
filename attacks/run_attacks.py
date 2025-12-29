import json
import requests
from pathlib import Path
from datetime import datetime, timezone

# Paths
BASE_DIR = Path(__file__).resolve().parents[1]
DATASET_PATH = BASE_DIR / "attacks" / "dataset.json"
RESULTS_PATH = BASE_DIR / "logs" / "results.json"

# API
API_URL = "http://127.0.0.1:8000/chat"

def load_dataset():
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def send_prompt(prompt: str) -> str:
    response = requests.post(
        API_URL,
        json={"prompt": prompt},
        timeout=30
    )
    response.raise_for_status()
    return response.json()["response"]

def run_attacks():
    dataset = load_dataset()

    results = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "total_tests": len(dataset),
        "runs": []
    }

    for test in dataset:
        prompt = test["prompt"]
        attack_type = test.get("type", "Unknown")

        try:
            model_reply = send_prompt(prompt)
            status = "success"
        except Exception as e:
            model_reply = str(e)
            status = "error"

        results["runs"].append({
            "id": test.get("id"),
            "type": attack_type,
            "description": test.get("description"),
            "prompt": prompt,
            "response": model_reply,
            "status": status
        })

    # for test in dataset:
    #     if not isinstance(test, dict):
    #         continue  # skip if it's not a dict

    #     prompt = test.get("prompt")  # safer than test["prompt"]
    #     attack_type = test.get("type", "Unknown")

    #     try:
    #         model_reply = send_prompt(prompt)
    #         status = "success"
    #     except Exception as e:
    #         model_reply = str(e)
    #         status = "error"

    #     results["runs"].append({
    #         "id": test.get("id"),
    #         "type": attack_type,
    #         "description": test.get("description"),
    #         "prompt": prompt,
    #         "response": model_reply,
    #         "status": status
    #     })

        

        print(f"[+] {test['id']} ({attack_type}) → {status}")

    RESULTS_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(RESULTS_PATH, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print(f"\n[✓] Attack run complete. Results saved to {RESULTS_PATH}")

if __name__ == "__main__":
    run_attacks()

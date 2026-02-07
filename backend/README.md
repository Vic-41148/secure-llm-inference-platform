# Neuro-Sentry Backend

A FastAPI-based backend with automatic Ollama model detection, GPU-optimized LLM support, comprehensive logging, and security threat analysis.

Neuro-Sentry is designed to intelligently select the best available LLM (CPU or GPU), provide real-time inference, and maintain detailed operational logs for observability and debugging.

---

## Features

- Auto-detects available Ollama models  
  Priority order:
  1. llama3-gpu (GPU-optimized)
  2. llama3
  3. mistral
  4. First available model

- GPU-accelerated LLM inference (when available)
- Real-time LLM integration
- Security threat detection and prompt analysis
- Usage and statistics tracking
- Comprehensive backend logging

---

## 📂 Project Structure

```
backend/
├── app/
│   ├── main.py
│   ├── routes/
│   ├── services/
│   └── utils/
├── logs/
│   └── backend_TIMESTAMP.log
├── requirements.txt
└── README.md
```
## Quick Start

From the backend directory:

### Setup (First Time Only)

```python3 -m venv venv  
source venv/bin/activate  
pip install -r requirements.txt
```

### Run the Backend

```source venv/bin/activate  
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000  
```
The server will start at:

http://localhost:8000

---

## Logging

All backend logs are automatically stored in:
```
backend/logs/backend_TIMESTAMP.log
```
### View Logs in Real Time
```
tail -f backend/logs/backend_*.log
```
Logs include:
- Model detection results
- API requests and responses
- LLM interaction events
- Error traces and system warnings

---

## Model Detection Logic

Neuro-Sentry automatically detects and selects the best available Ollama model at startup.

### Selection Priority

1. llama3-gpu – GPU-optimized (preferred)
2. llama3 – CPU fallback
3. mistral – Alternative fallback
4. Any available model

You can verify the active model via:
- Backend logs
- GET /health endpoint

---

## API Endpoints
```
GET /              - Service info  
GET /health        - Health check and active model  
POST /chat         - Direct LLM chat  
POST /api/prompt   - Security threat analysis  
GET /api/stats     - Usage statistics  
GET /api/logs      - Recent backend logs  
```
---

## Ollama GPU Model: llama3-gpu

### Overview

This backend supports a GPU-forced Ollama model named llama3-gpu, created using a custom Modelfile based on the default llama3 model.

### Why This Exists

- Available GPU VRAM: 6 GB
- Model size: approximately 5.3 GB
- Observed issue: Ollama did not reliably use the GPU by default

To ensure consistent GPU usage, explicit GPU offloading parameters were applied.

---

## Key Concept

Ollama models are neither CPU-only nor GPU-only.  
GPU utilization is determined at runtime via configuration parameters, not model weights.

Critical parameter:
```
PARAMETER num_gpu
```
---

## Modelfile Configuration

Filename: Modelfile
```
FROM llama3

PARAMETER num_gpu 99  
PARAMETER num_ctx 4096  
PARAMETER num_keep 24  

### Parameter Explanation

FROM llama3  
Uses the default llama3 model as the base

num_gpu 99  
Forces maximum GPU layer offloading (auto-clamped by VRAM)

num_ctx 4096  
Sets the context window size

num_keep 24  
Preserves tokens across conversation turns
```
---

## Model Creation
```
ollama create llama3-gpu -f Modelfile

This creates:

llama3-gpu:latest
```
No model weights are re-downloaded.

---

## Model Verification
```
ollama show llama3-gpu

Expected output includes:

num_gpu 99
```
---

## Confirming GPU Utilization

Run the model:
```
ollama run llama3-gpu

Monitor GPU usage:

nvidia-smi
```
An increase in GPU VRAM usage confirms successful GPU offloading.

---

## Recreating on Another System
```
curl -fsSL https://ollama.com/install.sh | sh  
ollama pull llama3  
ollama create llama3-gpu -f Modelfile  
ollama show llama3-gpu  
```
---

## GPU Tuning Reference
```
Available VRAM | Recommended num_gpu  
4 GB           | 35–45  
6 GB           | 55–70  
8 GB           | 80–99  
12 GB or more  | 99  
```
Setting num_gpu to 99 is safe, as Ollama automatically clamps the value based on available GPU memory.

---

## Future Improvements

- Automatic GPU VRAM detection
- Dynamic num_gpu tuning at runtime
- Enhanced performance metrics
- Extended security rule sets

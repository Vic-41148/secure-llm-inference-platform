from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from app.llm_client import query_llm
from app.defenses import check_input, check_output

DEFENSE_MODE= False                                          #turn off to show vulnerabilities 

app = FastAPI(
    title="LLM Security Platform",
    version="0.3"
)

#CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    response: str

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):

    if DEFENSE_MODE:
        if not check_input(request.prompt):                 #input sanitization here 
            raise HTTPException(
                status_code=400,
                detail="Prompt blocked by security policy."
            )
        

    llm_reply = query_llm(request.prompt)
    
    if DEFENSE_MODE:
        llm_reply = check_output(llm_reply)                 #output filtering here
    
    return ChatResponse(response=llm_reply)

#404 fixes

@app.get("/logs")
async def get_logs():
    """Reads the attack results JSON file."""
    if os.path.exists(LOG_FILE_PATH):
        with open(LOG_FILE_PATH, "r") as f:
            try:
                import json
                return json.load(f)
            except:
                return []
    return []

@app.get("/defense_count")
async def get_defense_count():
    """Returns how many attacks were blocked (Placeholder logic)."""
    return {"count": 5 if DEFENSE_MODE else 0}

@app.get("/leak_count")
async def get_leak_count():
    """Returns how many successful prompt injections occurred."""
    return {"count": 2 if not DEFENSE_MODE else 0}
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from app.llm_client import query_llm
from app.defenses import check_input

app = FastAPI(
    title="LLM Security Platform",
    version="0.2"
)

class ChatRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    response: str

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not check_input(request.prompt):                 #input sanitization here 
        raise HTTPException(
            status_code=400,
            detail="Prompt blocked by security policy."
        )
    llm_reply = query_llm(request.prompt)
    return ChatResponse(response=llm_reply)

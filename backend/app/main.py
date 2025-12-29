from fastapi import FastAPI
from pydantic import BaseModel

from app.llm_client import query_llm

app = FastAPI(
    title="LLM Security Platform (Vulnerable)",
    version="0.1"
)

class ChatRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    response: str

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    llm_reply = query_llm(request.prompt)
    return ChatResponse(response=llm_reply)

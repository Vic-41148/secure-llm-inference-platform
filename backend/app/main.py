from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from app.llm_client import query_llm
from app.defenses import check_input, check_output

DEFENSE_MODE= False                                          #turn off to show vulnerabilities 

app = FastAPI(
    title="LLM Security Platform",
    version="0.3"
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

import os
import time
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict  
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text
from sqlalchemy.orm import sessionmaker, Session, declarative_base 


from google import genai
from google.genai import types

# 1. CONFIGURATION
# ---------------------------------------------------------
from dotenv import load_dotenv

load_dotenv() 

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

DB_PATH = "../database/feedback.db"


os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

DATABASE_URL = f"sqlite:///{DB_PATH}"


Base = declarative_base() 

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


client = genai.Client(api_key=GEMINI_API_KEY)

app = FastAPI(title="Fynd AI Feedback System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. DATABASE MODELS
# ---------------------------------------------------------
class Feedback(Base):
    __tablename__ = "feedbacks"
    id = Column(Integer, primary_key=True, index=True)
    user_rating = Column(Integer, nullable=False)
    review_text = Column(Text, nullable=False)
    
    # AI Generated Content
    ai_response = Column(Text, nullable=True)
    ai_summary = Column(Text, nullable=True)
    ai_actions = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 3. PYDANTIC SCHEMAS (API & LLM)
# ---------------------------------------------------------

# API Request Schema
class FeedbackCreate(BaseModel):
    rating: int
    review: str

# API Response Schema
class FeedbackOut(BaseModel):
    id: int
    user_rating: int
    review_text: str
    ai_response: Optional[str] = None
    ai_summary: Optional[str] = None
    ai_actions: Optional[str] = None
    created_at: datetime

   
    model_config = ConfigDict(from_attributes=True) 

# LLM Structured Output Schema
class FeedbackAnalysis(BaseModel):
    response: str = Field(..., description="A polite, empathetic response to the customer (max 2 sentences).")
    summary: str = Field(..., description="A concise summary of the review for the admin (max 10 words).")
    actions: str = Field(..., description="A list of 2-3 bullet points for recommended internal actions.")

# 4. AI LOGIC (GEMINI)
# ---------------------------------------------------------
def generate_ai_content(rating: int, text: str):
    prompt = f"""
    You are an AI customer service manager. 
    Analyze this feedback:
    Rating: {rating}/5 stars
    Review: "{text}"
    
    Generate the required response, summary, and actions.
    """
    
    try:
       
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type='application/json',
                response_schema=FeedbackAnalysis,
                temperature=0.7
            )
        )
        
        result: FeedbackAnalysis = response.parsed
        
        return {
            "response": result.response,
            "summary": result.summary,
            "actions": result.actions
        }
        
    except Exception as e:
        print(f"Gemini Error: {e}")
        return {
            "response": "Thank you for your feedback! (AI unavailable)",
            "summary": "AI Processing Failed",
            "actions": "Check server logs"
        }

# 5. ENDPOINTS
# ---------------------------------------------------------
@app.post("/api/feedback", response_model=FeedbackOut)
def submit_feedback(data: FeedbackCreate, db: Session = Depends(get_db)):
    # 1. Generate Content
    ai_data = generate_ai_content(data.rating, data.review)
    
    # 2. Save to DB
    db_item = Feedback(
        user_rating=data.rating,
        review_text=data.review,
        ai_response=ai_data["response"],
        ai_summary=ai_data["summary"],
        ai_actions=ai_data["actions"]
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    
    return db_item

@app.get("/api/admin/reviews", response_model=List[FeedbackOut])
def get_reviews(db: Session = Depends(get_db)):
    return db.query(Feedback).order_by(Feedback.created_at.desc()).all()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
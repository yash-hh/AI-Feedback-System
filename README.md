# AI Feedback & Sentiment Analysis System

An end-to-end AI engineering project featuring a robust research pipeline for text classification and a production-grade web application for automated customer feedback analysis.

## 🚀 Project Overview

This repository contains two distinct but related modules focused on leveraging Large Language Models (LLMs) for sentiment analysis:

1.  **Research Experiment (Prompt Engineering):** A comparative study of prompting strategies (Zero-shot, Few-shot, Chain-of-Thought) to accurately predict Yelp review ratings.
2.  **Full-Stack Feedback System:** A deployed web application allowing users to submit feedback and admins to view real-time AI summaries and actionable insights.

---

## 🏗️ Architecture

### Tech Stack
* **Frontend:** React.js, Custom CSS (Glassmorphism UI)
* **Backend:** Python FastAPI, SQLAlchemy
* **AI Integration:** Google Gemini 2.0 Flash (via `google-genai` SDK)
* **Database:** SQLite (Auto-provisioned)
* **Deployment:** Vercel (Frontend) & Render (Backend)

### System Design
The application follows a decoupled client-server architecture:
* **Client:** React SPA for public feedback submission and a live-updating Admin Dashboard.
* **Server:** FastAPI service handling API requests, DB persistence, and server-side LLM calls.
* **AI Engine:** Enforces strict JSON schemas using Pydantic models to ensure 100% reliable structured output (Summaries, Sentiment Scores, Action Items).

---

## 📂 Repository Structure

```text
/
├── backend/                # FastAPI Server & Business Logic
│   ├── main.py             # Application Entry Point & API Routes
│   ├── requirements.txt    # Python Dependencies
│   └── runtime.txt         # Deployment Configuration
│
├── frontend/               # React Client Application
│   ├── src/
│   │   ├── components/     # Reusable Dashboard Components
│   │   ├── App.js          # Main Layout
│   │   └── App.css         # Modern Glassmorphism Styles
│   └── package.json        # Node.js Dependencies
│
├── notebooks/              # Research & Experimentation
│   └── Task1_Prompt_Experiments.ipynb  # Comparative Analysis Notebook
│
└── README.md               # Project Documentation

🧪 Research Module: Prompt Engineering
Located in notebooks/, this module explores how different prompting strategies affect LLM performance on the Yelp Reviews dataset.

Key Experiments:

Zero-Shot: Baseline performance testing.

Few-Shot: In-context learning with varied examples.

Chain-of-Thought (CoT): Step-by-step reasoning for complex sentiment extraction.

Results: The experiments demonstrated that Few-Shot prompting offered the best balance between token efficiency and accuracy, while Structured Output (JSON mode) was critical for system reliability.

💻 Web Application: Installation & Setup
Prerequisites
Node.js (v14+)

Python (v3.9+)

Google Gemini API Key

1. Backend Setup
Bash

cd backend
pip install -r requirements.txt

# Create .env file or export variable (Linux/Mac)
export GEMINI_API_KEY="your_api_key_here"

# Run Server
python main.py
Server runs on: http://localhost:8000

2. Frontend Setup
Bash

cd frontend
npm install

# Start Client
npm start
Client runs on: http://localhost:3000

## ✨ Key Features
User Portal
Real-time Interaction: Users receive immediate, empathetic AI-generated responses upon submission.

Aesthetic UI: Modern gradient backgrounds with glass-morphism cards.

Admin Dashboard
Automated Insights: Raw text is instantly converted into structured summaries.

Actionable Intelligence: The AI suggests specific operational improvements based on review content.

Visual Analytics: Color-coded cards provide instant sentiment visibility (Green/Yellow/Red).

🛡️ License
This project is open-source and available under the MIT License.

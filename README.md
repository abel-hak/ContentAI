<div align="center">

# ContentAI — AI Content Assistant Dashboard

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-LPU_Inference-F55036?style=for-the-badge&logo=groq&logoColor=white)

**A sleek, AI-powered content generation dashboard featuring blog outline generation, email rewriting, and social media post creation — powered by Groq's ultra-fast LPU inference with Llama 3.3 70B.**

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [API Endpoints](#api-endpoints) • [Screenshots](#screenshots)

</div>

---

## Features

- **Blog Outline Generator** — Input a topic, choose a tone and length, and receive a structured, SEO-friendly blog outline with sections, sub-points, and keyword suggestions.
- **Email Rewriter** — Paste a draft email and select a desired tone. Get a polished, rewritten version that keeps the original intent while improving clarity and style.
- **Social Media Post Generator** — Generate 3 platform-optimized post ideas for Twitter/X, LinkedIn, Instagram, Facebook, or Threads with proper hashtags and formatting.
- **Tone & Style Controls** — Choose from 6 tones: Formal, Casual, Persuasive, Professional, Friendly, and Witty.
- **Copy to Clipboard** — One-click copy on all generated outputs.
- **Content History** — All generated content is saved in a session history sidebar with expand, copy, and delete controls.
- **Dark Glassmorphism UI** — Modern dark theme with backdrop blur, gradient accents, and smooth animations.
- **Fully Responsive** — Desktop sidebar layout with mobile slide-out panel.

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **FastAPI** | High-performance async Python web framework |
| **Groq** | Ultra-fast LPU inference (Llama 3.3 70B) |
| **Pydantic v2** | Request/response validation and serialization |
| **Uvicorn** | ASGI server |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library with hooks |
| **TypeScript** | Type-safe development |
| **Vite** | Lightning-fast build tool |
| **Tailwind CSS v4** | Utility-first CSS framework |
| **Axios** | HTTP client |
| **React Hot Toast** | Toast notifications |
| **React Markdown** | Markdown rendering |
| **Lucide React** | Icon library |

## Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 20+**
- **Groq API Key** — Get one free at [console.groq.com/keys](https://console.groq.com/keys)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ContentAI.git
cd ContentAI
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Start the server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (proxies API to localhost:8000)
npm run dev
```

### 4. Open the App

Visit **http://localhost:3000** in your browser.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check + config status |
| `POST` | `/api/generate/blog-outline` | Generate a blog outline |
| `POST` | `/api/generate/email-rewrite` | Rewrite an email draft |
| `POST` | `/api/generate/social-post` | Generate social media posts |

### Example Request

```bash
curl -X POST http://localhost:8000/api/generate/blog-outline \
  -H "Content-Type: application/json" \
  -d '{"topic": "AI in Healthcare", "tone": "professional", "length": "medium"}'
```

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GROQ_API_KEY` | Yes | — | Groq API key |
| `GROQ_MODEL` | No | `llama-3.3-70b-versatile` | Model to use for generation |

## Project Structure

```
ContentAI/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py             # Settings & environment config
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment template
│   ├── models/
│   │   └── schemas.py        # Pydantic request/response models
│   ├── routers/
│   │   └── generate.py       # API route handlers
│   └── services/
│       └── gemini_service.py # Groq LLM integration
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Main application layout
│   │   ├── main.tsx          # React entry point
│   │   ├── index.css         # Tailwind + custom styles
│   │   ├── components/       # UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API client
│   │   └── types/            # TypeScript interfaces
│   ├── index.html            # HTML template
│   └── vite.config.ts        # Vite configuration
└── README.md
```

## Screenshots

> Screenshots coming soon — run the project to see the full UI!

---

<div align="center">

**Built with** FastAPI + React + Groq (Llama 3.3 70B)

</div>

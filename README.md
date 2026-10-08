<div align="center">

# ContentAI — AI Content Assistant Dashboard

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-LPU_Inference-F55036?style=for-the-badge&logo=groq&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
![CI](https://img.shields.io/github/actions/workflow/status/abel-hak/ContentAI/ci.yml?branch=main&style=for-the-badge&label=CI)

**A sleek, AI-powered content generation dashboard featuring blog outline generation, email rewriting, and social media post creation — powered by Groq's ultra-fast LPU inference with OpenAI GPT-OSS 120B.**

[Features](#features) • [Why I Built This](#why-i-built-this) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Docker](#docker) • [Deploy](#deploy) • [API Endpoints](#api-endpoints)

</div>

---

## Why I Built This

Content creators and freelancers often jump between ChatGPT tabs, copy-paste drafts, and lose previous generations. ContentAI packages three high-demand writing tools into one focused dashboard with tone controls, copy-to-clipboard, and persistent history — the kind of AI product UX clients ask for on Upwork and freelance projects.

## Features

- **Blog Outline Generator** — Topic + tone + length → structured, SEO-friendly outline
- **Email Rewriter** — Draft email + desired tone → clearer, polished rewrite
- **Social Media Post Generator** — Topic + platform + tone → 3 platform-ready post ideas
- **Real-time Streaming** — Token-by-token SSE responses for a ChatGPT-like feel
- **Compare Tones Side by Side** — Generate 3 tone variants in parallel with `asyncio.gather`
- **Content Score Panel** — Readability (Flesch), SEO score, word count, reading time + tips
- **Export** — Download Markdown or export PDF from any output
- **Tone & Style Controls** — Formal, Casual, Persuasive, Professional, Friendly, Witty
- **Copy to Clipboard** — One-click copy on every output
- **Persistent Content History** — Saved in localStorage across page refreshes
- **Dark Glassmorphism UI** — Backdrop blur, gradient accents, smooth animations
- **Fully Responsive** — Desktop sidebar + mobile slide-out history panel
- **Docker + CI** — One-command stack with GitHub Actions tests/build

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **FastAPI** | High-performance async Python web framework |
| **Groq** | Ultra-fast LPU inference (openai/gpt-oss-120b) |
| **Pydantic v2** | Request/response validation and serialization |
| **Uvicorn** | ASGI server |
| **Pytest** | API tests with mocked LLM calls |

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
git clone https://github.com/abel-hak/ContentAI.git
cd ContentAI
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Open the App

Visit **http://127.0.0.1:3000**

### 5. Run Backend Tests

```bash
cd backend
pytest -q
```

## Docker

```bash
# From the repo root (requires backend/.env with GROQ_API_KEY)
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/health
- Docs: http://localhost:8000/docs

## Deploy

### Backend (Render)

1. Push this repo to GitHub
2. Create a new **Web Service** on [Render](https://render.com) (or use `render.yaml`)
3. Set root directory to `backend`
4. Build: `pip install -r requirements.txt`
5. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add env vars:
   - `GROQ_API_KEY`
   - `GROQ_MODEL=openai/gpt-oss-120b`
   - `CORS_ORIGINS=https://YOUR_VERCEL_APP.vercel.app`

### Frontend (Vercel)

1. Import the `frontend` folder on [Vercel](https://vercel.com)
2. Set env var:
   - `VITE_API_URL=https://YOUR_RENDER_SERVICE.onrender.com/api`
3. Deploy

After both are live, put the Vercel URL in your Upwork portfolio and README.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check + config status |
| `POST` | `/api/generate/blog-outline` | Generate a blog outline |
| `POST` | `/api/generate/blog-outline/stream` | Stream a blog outline (SSE) |
| `POST` | `/api/generate/email-rewrite` | Rewrite an email draft |
| `POST` | `/api/generate/email-rewrite/stream` | Stream an email rewrite (SSE) |
| `POST` | `/api/generate/social-post` | Generate social media posts |
| `POST` | `/api/generate/social-post/stream` | Stream social posts (SSE) |
| `POST` | `/api/generate/compare` | Compare 2–3 tones in parallel |

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
| `GROQ_MODEL` | No | `openai/gpt-oss-120b` | Model used for generation |
| `CORS_ORIGINS` | No | localhost origins | Comma-separated allowed frontend URLs |
| `VITE_API_URL` | Prod only | `/api` | Frontend API base URL |

## Project Structure

```
ContentAI/
├── backend/
│   ├── main.py
│   ├── config.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── models/schemas.py
│   ├── routers/generate.py
│   ├── services/llm_service.py
│   ├── Dockerfile
│   └── tests/test_api.py
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vercel.json
│   └── vite.config.ts
├── .github/workflows/ci.yml
├── docker-compose.yml
├── render.yaml
├── LICENSE
└── README.md
```

## Screenshots

> Add 3–4 screenshots here before pitching on Upwork:
> 1. Blog outline result (desktop)
> 2. Email rewriter result
> 3. Social posts + history sidebar
> 4. Mobile view

---

<div align="center">

**Built with** FastAPI + React + Groq (GPT-OSS 120B)

</div>

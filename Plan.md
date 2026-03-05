# 🧠 Phase-Wise Execution Plan

Each phase below can be prompted directly to your AI coding agent.  
Follow sequentially.

## PHASE 1 — Project Setup & Initialization

**Goal:** Create the base structure for frontend, backend, and data.

**Prompt:**

Initialize a monorepo:

- `/frontend` (Next.js + Tailwind)
- `/backend` (FastAPI + LangChain + ChromaDB)
- `/data` (timeline + projects + skills)

Set up Git + `.gitignore` for `node_modules`, `__pycache__`, `.venv`, `.env`.

Add `README.md` and `.env.example`.

Scaffold placeholder API routes:

- `/chat` → returns `{ "answer": "Hello from backend" }`
- `/graph` → returns dummy JSON of nodes/edges.

Verify frontend → backend connection with Axios.

## PHASE 2 — Data Modeling & RAG Setup

**Goal:** Implement document ingestion and vector retrieval.

**Prompt:**

Create `/backend/build_vector_store.py`:

Load all markdown, JSON, YAML from `/data`.

Use `sentence-transformers/all-MiniLM-L6-v2` to embed.

Store embeddings in local ChromaDB.

Add helper in `rag_engine.py`:

```python
def get_relevant_docs(query: str, top_k: int = 3):
    # connect to Chroma
    # return top_k documents as text
```

Run script manually to build the vector store.

Test retrieval locally: query *"Tell me about my AI projects."*

## PHASE 3 — LLM Integration (Hugging Face Inference API)

**Goal:** Connect to free hosted LLMs via Hugging Face Inference.

**Prompt:**

Add Hugging Face integration to `rag_engine.py`:

```python
import os, httpx
from dotenv import load_dotenv

load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")
HF_MODEL = os.getenv("HF_MODEL")
HF_API_URL = f"https://api-inference.huggingface.co/models/{HF_MODEL}"
HEADERS = {"Authorization": f"Bearer {HF_TOKEN}"}

async def call_hf_model(prompt: str):
    async with httpx.AsyncClient() as client:
        resp = await client.post(HF_API_URL, headers=HEADERS, json={"inputs": prompt})
        data = resp.json()
        if isinstance(data, list) and "generated_text" in data[0]:
            return data[0]["generated_text"]
        else:
            return str(data)

async def generate_answer(query, docs):
    context = "\n".join(docs)
    prompt = f"You are an AI assistant that answers questions about my portfolio.\nContext:\n{context}\nQuestion: {query}\nAnswer:"
    return await call_hf_model(prompt)
```

Update `/chat` route:

Accept `{ "message": "..." }`

Retrieve docs → generate → return `{ "answer": "...", "sources": [...] }`.

## PHASE 4 — Frontend Chat Interface

**Goal:** Build chat UI and connect to backend.

**Prompt:**

In `/frontend`, integrate or clone open-source Chatbot UI.

- Strip authentication & advanced features.
- Connect message input to `/chat` via Axios.
- Display streaming messages (optional) and sources under replies.
- Use Zustand for state (chat history, loading state).
- Add a landing header: *"Ask me anything about my work or projects."*

## PHASE 5 — Dynamic Knowledge Graph

**Goal:** Show a live visual graph of your projects and skills.

**Prompt:**

In `/backend/main.py`, create `/graph` route:

Parse `skills.yaml` and `timeline.json`.

Return nodes (projects, skills, experiences) and edges (relationships).

In `/frontend`:

- Use Cytoscape.js to visualize the graph.
- Each node = skill/project.
- Clicking a node triggers chat query scoped to that node.
- On chat responses, highlight mentioned nodes dynamically.

## PHASE 6 — Interactive Case Study Explorer

**Goal:** Let users dive into individual projects.

**Prompt:**

- Create modal or sidebar that opens when a project node is clicked.
- Display project metadata (stack, challenges, learnings, links).
- Allow scoped chat (query only within that project's markdown).
- Store project-level embeddings separately in Chroma for speed.

## PHASE 7 — Conversational Timeline

**Goal:** Let users ask about specific years or milestones.

**Prompt:**

Extend `timeline.json` with entries:

```json
[
  { "year": 2021, "title": "Started AI Projects", "details": "Built first chatbot..." },
  { "year": 2023, "title": "Internship", "details": "Worked on NLP pipeline..." }
]
```

In backend:

- Detect queries like *"Tell me about 2021"* or *"What did you do in 2023?"*
- Retrieve relevant entries from timeline and summarize.

In frontend:

- Display a timeline view.
- When mentioned in chat, scroll to or highlight the relevant year.

## PHASE 8 — Testing, Polish, & Deployment

**Goal:** Finalize and host the app.

**Prompt:**

- Add graceful error handling for Hugging Face rate limits (30 req/min).
- Add typing indicator, smooth transitions, and dark/light theme toggle.
- Test RAG retrieval accuracy.

**Deploy:**

- Frontend → Vercel
- Backend → Render or Railway (free)

Update README with setup and run instructions:

```bash
# Local Dev
cd backend && uvicorn main:app --reload
cd frontend && npm run dev
```

---

## ✅ FUTURE EXPANSIONS (Optional)

- Add "suggested questions" below chat.
- Add analytics via Umami (free).
- Cache vector queries for faster responses.
- Add simple admin interface to update data.

---

## 🧩 KEY NOTES FOR CODING AGENT

- Maintain modularity: each phase should build on previous code cleanly.
- Code must use only free / open-source tools.
- Prefer readability and modular design (separate RAG logic from API).
- Make every file self-contained (document functions + types).
- Add comments explaining how to modify data or models later.
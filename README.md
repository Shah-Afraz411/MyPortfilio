# 🧠 AI-Powered Portfolio

An interactive portfolio powered by RAG (Retrieval-Augmented Generation) and knowledge graphs. Ask questions about projects, skills, and experience through natural language.

---

## 📖 Overview

### What is This?

This is an AI-powered portfolio website that allows visitors to interact with your professional information through natural language. Instead of static pages, users can ask questions like "What projects have you built?" or "Tell me about your AI experience" and get intelligent, context-aware responses.

### ✨ Key Features

- **AI Chat Interface**: Natural language Q&A about projects, skills, and experience
- **RAG-Powered Responses**: Retrieves relevant context from portfolio data using vector search
- **Knowledge Graph Visualization**: Interactive graph showing relationships between projects, skills, and experiences
- **Conversational Timeline**: Explore career history through chat
- **Case Study Deep-Dives**: Detailed project explorations with scoped queries
- **Free & Open Source**: Uses Hugging Face models and open-source tools (no API costs)

### 🏗️ Project Structure

```
Portfolio Site/
├── frontend/              # Next.js 14 application
│   ├── app/              # App router pages
│   ├── components/       # React components (Chat, Graph, Timeline)
│   └── lib/              # API clients and utilities
├── backend/              # FastAPI application
│   ├── main.py          # API endpoints
│   ├── rag_engine.py    # RAG logic and vector search
│   ├── build_vector_store.py  # Vector database builder
│   └── chroma_db/       # ChromaDB vector store (generated)
├── data/                # Portfolio content
│   ├── projects/        # Project markdown files
│   ├── skills.yaml      # Skills and technologies
│   └── timeline.json    # Career timeline
├── Plan.md              # Detailed development roadmap
└── README.md            # This file
```

### 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Cytoscape.js (graph visualization)
- Zustand (state management)

**Backend:**
- FastAPI (Python web framework)
- LangChain (LLM orchestration)
- ChromaDB (vector database)
- Sentence Transformers (embeddings)
- Hugging Face Inference API (LLM)

**AI/ML:**
- all-MiniLM-L6-v2 (embedding model)
- Mistral-7B-Instruct (text generation via Hugging Face)

### 📅 Development Phases

This project is built in 8 phases:

- ✅ **Phase 1**: Monorepo setup with placeholder endpoints
- ✅ **Phase 2**: Vector store and RAG implementation
- ✅ **Phase 3**: LLM integration with Hugging Face
- ✅ **Phase 4**: Chat interface with streaming responses
- ✅ **Phase 5**: Knowledge graph visualization
- 🚧 **Phase 6**: Case study explorer with scoped queries
- 🚧 **Phase 7**: Conversational timeline interface
- ⏳ **Phase 8**: Testing, optimization, and deployment

**See `Plan.md` for detailed phase descriptions and implementation details.**

---

## 🚀 How to Setup

### Prerequisites

Before starting, ensure you have:

- **Node.js 18+** and npm ([Download](https://nodejs.org/))
- **Python 3.9-3.13** ([Download](https://www.python.org/downloads/))
- **Git** ([Download](https://git-scm.com/))
- **Hugging Face Account** (free, for LLM API access)

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <your-repo-url>
cd "Portfolio Site"
```

### Step 2: Environment Setup

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` and add your Hugging Face token:
```env
HF_API_TOKEN=your_huggingface_token_here
```

**Get your token:** https://huggingface.co/settings/tokens (create a "Read" token)

### Step 3: Backend Setup

```bash
# Navigate to backend
cd backend

# Create Python virtual environment
python -m venv .venv

# Activate virtual environment
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1

# Windows CMD:
.venv\Scripts\activate.bat

# Linux/Mac:
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Build the vector store (indexes your portfolio data)
python build_vector_store.py
# This will take 10-15 seconds on first run (downloads embedding model)

# Start the backend server
uvicorn main:app --reload
```

**Backend will be available at:**
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs
- Stats Endpoint: http://localhost:8000/stats

### Step 4: Frontend Setup

Open a **new terminal** (keep backend running) and run:

```bash
# Navigate to frontend
cd frontend

# Install Node.js dependencies
npm install

# Start development server
npm run dev
```

**Frontend will be available at:**
- Application: http://localhost:3000

### ✅ Verify Setup

1. Open http://localhost:3000 - You should see the portfolio interface
2. Check backend status indicator - Should show green dot (connected)
3. Try asking a question in the chat interface
4. Visit http://localhost:8000/docs to explore API endpoints

---

## 📝 How to Use

### Adding Content

#### 1. Add a New Project

Create a markdown file in `data/projects/` (e.g., `my_new_project.md`):

```markdown
# Project Name

**Overview:**
Brief description of what the project does and its purpose.

**Tech Stack:**
Python, FastAPI, React, PostgreSQL

**Key Features:**
- Feature 1: Description
- Feature 2: Description
- Feature 3: Description

**Challenges Faced:**
Challenge 1: How you overcame it
Challenge 2: Solution approach

**Outcome:**
Results achieved, metrics, impact

**Learnings:**
- Key takeaway 1
- Key takeaway 2

**Links:**
GitHub: https://github.com/username/project
Demo: https://project-demo.com

**Year:**
2024
```

#### 2. Update Skills

Edit `data/skills.yaml`:

```yaml
skills:
  - category: "Programming Languages"
    items:
      - Python
      - JavaScript
      - TypeScript
      - Java
  
  - category: "Frameworks & Libraries"
    items:
      - React
      - FastAPI
      - TensorFlow
  
  - category: "Tools & Technologies"
    items:
      - Docker
      - Git
      - AWS
```

#### 3. Update Timeline

Edit `data/timeline.json`:

```json
[
  {
    "year": 2024,
    "title": "Senior AI Engineer at Company X",
    "details": "Led development of AI-powered features...",
    "achievements": [
      "Built scalable ML pipeline",
      "Reduced inference time by 40%"
    ],
    "technologies": ["Python", "TensorFlow", "Kubernetes"]
  },
  {
    "year": 2023,
    "title": "Previous Role",
    "details": "Description..."
  }
]
```

### Rebuilding the Vector Store

After adding or modifying content, rebuild the vector store:

```bash
cd backend

# Make sure virtual environment is activated
# Windows:
.\.venv\Scripts\Activate.ps1

# Rebuild vector store
python build_vector_store.py

# Restart backend server
# Press Ctrl+C to stop, then:
uvicorn main:app --reload
```

### Testing from Terminal

#### Test Backend Health

```bash
# Windows PowerShell:
Invoke-RestMethod http://localhost:8000/

# Linux/Mac:
curl http://localhost:8000/
```

#### Test Vector Store Stats

```bash
# Windows PowerShell:
Invoke-RestMethod http://localhost:8000/stats

# Linux/Mac:
curl http://localhost:8000/stats
```

#### Test Chat Endpoint

```bash
# Windows PowerShell:
$body = @{ message = "Tell me about your AI projects" } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:8000/chat -Method Post -Body $body -ContentType "application/json"

# Linux/Mac:
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about your AI projects"}'
```

#### Test Graph Endpoint

```bash
# Windows PowerShell:
Invoke-RestMethod http://localhost:8000/graph

# Linux/Mac:
curl http://localhost:8000/graph
```

### Testing with Postman

1. **Import Collection**: Create a new collection in Postman
2. **Health Check**:
   - Method: `GET`
   - URL: `http://localhost:8000/`
3. **Chat**:
   - Method: `POST`
   - URL: `http://localhost:8000/chat`
   - Body (JSON):
     ```json
     {
       "message": "What are your technical skills?"
     }
     ```
4. **Graph**:
   - Method: `GET`
   - URL: `http://localhost:8000/graph`
5. **Timeline**:
   - Method: `GET`
   - URL: `http://localhost:8000/timeline`
6. **Projects**:
   - Method: `GET`
   - URL: `http://localhost:8000/projects`

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

**Configuration:**
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Backend Deployment (Render / Railway / Fly.io)

#### Option 1: Render

1. Create new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `pip install -r requirements.txt && python build_vector_store.py`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**: Add `HF_API_TOKEN`
4. Deploy

#### Option 2: Railway

1. Create new project on [Railway](https://railway.app)
2. Add GitHub repository
3. Add environment variable: `HF_API_TOKEN`
4. Railway auto-detects Python and deploys

#### Option 3: Fly.io

```bash
# Install Fly CLI
# Follow: https://fly.io/docs/hands-on/install-flyctl/

cd backend

# Login
flyctl auth login

# Launch app
flyctl launch

# Set environment variable
flyctl secrets set HF_API_TOKEN=your_token_here

# Deploy
flyctl deploy
```

### Update Frontend with Backend URL

After deploying backend, update frontend API URL:

```typescript
// frontend/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-url.com';
```

Add to Vercel environment variables:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

---

## 👨‍💻 For Developers

### Architecture Overview

This is a **RAG (Retrieval-Augmented Generation)** application with the following architecture:

```
User Query → Frontend → Backend API → RAG Engine → Vector Store
                                    ↓
                                LLM (Hugging Face) ← Retrieved Context
                                    ↓
                            Response → Frontend
```

### Backend Architecture

#### 1. Main Application (`main.py`)

**Endpoints:**
- `GET /` - Health check
- `GET /stats` - Vector store statistics
- `POST /chat` - Main chat endpoint with RAG
- `GET /graph` - Knowledge graph data
- `GET /timeline` - Career timeline
- `GET /projects` - List of projects
- `GET /projects/{id}` - Specific project details

**Control Flow for Chat:**
```python
1. Receive user message
2. Call rag_engine.get_relevant_docs(message) → Vector search
3. Format context from retrieved documents
4. Call generate_response(message, context) → LLM
5. Return response + sources
```

#### 2. RAG Engine (`rag_engine.py`)

**Key Functions:**

```python
get_relevant_docs(query: str, k: int = 3)
# Uses ChromaDB similarity search
# Returns top k relevant documents with metadata

generate_response(query: str, context: str)
# Calls Hugging Face Inference API
# Uses custom prompt template
# Returns LLM-generated response

get_collection_stats()
# Returns vector store statistics
```

**Vector Search Process:**
1. Convert query to embedding (all-MiniLM-L6-v2)
2. Search ChromaDB collection for similar vectors
3. Return documents ranked by cosine similarity
4. Include metadata (source, type, year)

#### 3. Vector Store Builder (`build_vector_store.py`)

**Data Loading:**
```python
1. Load markdown files from data/projects/
2. Load YAML from data/skills.yaml
3. Load JSON from data/timeline.json
4. Chunk large documents
5. Generate embeddings
6. Store in ChromaDB
```

**Document Structure:**
```python
{
    "id": "unique_id",
    "content": "document text",
    "metadata": {
        "source": "filename",
        "type": "project|skill|timeline",
        "year": "2024"
    }
}
```

### Frontend Architecture

#### 1. Pages (`app/`)

- `page.tsx` - Main application page
- `layout.tsx` - Root layout with providers

#### 2. Components (`components/`)

**ChatInterface.tsx:**
- Manages chat state with Zustand
- Sends messages to `/chat` endpoint
- Displays responses with source attribution
- Handles streaming (if implemented)

**KnowledgeGraph.tsx:**
- Uses Cytoscape.js for visualization
- Fetches data from `/graph` endpoint
- Interactive node selection
- Highlights related nodes

**Timeline.tsx:**
- Displays career timeline
- Fetches from `/timeline` endpoint
- Scrolls to highlighted years
- Shows achievements and technologies

#### 3. State Management (`lib/store/`)

**chatStore.ts:**
```typescript
interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  addMessage: (message) => void
  setLoading: (loading) => void
  setError: (error) => void
  clearMessages: () => void
}
```

#### 4. API Client (`lib/api.ts`)

Centralized API calls with TypeScript types:
```typescript
export const chatApi = {
  sendMessage: async (message: string)
}

export const graphApi = {
  getGraph: async ()
}

export const timelineApi = {
  getTimeline: async ()
}
```

### Key Design Decisions

1. **ChromaDB over Pinecone/Weaviate**: Free, local-first, no API costs
2. **Hugging Face over OpenAI**: Free tier, open models, no credit card required
3. **Sentence Transformers**: Lightweight embeddings (384 dimensions)
4. **FastAPI over Flask**: Better async support, auto-generated docs
5. **Zustand over Redux**: Simpler state management, less boilerplate

### Performance Considerations

**Backend:**
- Vector search: ~50-100ms for 10 documents
- LLM inference: ~2-5s (Hugging Face API)
- Total response time: ~3-6s

**Optimization Tips:**
- Cache embeddings in memory
- Use streaming responses for LLM
- Implement request queuing for Hugging Face rate limits
- Add Redis for response caching

### Adding New Features

**Example: Add a new endpoint**

1. **Backend (`main.py`):**
```python
@app.get("/skills")
async def get_skills():
    # Load skills from data/skills.yaml
    # Return structured data
    pass
```

2. **Frontend API (`lib/api.ts`):**
```typescript
export const skillsApi = {
  getSkills: async () => {
    const response = await axios.get(`${API_URL}/skills`)
    return response.data
  }
}
```

3. **Frontend Component:**
```tsx
const SkillsDisplay = () => {
  const [skills, setSkills] = useState([])
  
  useEffect(() => {
    skillsApi.getSkills().then(setSkills)
  }, [])
  
  return <div>{/* Render skills */}</div>
}
```

### Debugging Tips

**Backend Issues:**
```bash
# Check logs
uvicorn main:app --reload --log-level debug

# Test vector store
python test_rag.py

# Check ChromaDB
python
>>> from rag_engine import collection
>>> collection.count()
```

**Frontend Issues:**
```bash
# Check browser console for errors
# Network tab for API calls
# React DevTools for component state

# Enable verbose logging
NEXT_PUBLIC_DEBUG=true npm run dev
```

### Common Issues

1. **ChromaDB Telemetry Errors**: Safe to ignore, doesn't affect functionality
2. **HF Rate Limits**: Implement retry logic with exponential backoff
3. **CORS Errors**: Check backend CORS configuration in `main.py`
4. **Vector Store Empty**: Run `build_vector_store.py` again

### Contributing Guidelines

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Follow existing code style (Prettier for frontend, Black for backend)
4. Add tests if applicable
5. Update documentation
6. Submit pull request

### Tech Debt & Future Improvements

- [ ] Add Redis caching for API responses
- [ ] Implement proper logging (structlog)
- [ ] Add unit tests (pytest, Jest)
- [ ] Add E2E tests (Playwright)
- [ ] Implement streaming responses
- [ ] Add rate limiting
- [ ] Add authentication
- [ ] Optimize vector search performance
- [ ] Add monitoring (Sentry, Datadog)

---

## 📄 License

MIT License - Feel free to use this template for your own portfolio!

## 📧 Contact

Questions? Open an issue or reach out through the portfolio chat interface!

"""
FastAPI backend for AI Portfolio
Provides endpoints for RAG-powered chat and project-scoped queries
"""

import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

# Import RAG engine
from rag_engine import (
    generate_answer_with_sources,
    get_collection_stats,
    get_relevant_docs,
    initialize_rag_engine,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize RAG engine on startup (deferred to background)"""
    print("🚀 Starting up backend...")

    # Defer heavy model loading to background so the port opens immediately
    import asyncio

    async def _init():
        force_reingest = os.getenv("FORCE_REINGEST", "false").lower() == "true"
        initialize_rag_engine(force_reingest=force_reingest)

    asyncio.create_task(_init())

    yield
    print("👋 Shutting down backend...")


app = FastAPI(title="AI Portfolio Backend", version="1.0.0", lifespan=lifespan)

# CORS configuration for frontend connection
# Set ALLOWED_ORIGINS as a comma-separated list in .env
# e.g. ALLOWED_ORIGINS=http://localhost:3000,https://your-portfolio.vercel.app
allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
allowed_origins = [origin.strip() for origin in allowed_origins if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response models
class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[str] | None = []


# CV Download endpoint
@app.get("/api/download-cv")
async def download_cv():
    """
    Endpoint to download the CV PDF file.
    Searches for the only PDF file in the data folder.
    """
    try:
        current_file = Path(__file__).resolve()
        backend_dir = current_file.parent

        possible_paths = [
            backend_dir / "data",
            backend_dir.parent / "data",
        ]

        data_folder = None
        for path in possible_paths:
            if path.exists():
                data_folder = path
                break

        if not data_folder:
            print(
                f"❌ Data folder not found. Tried: {[str(p) for p in possible_paths]}"
            )
            raise HTTPException(status_code=404, detail="Data folder not found")

        print(f"🔍 Looking for CV in: {data_folder}")
        print(f"📁 Data folder exists: {data_folder.exists()}")

        pdf_files = list(data_folder.glob("*.pdf"))

        print(f"📄 Found {len(pdf_files)} PDF files: {[f.name for f in pdf_files]}")

        if not pdf_files:
            all_files = list(data_folder.glob("*"))
            print(f"📂 All files in data folder: {[f.name for f in all_files]}")
            raise HTTPException(
                status_code=404, detail="CV file not found in data folder"
            )

        if len(pdf_files) > 1:
            raise HTTPException(
                status_code=500,
                detail=f"Multiple PDF files found: {[f.name for f in pdf_files]}",
            )

        cv_path = pdf_files[0]

        print(f"✓ Serving CV: {cv_path.name}")

        return FileResponse(
            path=str(cv_path),
            media_type="application/pdf",
            filename="Syed_Afraz_CV.pdf",
            headers={"Content-Disposition": "attachment; filename=Syed_Afraz_CV.pdf"},
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error retrieving CV: {e!s}")
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error retrieving CV: {e!s}")


# Root endpoint
@app.get("/")
async def root():
    return {"message": "AI Portfolio Backend API", "status": "running"}


# Stats endpoint
@app.get("/stats")
async def get_stats():
    """
    Get statistics about the vector store
    """
    try:
        stats = get_collection_stats()
        return stats
    except Exception as e:
        return {"error": str(e)}


# Chat endpoint - Standard RAG
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint for RAG-powered Q&A with LLM generation
    """
    try:
        docs = get_relevant_docs(request.message, top_k=3)

        if not docs:
            return ChatResponse(
                answer="I don't have enough information to answer that question. Please try asking about my projects, skills, or experience.",
                sources=[],
            )

        result = await generate_answer_with_sources(request.message, docs)

        return ChatResponse(answer=result["answer"], sources=result["sources"])

    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        import traceback

        traceback.print_exc()
        return ChatResponse(
            answer="Sorry, I encountered an error processing your request. The AI model might be loading or unavailable.",
            sources=[],
        )


# Project detail endpoint
@app.get("/project/{project_id}")
async def get_project(project_id: str):
    """
    Returns detailed information about a specific project
    Used by the project modal for deep-dive exploration
    """
    try:
        from project_parser import parse_project_markdown

        project_data = parse_project_markdown(project_id)

        if not project_data:
            return {"error": f"Project '{project_id}' not found"}

        return project_data

    except Exception as e:
        print(f"Error loading project {project_id}: {e}")
        import traceback

        traceback.print_exc()
        return {"error": str(e)}


# Scoped chat endpoint - Project-specific queries
@app.post("/chat/project/{project_id}")
async def chat_project_scoped(project_id: str, request: ChatRequest):
    """
    Chat endpoint scoped to a specific project
    Queries only use context from the specified project
    """
    try:
        from project_parser import get_project_content_for_scoped_chat

        project_content = get_project_content_for_scoped_chat(project_id)

        if not project_content:
            return ChatResponse(
                answer=f"I couldn't find information about the project '{project_id}'. Please make sure the project exists.",
                sources=[],
            )

        # Format content as a document dictionary (expected by generate_answer_with_sources)
        docs = [
            {
                "content": project_content,
                "metadata": {"source": f"{project_id}.md", "type": "project"},
            }
        ]

        result = await generate_answer_with_sources(request.message, docs)

        return ChatResponse(answer=result["answer"], sources=[f"Project: {project_id}"])

    except Exception as e:
        print(f"Error in scoped chat for project {project_id}: {e}")
        import traceback

        traceback.print_exc()
        return ChatResponse(
            answer="Sorry, I encountered an error processing your request.", sources=[]
        )


# Add manual reingest endpoint
@app.post("/admin/reingest")
async def manual_reingest():
    """Manually trigger complete data re-ingestion and vector store rebuild"""
    try:
        import asyncio

        print("🔄 Reingesting vector store...")
        await asyncio.to_thread(initialize_rag_engine, force_reingest=True)
        print("✓ Vector store reingested")

        return {"status": "success", **get_collection_stats()}

    except Exception as e:
        print(f"❌ Error during reingest: {e}")
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e)) from e


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

"""
FastAPI backend for AI Portfolio
Provides endpoints for RAG-powered chat and project-scoped queries
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
from contextlib import asynccontextmanager
from pathlib import Path
import os

# Import RAG engine
from rag_engine import (
    initialize_rag_engine, 
    get_relevant_docs, 
    get_collection_stats,
    generate_answer_with_sources
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize RAG engine on startup"""
    print("🚀 Starting up backend...")
    
    # Check for FORCE_REINGEST environment variable
    force_reingest = os.getenv("FORCE_REINGEST", "false").lower() == "true"
    initialize_rag_engine(force_reingest=force_reingest)
    
    yield
    print("👋 Shutting down backend...")


app = FastAPI(
    title="AI Portfolio Backend",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response models
class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    answer: str
    sources: Optional[List[str]] = []


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
            print(f"❌ Data folder not found. Tried: {[str(p) for p in possible_paths]}")
            raise HTTPException(status_code=404, detail="Data folder not found")
        
        print(f"🔍 Looking for CV in: {data_folder}")
        print(f"📁 Data folder exists: {data_folder.exists()}")
        
        pdf_files = list(data_folder.glob("*.pdf"))
        
        print(f"📄 Found {len(pdf_files)} PDF files: {[f.name for f in pdf_files]}")
        
        if not pdf_files:
            all_files = list(data_folder.glob("*"))
            print(f"📂 All files in data folder: {[f.name for f in all_files]}")
            raise HTTPException(status_code=404, detail="CV file not found in data folder")
        
        if len(pdf_files) > 1:
            raise HTTPException(status_code=500, detail=f"Multiple PDF files found: {[f.name for f in pdf_files]}")
        
        cv_path = pdf_files[0]
        
        print(f"✓ Serving CV: {cv_path.name}")
        
        return FileResponse(
            path=str(cv_path),
            media_type="application/pdf",
            filename="Syed_Afraz_CV.pdf",
            headers={
                "Content-Disposition": "attachment; filename=Syed_Afraz_CV.pdf"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error retrieving CV: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error retrieving CV: {str(e)}")


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
                sources=[]
            )
        
        result = await generate_answer_with_sources(request.message, docs)
        
        return ChatResponse(
            answer=result["answer"],
            sources=result["sources"]
        )
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        import traceback
        traceback.print_exc()
        return ChatResponse(
            answer="Sorry, I encountered an error processing your request. The AI model might be loading or unavailable.",
            sources=[]
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
                sources=[]
            )
        
        # Format content as a document dictionary (expected by generate_answer_with_sources)
        docs = [{
            'content': project_content,
            'metadata': {
                'source': f'{project_id}.md',
                'type': 'project'
            }
        }]
        
        result = await generate_answer_with_sources(
            request.message, 
            docs
        )
        
        return ChatResponse(
            answer=result["answer"],
            sources=[f"Project: {project_id}"]
        )
        
    except Exception as e:
        print(f"Error in scoped chat for project {project_id}: {e}")
        import traceback
        traceback.print_exc()
        return ChatResponse(
            answer="Sorry, I encountered an error processing your request.",
            sources=[]
        )


# Add manual reingest endpoint
@app.post("/admin/reingest")
async def manual_reingest():
    """Manually trigger complete data re-ingestion and vector store rebuild"""
    try:
        import shutil
        from pathlib import Path
        
        chroma_path = Path(__file__).parent / "chroma_db"
        
        if chroma_path.exists():
            print("🗑️  Deleting existing vector store...")
            shutil.rmtree(chroma_path)
            print("✓ Vector store deleted")
        
        # Reinitialize RAG engine
        print("🔄 Reinitializing RAG engine...")
        initialize_rag_engine(force_reingest=False)
        print("✓ RAG engine reinitialized")
        
        # Now rebuild the vector store by reading all data files
        print("📥 Rebuilding vector store from data files...")
        
        from sentence_transformers import SentenceTransformer
        import chromadb
        from chromadb.config import Settings
        
        # Get paths
        backend_dir = Path(__file__).parent
        data_folder = backend_dir.parent / "data"
        projects_folder = data_folder / "projects"
        
        # Initialize embedding model and ChromaDB
        embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        chroma_client = chromadb.PersistentClient(
            path=str(chroma_path),
            settings=Settings(anonymized_telemetry=False)
        )
        collection = chroma_client.create_collection(name="portfolio_data")
        
        # Read and embed all project files
        document_id = 0
        total_chunks = 0
        
        if projects_folder.exists():
            for project_file in projects_folder.glob("*.md"):
                print(f"📄 Processing: {project_file.name}")
                
                with open(project_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Simple chunking: split by paragraphs
                chunks = [p.strip() for p in content.split('\n\n') if p.strip()]
                
                for chunk in chunks:
                    if len(chunk) > 50:  # Only add meaningful chunks
                        embedding = embedding_model.encode(chunk).tolist()
                        
                        collection.add(
                            ids=[f"doc_{document_id}"],
                            embeddings=[embedding],
                            documents=[chunk],
                            metadatas=[{
                                "source": project_file.name,
                                "type": "project",
                                "project_id": project_file.stem
                            }]
                        )
                        document_id += 1
                        total_chunks += 1
        
        print(f"✓ Successfully ingested {total_chunks} chunks from {len(list(projects_folder.glob('*.md')))} project files")
        
        return {
            "status": "success",
            "message": f"Vector store rebuilt with {total_chunks} document chunks",
            "projects_processed": len(list(projects_folder.glob("*.md")))
        }
        
    except Exception as e:
        print(f"❌ Error during reingest: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

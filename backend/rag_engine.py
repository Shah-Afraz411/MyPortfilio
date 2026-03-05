"""
RAG Engine for Portfolio Assistant
Handles document retrieval from ChromaDB vector store and provides
helper functions for querying portfolio data.

Uses a local Hugging Face model for LLM-powered answer generation.
"""

import os
from pathlib import Path
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Using Google Gemini API (free tier)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = "gemini-2.5-flash"  # Free tier model

# Configuration
CHROMA_DB_DIR = Path(__file__).parent / "chroma_db"
COLLECTION_NAME = "portfolio_data"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

# Global model instances (loaded once for efficiency)
_embedding_model: Optional[SentenceTransformer] = None
_chroma_client: Optional[chromadb.PersistentClient] = None
_collection = None
_gemini_model = None


def initialize_rag_engine(force_reingest=False):
    """
    Initialize the RAG engine by loading the embedding model,
    configuring Gemini API, and connecting to ChromaDB.
    
    Args:
        force_reingest: If True, delete existing vector store and recreate
    """
    global _embedding_model, _chroma_client, _collection, _gemini_model
    
    # Force recreate if flag is set
    if force_reingest and CHROMA_DB_DIR.exists():
        print("🔄 Force re-ingesting data - deleting existing vector store...")
        import shutil
        shutil.rmtree(CHROMA_DB_DIR)
        print("✓ Deleted existing vector store")
    
    if _embedding_model is None:
        print("🤖 Loading embedding model...")
        _embedding_model = SentenceTransformer(EMBEDDING_MODEL)
        print("✓ Embedding model loaded")
    
    if _gemini_model is None and GEMINI_API_KEY:
        print("🧠 Configuring Gemini API...")
        genai.configure(api_key=GEMINI_API_KEY)
        _gemini_model = genai.GenerativeModel(GEMINI_MODEL)
        print("✓ Gemini API configured")
    
    if _chroma_client is None:
        print("🔧 Connecting to ChromaDB...")
        _chroma_client = chromadb.PersistentClient(
            path=str(CHROMA_DB_DIR),
            settings=Settings(anonymized_telemetry=False)
        )
        
        try:
            _collection = _chroma_client.get_collection(name=COLLECTION_NAME)
            print(f"✓ Connected to collection: {COLLECTION_NAME}")
        except Exception as e:
            print(f"⚠️  Warning: Could not connect to collection: {e}")
            print("   Call /admin/reingest endpoint to create the vector store")
            _collection = None
    
    # Use root data folder, not backend/data
    backend_dir = Path(__file__).resolve().parent
    data_folder = backend_dir.parent / "data"  # Goes up to project root, then into data
    
    print(f"📁 Looking for data in: {data_folder}")


def get_relevant_docs(query: str, top_k: int = 3) -> List[Dict[str, Any]]:
    """
    Retrieve the most relevant documents for a given query.
    
    Args:
        query: The search query string
        top_k: Number of top results to return (default: 3)
        
    Returns:
        List of dictionaries containing:
        - content: The document text
        - metadata: Document metadata (source, type, etc.)
        - distance: Similarity distance (lower is better)
    
    Example:
        >>> docs = get_relevant_docs("Tell me about your AI projects", top_k=3)
        >>> for doc in docs:
        ...     print(f"Source: {doc['metadata']['source']}")
        ...     print(f"Content: {doc['content'][:100]}...")
    """
    global _embedding_model, _collection
    
    # Initialize if not already done
    if _embedding_model is None or _collection is None:
        initialize_rag_engine()
    
    # If collection is still None, return empty results
    if _collection is None:
        print("⚠️  Vector store not available")
        return []
    
    try:
        # Generate query embedding
        query_embedding = _embedding_model.encode(query).tolist()
        
        # Query ChromaDB
        results = _collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )
        
        # Format results
        documents = []
        if results['documents'] and len(results['documents'][0]) > 0:
            for idx in range(len(results['documents'][0])):
                doc = {
                    'content': results['documents'][0][idx],
                    'metadata': results['metadatas'][0][idx],
                    'distance': results['distances'][0][idx] if 'distances' in results else None
                }
                documents.append(doc)
        
        return documents
        
    except Exception as e:
        print(f"Error during retrieval: {e}")
        return []


def get_docs_by_type(doc_type: str, limit: int = 10) -> List[Dict[str, Any]]:
    """
    Retrieve documents by type (e.g., 'project', 'skills', 'timeline').
    
    Args:
        doc_type: Type of documents to retrieve
        limit: Maximum number of documents to return
        
    Returns:
        List of documents matching the type
    """
    global _collection
    
    if _collection is None:
        initialize_rag_engine()
    
    if _collection is None:
        return []
    
    try:
        results = _collection.get(
            where={"type": doc_type},
            limit=limit
        )
        
        documents = []
        if results['documents']:
            for idx in range(len(results['documents'])):
                doc = {
                    'content': results['documents'][idx],
                    'metadata': results['metadatas'][idx]
                }
                documents.append(doc)
        
        return documents
        
    except Exception as e:
        print(f"Error retrieving documents by type: {e}")
        return []


def search_by_metadata(metadata_filters: Dict[str, Any], limit: int = 10) -> List[Dict[str, Any]]:
    """
    Search documents using metadata filters.
    
    Args:
        metadata_filters: Dictionary of metadata key-value pairs to filter by
        limit: Maximum number of documents to return
        
    Returns:
        List of matching documents
        
    Example:
        >>> docs = search_by_metadata({"type": "project", "source": "ai_portfolio.md"})
    """
    global _collection
    
    if _collection is None:
        initialize_rag_engine()
    
    if _collection is None:
        return []
    
    try:
        results = _collection.get(
            where=metadata_filters,
            limit=limit
        )
        
        documents = []
        if results['documents']:
            for idx in range(len(results['documents'])):
                doc = {
                    'content': results['documents'][idx],
                    'metadata': results['metadatas'][idx]
                }
                documents.append(doc)
        
        return documents
        
    except Exception as e:
        print(f"Error searching by metadata: {e}")
        return []


def format_docs_for_context(docs: List[Dict[str, Any]], max_length: int = 2000) -> str:
    """
    Format retrieved documents into a single context string for LLM prompting.
    
    Args:
        docs: List of documents from get_relevant_docs()
        max_length: Maximum character length for the context
        
    Returns:
        Formatted context string
    """
    if not docs:
        return "No relevant information found."
    
    context_parts = []
    total_length = 0
    
    for idx, doc in enumerate(docs, 1):
        source = doc['metadata'].get('source', 'Unknown')
        content = doc['content']
        
        # Add document with source attribution
        doc_text = f"[Source: {source}]\n{content}\n"
        
        # Check length limit
        if total_length + len(doc_text) > max_length:
            # Truncate content to fit
            remaining = max_length - total_length
            if remaining > 100:  # Only add if there's meaningful space
                doc_text = doc_text[:remaining] + "...\n"
                context_parts.append(doc_text)
            break
        
        context_parts.append(doc_text)
        total_length += len(doc_text)
    
    return "\n".join(context_parts)


def get_collection_stats() -> Dict[str, Any]:
    """
    Get statistics about the vector store collection.
    
    Returns:
        Dictionary with collection statistics
    """
    global _collection
    
    if _collection is None:
        initialize_rag_engine()
    
    if _collection is None:
        return {"error": "Collection not available"}
    
    try:
        count = _collection.count()
        
        # Get sample of documents to analyze types
        sample = _collection.get(limit=100)
        types = {}
        if sample['metadatas']:
            for metadata in sample['metadatas']:
                doc_type = metadata.get('type', 'unknown')
                types[doc_type] = types.get(doc_type, 0) + 1
        
        return {
            "total_documents": count,
            "document_types": types,
            "collection_name": COLLECTION_NAME,
            "embedding_model": EMBEDDING_MODEL
        }
        
    except Exception as e:
        return {"error": str(e)}


# ============================================================================
# LLM Integration - Hugging Face Inference API
# ============================================================================

async def call_gemini_api(prompt: str) -> str:
    """
    Call Google Gemini API with the given prompt.
    
    Args:
        prompt: The prompt to send to the model
        
    Returns:
        Generated text from the model
    """
    global _gemini_model
    
    # Initialize if not already done
    if _gemini_model is None:
        initialize_rag_engine()
    
    if not GEMINI_API_KEY:
        return "Gemini API key not configured. Please add GEMINI_API_KEY to your .env file."
    
    try:
        print("🧠 Calling Gemini API...")
        
        # Generate response
        response = _gemini_model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                top_p=0.9,
                top_k=40,
                max_output_tokens=2048,
            )
        )
        
        # Extract text from response
        if response.text:
            print("✅ Gemini response received")
            return response.text.strip()
        else:
            return "No response generated from Gemini API."
        
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return f"An error occurred while generating the response: {str(e)}"


def generate_fallback_answer(query: str, docs: List[Dict[str, Any]]) -> str:
    """
    Generate a contextual answer from retrieved documents without LLM.
    Used as fallback when LLM is unavailable.
    """
    if not docs:
        return "I don't have enough information to answer that question. Could you ask about my projects, skills, or experience?"
    
    # Extract key information from documents
    answer_parts = []
    answer_parts.append("Based on the portfolio information, here's what I found:\n")
    
    for i, doc in enumerate(docs, 1):
        source = doc['metadata'].get('source', 'Unknown')
        content = doc['content'][:300]  # Get snippet
        
        # Clean up the content
        content = content.replace('\n', ' ').strip()
        if len(content) > 200:
            content = content[:200] + "..."
        
        answer_parts.append(f"{i}. From {source}: {content}")
    
    return "\n\n".join(answer_parts)


async def generate_answer(query: str, docs: List[Dict[str, Any]]) -> str:
    """
    Generate a natural language answer using retrieved documents and LLM.
    
    Args:
        query: The user's question
        docs: List of retrieved documents from vector store
        
    Returns:
        AI-generated answer based on the context
    """
    if not docs:
        return "I don't have enough information to answer that question. Could you ask about my projects, skills, or experience?"
    
    # Format context from retrieved documents
    context_parts = []
    for doc in docs:
        content = doc['content'][:1500]
        context_parts.append(content)
    
    context = "\n\n".join(context_parts)
    
    # Create prompt optimized for Gemini
    prompt = f"""You are a helpful AI assistant answering questions about a person's professional portfolio. 
Use the provided context to give accurate, conversational, and engaging answers. 
Highlight achievements and provide specific details when available.

Context:
{context}

Question: {query}

Provide a clear, professional, and conversational answer:"""
    
    # Call Gemini API
    print(f"🤖 Calling Gemini API with prompt length: {len(prompt)}")
    answer = await call_gemini_api(prompt)
    print(f"✅ Gemini response: {answer[:100]}...")
    
    return answer


async def generate_answer_with_sources(query: str, docs: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Generate answer with source attribution.
    
    Args:
        query: The user's question
        docs: Retrieved documents
        
    Returns:
        Dictionary with answer and sources
    """
    answer = await generate_answer(query, docs)
    sources = [doc['metadata']['source'] for doc in docs]
    
    return {
        "answer": answer,
        "sources": sources
    }


# Initialize on module import (optional - can also be called explicitly)
# initialize_rag_engine()

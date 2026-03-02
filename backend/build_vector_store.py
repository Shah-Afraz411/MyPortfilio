"""
Build Vector Store for RAG
Loads all portfolio data (markdown, JSON, YAML) and creates embeddings
using sentence-transformers, storing them in ChromaDB for retrieval.

Usage:
    python build_vector_store.py
"""

import os
import json
import yaml
import warnings
from pathlib import Path
from typing import List, Dict, Any
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

# Suppress warnings
warnings.filterwarnings('ignore', category=UserWarning)
warnings.filterwarnings('ignore', category=FutureWarning)

# Disable ChromaDB telemetry
os.environ['ANONYMIZED_TELEMETRY'] = 'False'

# Configuration
DATA_DIR = Path(__file__).parent.parent / "data"
CHROMA_DB_DIR = Path(__file__).parent / "chroma_db"
COLLECTION_NAME = "portfolio_data"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"


def load_markdown_files(projects_dir: Path) -> List[Dict[str, Any]]:
    """
    Load all markdown files from the projects directory.
    
    Args:
        projects_dir: Path to the projects directory
        
    Returns:
        List of documents with content and metadata
    """
    documents = []
    
    if not projects_dir.exists():
        print(f"Warning: Projects directory not found: {projects_dir}")
        return documents
    
    for md_file in projects_dir.glob("*.md"):
        try:
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            documents.append({
                "content": content,
                "metadata": {
                    "source": str(md_file.name),
                    "type": "project",
                    "path": str(md_file)
                }
            })
            print(f"✓ Loaded: {md_file.name}")
            
        except Exception as e:
            print(f"✗ Error loading {md_file.name}: {e}")
    
    return documents


def load_yaml_file(yaml_path: Path) -> List[Dict[str, Any]]:
    """
    Load and parse YAML file (skills).
    
    Args:
        yaml_path: Path to the YAML file
        
    Returns:
        List of documents with content and metadata
    """
    documents = []
    
    if not yaml_path.exists():
        print(f"Warning: YAML file not found: {yaml_path}")
        return documents
    
    try:
        with open(yaml_path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
        
        # Convert YAML data to text format for embedding
        content = yaml.dump(data, default_flow_style=False)
        
        documents.append({
            "content": content,
            "metadata": {
                "source": yaml_path.name,
                "type": "skills",
                "path": str(yaml_path)
            }
        })
        print(f"✓ Loaded: {yaml_path.name}")
        
    except Exception as e:
        print(f"✗ Error loading {yaml_path.name}: {e}")
    
    return documents


def load_json_file(json_path: Path) -> List[Dict[str, Any]]:
    """
    Load and parse JSON file (timeline).
    
    Args:
        json_path: Path to the JSON file
        
    Returns:
        List of documents with content and metadata
    """
    documents = []
    
    if not json_path.exists():
        print(f"Warning: JSON file not found: {json_path}")
        return documents
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Convert JSON data to text format for embedding
        # Each timeline entry becomes a separate document
        if isinstance(data, list):
            for idx, entry in enumerate(data):
                content = json.dumps(entry, indent=2)
                documents.append({
                    "content": content,
                    "metadata": {
                        "source": f"{json_path.name}_entry_{idx}",
                        "type": "timeline",
                        "path": str(json_path),
                        "index": idx
                    }
                })
        else:
            content = json.dumps(data, indent=2)
            documents.append({
                "content": content,
                "metadata": {
                    "source": json_path.name,
                    "type": "timeline",
                    "path": str(json_path)
                }
            })
        
        print(f"✓ Loaded: {json_path.name}")
        
    except Exception as e:
        print(f"✗ Error loading {json_path.name}: {e}")
    
    return documents


def load_all_documents() -> List[Dict[str, Any]]:
    """
    Load all documents from the data directory.
    
    Returns:
        List of all documents with content and metadata
    """
    print("\n📂 Loading documents from data directory...")
    print(f"Data directory: {DATA_DIR}\n")
    
    all_documents = []
    
    # Load markdown project files
    projects_dir = DATA_DIR / "projects"
    all_documents.extend(load_markdown_files(projects_dir))
    
    # Load skills YAML
    skills_path = DATA_DIR / "skills.yaml"
    all_documents.extend(load_yaml_file(skills_path))
    
    # Load timeline JSON
    timeline_path = DATA_DIR / "timeline.json"
    all_documents.extend(load_json_file(timeline_path))
    
    print(f"\n📊 Total documents loaded: {len(all_documents)}")
    return all_documents


def build_vector_store(documents: List[Dict[str, Any]]):
    """
    Build the vector store using sentence-transformers and ChromaDB.
    
    Args:
        documents: List of documents to embed and store
        
    Returns:
        Tuple of (client, collection, model) for reuse in testing
    """
    if not documents:
        print("\n⚠️  No documents to process. Exiting.")
        return None, None, None
    
    print("\n🤖 Initializing embedding model...")
    print(f"Model: {EMBEDDING_MODEL}")
    
    # Load the embedding model
    model = SentenceTransformer(EMBEDDING_MODEL)
    
    print("\n🔧 Setting up ChromaDB...")
    
    # Create ChromaDB client with telemetry disabled
    client = chromadb.PersistentClient(
        path=str(CHROMA_DB_DIR),
        settings=Settings(
            anonymized_telemetry=False,
            allow_reset=True
        )
    )
    
    # Delete existing collection if it exists
    try:
        client.delete_collection(name=COLLECTION_NAME)
        print(f"✓ Deleted existing collection: {COLLECTION_NAME}")
    except:
        pass
    
    # Create new collection
    collection = client.create_collection(
        name=COLLECTION_NAME,
        metadata={"description": "Portfolio data embeddings"}
    )
    print(f"✓ Created collection: {COLLECTION_NAME}")
    
    print("\n🔄 Generating embeddings and storing documents...")
    
    # Prepare data for ChromaDB
    ids = []
    embeddings = []
    metadatas = []
    documents_text = []
    
    for idx, doc in enumerate(documents):
        # Generate unique ID
        doc_id = f"doc_{idx}"
        ids.append(doc_id)
        
        # Generate embedding
        embedding = model.encode(doc["content"]).tolist()
        embeddings.append(embedding)
        
        # Store metadata and content
        metadatas.append(doc["metadata"])
        documents_text.append(doc["content"])
        
        print(f"✓ Processed: {doc['metadata']['source']}")
    
    # Add to ChromaDB collection
    collection.add(
        ids=ids,
        embeddings=embeddings,
        metadatas=metadatas,
        documents=documents_text
    )
    
    print(f"\n✅ Successfully built vector store!")
    print(f"   Location: {CHROMA_DB_DIR}")
    print(f"   Collection: {COLLECTION_NAME}")
    print(f"   Total documents: {len(documents)}")
    
    # Return client, collection, and model for reuse
    return client, collection, model


def test_retrieval(client, collection, model):
    """
    Test the vector store by performing a sample query.
    Uses the existing client, collection, and model to avoid recreation.
    
    Args:
        client: ChromaDB client
        collection: ChromaDB collection
        model: SentenceTransformer model
    """
    print("\n🧪 Testing retrieval with sample query...")
    
    if client is None or collection is None or model is None:
        print("⚠️  Skipping test - vector store not initialized")
        return
    
    # Test query
    test_query = "Tell me about my AI projects"
    print(f"Query: '{test_query}'")
    
    # Generate query embedding
    query_embedding = model.encode(test_query).tolist()
    
    # Search
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=3
    )
    
    print("\n📋 Top 3 results:")
    for idx, (doc, metadata) in enumerate(zip(results['documents'][0], results['metadatas'][0]), 1):
        print(f"\n{idx}. Source: {metadata['source']}")
        print(f"   Type: {metadata['type']}")
        print(f"   Preview: {doc[:150]}...")
    
    print("\n✅ Retrieval test complete!")


def main():
    """
    Main function to build the vector store.
    """
    print("=" * 60)
    print("  Portfolio Vector Store Builder")
    print("=" * 60)
    
    # Load all documents
    documents = load_all_documents()
    
    # Build vector store and get client, collection, model
    client, collection, model = build_vector_store(documents)
    
    # Test retrieval using the same client, collection, and model
    if documents and client is not None:
        test_retrieval(client, collection, model)
    
    print("\n" + "=" * 60)
    print("  Build Complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()

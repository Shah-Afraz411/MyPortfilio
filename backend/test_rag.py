"""
Test script for RAG engine
Demonstrates how to use the RAG functions to retrieve documents
"""

from rag_engine import (
    initialize_rag_engine,
    get_relevant_docs,
    get_docs_by_type,
    get_collection_stats,
    format_docs_for_context
)

def main():
    print("=" * 60)
    print("  RAG Engine Test")
    print("=" * 60)
    
    # Initialize the RAG engine
    print("\n1. Initializing RAG engine...")
    initialize_rag_engine()
    
    # Get collection stats
    print("\n2. Collection Statistics:")
    stats = get_collection_stats()
    for key, value in stats.items():
        print(f"   {key}: {value}")
    
    # Test semantic search
    print("\n3. Testing semantic search:")
    test_queries = [
        "Tell me about your AI projects",
        "What are your skills?",
        "What did you work on recently?"
    ]
    
    for query in test_queries:
        print(f"\n   Query: '{query}'")
        docs = get_relevant_docs(query, top_k=2)
        
        if docs:
            for idx, doc in enumerate(docs, 1):
                print(f"\n   Result {idx}:")
                print(f"   - Source: {doc['metadata']['source']}")
                print(f"   - Type: {doc['metadata']['type']}")
                print(f"   - Distance: {doc['distance']:.4f}" if doc['distance'] else "")
                print(f"   - Preview: {doc['content'][:100]}...")
        else:
            print("   No results found")
    
    # Test filtering by type
    print("\n4. Testing document retrieval by type:")
    for doc_type in ['project', 'skills', 'timeline']:
        docs = get_docs_by_type(doc_type, limit=5)
        print(f"   {doc_type}: {len(docs)} documents")
    
    # Test context formatting
    print("\n5. Testing context formatting:")
    query = "What AI projects have you built?"
    docs = get_relevant_docs(query, top_k=3)
    context = format_docs_for_context(docs, max_length=500)
    print(f"   Formatted context ({len(context)} chars):")
    print(f"   {context[:200]}...")
    
    print("\n" + "=" * 60)
    print("  Test Complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()

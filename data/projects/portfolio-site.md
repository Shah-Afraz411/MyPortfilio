# AI Portfolio Website

## Overview
A modern, AI-powered portfolio website built with Next.js and FastAPI. Features horizontal scrolling, smooth animations, and an intelligent chatbot that can answer questions about my work using RAG (Retrieval-Augmented Generation) technology.

## Technologies Used
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Animation**: Framer Motion for smooth transitions and interactions
- **Backend**: FastAPI, Python 3.11
- **AI/ML**: Google Gemini API, Sentence Transformers
- **Vector Database**: ChromaDB for semantic search
- **Architecture**: RAG (Retrieval-Augmented Generation)

## Key Features
1. **Horizontal Scrolling Interface**: Unique card-based layout with smooth horizontal navigation
2. **AI Chatbot**: Intelligent assistant powered by RAG that can answer questions about projects and experience
3. **Project Scoped Chat**: Users can ask specific questions about individual projects
4. **Dark Mode Support**: Seamless theme switching with system preference detection
5. **Custom Cursor Follower**: Interactive blue circle that follows mouse movement
6. **Responsive Design**: Fully optimized for desktop and mobile devices
7. **Smooth Animations**: Powered by Framer Motion and Lenis smooth scroll

## Technical Implementation

### Frontend Architecture
- Built with Next.js App Router for optimal performance
- Uses Framer Motion for declarative animations
- Implements Lenis for buttery-smooth horizontal scrolling
- Custom cursor tracking with spring physics
- Progress indicator showing scroll position

### Backend Architecture
- FastAPI server handling chat requests
- ChromaDB vector database for storing embedded documents
- Sentence Transformers for generating embeddings
- Google Gemini API for natural language generation
- Project-scoped chat functionality using context filtering

### RAG Implementation
1. Documents are chunked and embedded using sentence-transformers
2. User queries are embedded and matched against the vector database
3. Relevant context is retrieved and passed to Gemini
4. Gemini generates contextual responses based on retrieved information

## Challenges Solved
1. **Horizontal Scroll Performance**: Optimized with GPU acceleration and will-change properties
2. **RAG Context Relevance**: Fine-tuned embedding model and chunk sizes for better retrieval
3. **Smooth Animations**: Balanced performance with visual appeal using requestAnimationFrame
4. **Project Scoping**: Implemented content filtering to ensure chatbot only uses project-specific data

## Results
- Fast load times with optimized bundle size
- Smooth 60fps animations throughout
- Accurate and contextual AI responses
- Unique user experience with horizontal scrolling
- Clean, minimal design inspired by modern portfolio sites

## Future Enhancements
- Add more interactive visualizations
- Implement voice-based queries
- Add project filtering by technology
- Create case study deep-dives for each project

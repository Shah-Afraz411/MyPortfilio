# Law Autocomplete Service

## Overview
An intelligent, domain-aware, real-time autocomplete microservice for legal search inputs, oriented towards German/EU law and easily extendable to other domains. Features a FastAPI backend with pluggable LLM engine (Google Vertex AI Gemini), a Streamlit real-time frontend, Docker containerization, and a clean modular architecture designed for integration into larger legal assistance platforms.

## Technologies Used
- Python 3.11+
- FastAPI for async backend API
- Streamlit for real-time frontend UI
- Google Vertex AI Gemini for LLM integration
- Docker & Docker Compose for containerization
- Pytest for async testing
- Pydantic for request/response schemas

## Key Features
1. Real-time autocomplete suggestions with per-keystroke updates (debounced at 250ms)
2. Legal domain bias with category tagging (German BGB / Residence Act categories)
3. Pluggable LLM engine with graceful local mock fallback when LLM is disabled
4. Multi-language output support (EN, DE, FR, ES, IT configurable)
5. Dockerized backend and frontend with docker-compose orchestration
6. Singleton model pattern with warm-up on startup for low latency
7. Clean service layer architecture with separated prompts, schemas, and services
8. Category normalization with "Other (Misc.)" fallback

## Technical Implementation

### Architecture
- Streamlit UI → FastAPI API (POST /api/v1/autocomplete) → AutocompleteService → Vertex AI / Mock fallback
- Singleton pattern ensures model loads once and warms on startup
- Dependency injection via FastAPI Depends for clean service access
- Prompt isolation layer for easy customization of LLM instructions

### Backend (FastAPI)
- Async API with clean Pydantic response models
- Health check endpoint for monitoring
- Stub auth middleware (JWT/OAuth2 ready)
- Configurable via .env environment variables (APP_ENV, LOG_LEVEL, ENABLE_VERTEX, etc.)

### Frontend (Streamlit)
- Real-time suggestions without Enter key or submit button
- Debounced API calls to reduce LLM spend and latency
- Clickable suggestions that adopt text instantly
- Configurable sidebar for debounce timing and min chars

### Testing & Deployment
- Pytest async test scaffold included
- Docker backend and frontend Dockerfiles
- Docker Compose for one-command deployment
- .env.example for easy configuration

## Challenges Solved
- Designed debounced real-time autocomplete to minimize LLM API costs while maintaining responsiveness
- Built graceful fallback system with deterministic mock suggestions when LLM credentials are unavailable
- Implemented clean service abstraction allowing easy swap between LLM providers
- Created category normalization logic for consistent legal domain tagging
- Architected extensible codebase ready for production hardening (rate limiting, JWT auth, Redis caching)

## Results
- Fully functional real-time legal autocomplete with sub-second response times
- Complete Docker deployment with backend and frontend containers
- Modular architecture supporting multiple LLM backends
- Clean API with Swagger documentation at /docs
- Extensible design ready for integration into larger legal platforms

## Links
- GitHub: https://github.com/Shah-Afraz411/Law_Autocomplete_Service

## Year
2025

## Learnings
- Building production-ready microservices with FastAPI
- LLM integration patterns with fallback strategies
- Real-time UI development with Streamlit
- Docker containerization and compose orchestration
- Clean architecture principles for AI-powered services
- Domain-specific NLP application design

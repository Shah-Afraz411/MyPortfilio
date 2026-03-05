
## ⚠️ IMPORTANT: Rebuilding the Vector Store

The RAG system uses a **persistent vector database** stored in `backend/chroma_db/`. When you add or update project files, you MUST rebuild the vector store for the chatbot to see the changes.

### 🔄 How to Rebuild the Vector Store

-  Stop backend with Ctrl + C
-  Delete Chroma_db folder in the backend
-  Run "Python build_vector_store.py"
-  All done!

### 📊 Check Vector Store Status

```bash
# Visit this endpoint to see how many documents are stored
curl http://localhost:8000/stats

# Or in browser: http://localhost:8000/stats
```

**Expected response:**
```json
{
  "total_documents": 45,
  "document_types": {
    "project": 45
  },
  "collection_name": "portfolio_data",
  "embedding_model": "sentence-transformers/all-MiniLM-L6-v2"
}
```

---

## 🚀 Adding New Projects

### Step 1: Create Project Markdown File

**Location**: `data/projects/YOUR-PROJECT-ID.md`

**File naming**: Use lowercase with hyphens (e.g., `ai-portfolio.md`, `ecommerce-app.md`)

**Template**:
```markdown
# Project Title

## Overview
Brief description of what the project does and its purpose.

## Technologies Used
- Technology 1
- Technology 2
- Technology 3

## Key Features
1. Feature one with description
2. Feature two with description
3. Feature three with description

## Technical Implementation
Detailed explanation of how you built it, architecture decisions, etc.

## Challenges Solved
Problems you encountered and how you solved them.

## Results
Impact, metrics, achievements, or outcomes.
```

### Step 2: Add Project Image

**Location**: `frontend/public/projects/YOUR-PROJECT-ID.jpg` (or .svg, .png)

**Recommended sizes:**
- JPG/PNG: 1200x675px (16:9 aspect ratio)
- SVG: Any size (will scale automatically)

**Quick placeholder SVG:**
```xml
<svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#60A5FA;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#grad)"/>
  <text x="600" y="337" font-family="Arial" font-size="48" fill="white" text-anchor="middle">Your Project Name</text>
</svg>
```

### Step 3: Update Frontend Project List

**Location**: `frontend/components/cards/projects-card.tsx`

**Add your project:**
```tsx
const projects = [
  // ...existing projects...
  {
    id: "your-project-id",           // MUST match your-project-id.md filename
    title: "Your Project Name",
    description: "Brief description shown in card",
    longDescription: "Longer description shown in modal",
    technologies: ["Tech1", "Tech2", "Tech3"],
    image: "/projects/your-project-id.jpg",  // Path to your image
    demoUrl: "https://your-demo.com",         // Optional
    githubUrl: "https://github.com/you/project"  // Optional
  }
];
```

### Step 4: Rebuild Vector Store ⚠️ CRITICAL

  ## As Told in the beginning of the guide

## 🔄 Complete Update Workflow

### When Adding a New Project:

1. ✅ Create `data/projects/project-id.md` with full details
2. ✅ Add image to `frontend/public/projects/project-id.jpg`
3. ✅ Update `frontend/components/cards/projects-card.tsx` - add to projects array
4. ✅ Rebuild Vector Store
5. ✅ Test: Click on project → Chat should work with project context

### When Updating Existing Project:

1. ✅ Edit `data/projects/project-id.md`
2. ✅ Rebuild Vector Store
3. ✅ (Optional) Update frontend if changing title/description
4. ✅ Test the changes

### When Just Updating UI (No Content Changes):

1. ✅ Edit `frontend/components/cards/projects-card.tsx`
2. ✅ Change image, title, description, links
3. ❌ **No rebuild needed** - just refresh browser

---

## 🧪 Testing Your Changes

### Verify Vector Store Was Rebuilt:

```bash
# Check number of documents
curl http://localhost:8000/stats

# Should show increased total_documents after adding projects
```

### Test Project Scoped Chat:

1. Ensure backend is running: `cd backend && uvicorn main:main --reload`
2. Start frontend: `cd frontend && npm run dev`
3. Click on your new project
4. Type: "What technologies were used?"
5. Verify it responds with info from your markdown file

### Test General Chat:

1. Click "AI Assistant" card
2. Ask: "Tell me about your projects"
3. Should mention all your projects including the new one

---

## 🐛 Troubleshooting

### Chatbot doesn't know about new project:

 ## Rebuild Vector Store 
```bash
# Check it worked:
curl http://localhost:8000/stats
# total_documents should have increased
```

### Project image not showing:
- ✅ Check file exists in `frontend/public/projects/`
- ✅ Verify path in projects array matches actual filename
- ✅ Try hard refresh (Ctrl+Shift+R)

### "Project not found" in chat:
- ✅ Check project ID in `projects-card.tsx` matches `project-id.md` filename exactly
- ✅ Verify markdown file exists in `data/projects/`
- ✅ Rebuild vector store

### Rebuild endpoint returns error:
- ✅ Stop and restart backend server
- ✅ Check `data/projects/` folder has `.md` files
- ✅ Verify Gemini API key is set in `.env`

---

## 🎉 Quick Reference

| Action | Files to Change | Rebuild Store? | Command |
|--------|----------------|----------------|---------|
| Add Project | 1. Create `data/projects/id.md`<br>2. Add image to `public/projects/`<br>3. Update `projects-card.tsx` | **YES** | `curl -X POST localhost:8000/admin/reingest` |
| Update Project Content | Edit `data/projects/id.md` | **YES** | `curl -X POST localhost:8000/admin/reingest` |
| Update Project UI Only | Edit `projects-card.tsx` | **NO** | Just refresh browser |
| Change Project Image | Replace file in `public/projects/` | **NO** | Just refresh browser |
| Add Skill | Edit `data/skills.yaml` | No | N/A |

---


**Remember: Anytime you change content in `data/projects/`, call the rebuild endpoint!** 🔄



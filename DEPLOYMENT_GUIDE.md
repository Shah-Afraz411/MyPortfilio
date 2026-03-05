# Deployment Guide - AI Portfolio

This guide walks you through deploying your portfolio with:

- **Frontend (Next.js)** → **Vercel** (free tier)  
- **Backend (FastAPI)** → **Render** (free tier)  
- **CI/CD** → **GitHub Actions** (on `deployment` branch)

---

## Architecture Overview

```
GitHub Repo
  ├── development branch   ← active development
  └── deployment branch    ← triggers CI/CD (PRs from development)
          │
          ├── GitHub Actions CI/CD
          │     ├── Lint & test backend (Python)
          │     ├── Lint & build frontend (Next.js)
          │     ├── Deploy backend → Render
          │     └── Deploy frontend → Vercel
          │
          ├── Vercel (Frontend)
          │     └── https://your-portfolio.vercel.app
          │
          └── Render (Backend)
                └── https://your-backend.onrender.com
```

---

## Step 1: Push to GitHub

### 1.1 Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `MyPortfolio` (or your preferred name)
3. Set it to **Public** or **Private**
4. Do **NOT** initialize with README (you already have one)

### 1.2 Push Your Code

```powershell
# Navigate to your project
cd C:\Users\syeda\OneDrive\Documents\repos\MyPortfilio

# Initialize git (if not already done)
git init

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/MyPortfolio.git

# Stage all files
git add .

# Commit
git commit -m "Initial commit - Portfolio v1.0"

# Push to development
git branch -M development
git push -u origin development
```

### 1.3 Create Deployment Branch

```powershell
# Create and push deployment branch
git checkout -b deployment
git push -u origin deployment

# Switch back to development
git checkout development
```

---

## Step 2: Deploy Backend on Render

### 2.1 Create Render Account

1. Go to [render.com](https://render.com) and sign up (free)
2. Connect your GitHub account

### 2.2 Create Web Service

1. Click **"New"** → **"Web Service"**
2. Connect your **MyPortfolio** GitHub repo
3. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `portfolio-backend` |
| **Region** | Oregon (US West) |
| **Branch** | `deployment` |
| **Runtime** | Python 3 |
| **Build Command** | `cd backend && pip install -r requirements.txt` |
| **Start Command** | `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Plan** | Free |

### 2.3 Set Environment Variables

In the Render dashboard, go to **Environment** and add:

| Key | Value |
|-----|-------|
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `ALLOWED_ORIGINS` | `https://your-portfolio.vercel.app` (set after Vercel deploy) |
| `FORCE_REINGEST` | `true` |
| `PYTHON_VERSION` | `3.12.0` |

### 2.4 Get Deploy Hook

1. In Render dashboard → your service → **Settings**
2. Scroll to **"Deploy Hook"**
3. Copy the URL — you'll need it for GitHub Secrets

> **Note**: The Render free tier spins down after 15 minutes of inactivity. First requests after idle may take ~30 seconds.

---

## Step 3: Deploy Frontend on Vercel

### 3.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **"Add New Project"**

### 3.2 Import and Configure

1. Import your **MyPortfolio** repository
2. Configure the project:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Node.js Version** | 20.x |

### 3.3 Set Environment Variables

In Vercel project settings → **Environment Variables**:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://portfolio-backend.onrender.com` (your Render URL) |

### 3.4 Configure Production Branch

1. Go to Vercel → Project → **Settings** → **Git**
2. Set **Production Branch** to `deployment`

### 3.5 Get Vercel Tokens (for CI/CD)

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Create a new token → copy it (this is `VERCEL_TOKEN`)
3. Run locally to get project IDs:

```powershell
# Install Vercel CLI
npm i -g vercel

# Link your project (run from the frontend folder)
cd frontend
vercel link

# This creates .vercel/project.json with orgId and projectId
cat .vercel/project.json
```

The JSON will contain:
- `orgId` → this is `VERCEL_ORG_ID`
- `projectId` → this is `VERCEL_PROJECT_ID`

---

## Step 4: Configure GitHub Secrets

Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets:

| Secret Name | Value | Used For |
|-------------|-------|----------|
| `GEMINI_API_KEY` | Your Gemini API key | Backend tests |
| `RENDER_DEPLOY_HOOK_BACKEND` | Render deploy hook URL | Triggering backend deploy |
| `VERCEL_TOKEN` | Vercel personal token | Deploying frontend |
| `VERCEL_ORG_ID` | From `.vercel/project.json` | Vercel project scope |
| `VERCEL_PROJECT_ID` | From `.vercel/project.json` | Vercel project target |
| `BACKEND_URL` | `https://portfolio-backend.onrender.com` | Frontend build env |

---

## Step 5: CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) is already configured. Here's what it does:

### On Pull Request to `deployment`:
- **Backend**: Lints Python code with Ruff, runs tests
- **Frontend**: Lints, type-checks, and builds Next.js

### On Push to `deployment`:
- Runs all checks above, **plus**:
- **Backend**: Triggers Render deploy via webhook
- **Frontend**: Deploys to Vercel production via CLI

### Deployment Workflow

```
development ──PR──► deployment (production)
                        │
                        ├── ✅ Backend lint + test
                        ├── ✅ Frontend lint + build
                        ├── 🚀 Deploy backend → Render
                        └── 🚀 Deploy frontend → Vercel
```

---

## Step 6: Deploy!

### First Deployment

```powershell
# Make sure you're on development
git checkout development

# Merge into deployment
git checkout deployment
git merge development

# Push to trigger CI/CD
git push origin deployment
```

### Subsequent Deployments

```powershell
# After making changes on development
git checkout development
git add .
git commit -m "Your changes"
git push origin development

# When ready to deploy, create a PR from development → deployment on GitHub
# Or merge locally:
git checkout deployment
git merge development
git push origin deployment

# Go back to development
git checkout development
```

---

## Step 7: Update CORS After Deploy

Once both services are live, update `ALLOWED_ORIGINS` on Render:

1. Go to Render dashboard → your service → **Environment**
2. Set `ALLOWED_ORIGINS` = `https://your-portfolio.vercel.app`
3. Click **Save Changes** (triggers redeploy)

---

## Troubleshooting

### Backend won't start on Render
- Check **Logs** in Render dashboard
- Ensure `GEMINI_API_KEY` is set correctly
- Verify `FORCE_REINGEST=true` for first deploy (rebuilds vector store)

### Frontend can't reach backend
- Verify `NEXT_PUBLIC_BACKEND_URL` is set in Vercel environment variables
- Make sure it includes `https://` and has no trailing slash
- Check CORS: `ALLOWED_ORIGINS` on Render must match your Vercel domain exactly

### CI/CD pipeline fails
- Check GitHub Actions tab for error logs
- Verify all secrets are set correctly
- Ensure `package-lock.json` exists in `frontend/` (run `npm install` locally and commit it)

### Render free tier cold starts
- First request after ~15 min idle takes ~30 seconds
- Consider adding a health-check ping (e.g., UptimeRobot free tier) to keep it warm

---

## Cost Summary

| Service | Plan | Cost |
|---------|------|------|
| GitHub | Free | $0 |
| GitHub Actions | Free (2,000 min/month) | $0 |
| Vercel | Hobby (free) | $0 |
| Render | Free | $0 |
| Google Gemini | Free tier | $0 |
| **Total** | | **$0/month** |

---

## Quick Reference

```
Frontend URL:  https://your-portfolio.vercel.app
Backend URL:   https://portfolio-backend.onrender.com
GitHub Repo:   https://github.com/YOUR_USERNAME/MyPortfolio
CI/CD:         GitHub Actions → deployment branch
```

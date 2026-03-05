# Installation Script for AI Portfolio
# Run this once to set up the project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AI Portfolio - Installation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if in correct directory
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "Error: Please run this script from the Portfolio Site root directory" -ForegroundColor Red
    exit 1
}

# Backend Setup
Write-Host "[1/3] Setting up Backend..." -ForegroundColor Yellow
Write-Host ""

Set-Location backend

# Check Python
Write-Host "Checking Python installation..." -ForegroundColor Gray
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Python not found. Please install Python 3.9+" -ForegroundColor Red
    exit 1
}

# Create virtual environment
if (-not (Test-Path ".venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Gray
    python -m venv .venv
    Write-Host "✓ Virtual environment created" -ForegroundColor Green
} else {
    Write-Host "✓ Virtual environment already exists" -ForegroundColor Green
}

# Activate and install dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Gray
Write-Host "(This may take 5-10 minutes for first install)" -ForegroundColor Gray

$activateScript = ".\.venv\Scripts\Activate.ps1"
if (Test-Path $activateScript) {
    & $activateScript
    pip install --upgrade pip
    pip install -r requirements.txt
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Python dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "✗ Error installing Python dependencies" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
} else {
    Write-Host "✗ Could not activate virtual environment" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Build vector store
Write-Host ""
Write-Host "Building vector store..." -ForegroundColor Gray
python build_vector_store.py

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Vector store built successfully" -ForegroundColor Green
} else {
    Write-Host "⚠ Warning: Vector store build had issues (you can rebuild later)" -ForegroundColor Yellow
}

Set-Location ..

# Frontend Setup
Write-Host ""
Write-Host "[2/3] Setting up Frontend..." -ForegroundColor Yellow
Write-Host ""

Set-Location frontend

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Gray
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Install dependencies
Write-Host "Installing npm dependencies..." -ForegroundColor Gray
Write-Host "(This may take 2-5 minutes)" -ForegroundColor Gray

npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ npm dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Error installing npm dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..

# Final Steps
Write-Host ""
Write-Host "[3/3] Final Setup..." -ForegroundColor Yellow
Write-Host ""

# Check for .env file
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from template..." -ForegroundColor Gray
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host "  (You can add your Hugging Face token later for Phase 3)" -ForegroundColor Gray
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

# Done
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Run: .\start.ps1" -ForegroundColor White
Write-Host "  2. Open: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Or start manually:" -ForegroundColor Yellow
Write-Host "  Backend:  cd backend && .\.venv\Scripts\Activate.ps1 && uvicorn main:app --reload" -ForegroundColor White
Write-Host "  Frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see SETUP_GUIDE.md" -ForegroundColor Gray
Write-Host ""

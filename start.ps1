# Quick Start Script for Portfolio Site
# This script helps you quickly start both frontend and backend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AI Portfolio - Quick Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if in correct directory
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "Error: Please run this script from the Portfolio Site root directory" -ForegroundColor Red
    exit 1
}

Write-Host "Starting AI Portfolio..." -ForegroundColor Green
Write-Host ""

# Start backend in new window
Write-Host "[1/2] Starting Backend..." -ForegroundColor Yellow
$backendScript = @"
cd backend
if (Test-Path '.venv\Scripts\Activate.ps1') {
    .\.venv\Scripts\Activate.ps1
    Write-Host 'Virtual environment activated' -ForegroundColor Green
    uvicorn main:app --reload
} else {
    Write-Host 'Error: Virtual environment not found!' -ForegroundColor Red
    Write-Host 'Please run: python -m venv .venv' -ForegroundColor Yellow
    Write-Host 'Then run: pip install -r requirements.txt' -ForegroundColor Yellow
    pause
}
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript

Start-Sleep -Seconds 2

# Start frontend in new window
Write-Host "[2/2] Starting Frontend..." -ForegroundColor Yellow
$frontendScript = @"
cd frontend
if (Test-Path 'node_modules') {
    Write-Host 'Starting Next.js dev server...' -ForegroundColor Green
    npm run dev
} else {
    Write-Host 'Error: node_modules not found!' -ForegroundColor Red
    Write-Host 'Please run: npm install' -ForegroundColor Yellow
    pause
}
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript

Write-Host ""
Write-Host "✓ Started backend and frontend in separate windows" -ForegroundColor Green
Write-Host ""
Write-Host "URLs:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "  API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop the servers" -ForegroundColor Gray
Write-Host ""

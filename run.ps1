# ===============================================================
# Phish360 - One-Click PowerShell Launcher
# ===============================================================
$Root = $PSScriptRoot

Clear-Host
Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host "            PHISH360 - DEV ENVIRONMENT LAUNCHER" -ForegroundColor Cyan
Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Start Backend in separate process
Write-Host "[1/2] Launching Backend API on http://localhost:8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$Root\backend'; if (Test-Path '.\.venv\Scripts\Activate.ps1') { .\.venv\Scripts\Activate.ps1 }; python -m uvicorn api.app:app --reload --port 8000"

Start-Sleep -Seconds 2

# 2. Start Frontend in separate process
Write-Host "[2/2] Launching Frontend Dashboard on http://localhost:5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$Root\frontend'; npm run dev"

Write-Host ""
Write-Host "===============================================================" -ForegroundColor Green
Write-Host " Both services have been launched in separate terminal windows!" -ForegroundColor Green
Write-Host ""
Write-Host "   * Backend API:       http://localhost:8000" -ForegroundColor White
Write-Host "   * Swagger Docs:      http://localhost:8000/docs" -ForegroundColor White
Write-Host "   * Frontend Cockpit:  http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host " Extension:" -ForegroundColor Cyan
Write-Host "   * Open chrome://extensions/" -ForegroundColor White
Write-Host "   * Enable 'Developer mode' and click 'Load unpacked'" -ForegroundColor White
Write-Host "   * Select '$Root\extension'" -ForegroundColor White
Write-Host "===============================================================" -ForegroundColor Green
Write-Host ""

@echo off
title Phish360 Master Launcher
cls
echo ===============================================================
echo             SHIELD 360 - DEV ENVIRONMENT LAUNCHER
echo ===============================================================
echo.

:: 1. Launch Backend API in a new terminal window
echo [1/2] Launching Backend API (FastAPI)...
start "Phish360 Backend [Port 8000]" cmd /k "cd /d "%~dp0backend" && if exist .venv\Scripts\activate (call .venv\Scripts\activate.bat) && python -m uvicorn api.app:app --reload --port 8000"

:: Small wait for port binding
timeout /t 2 /nobreak >nul

:: 2. Launch Frontend in a new terminal window
echo [2/2] Launching Frontend Dashboard (Vite)...
start "Phish360 Frontend [Port 5173]" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ===============================================================
echo  SUCCESS! Both services launched in separate terminal windows:
echo.
echo    * Backend API:       http://localhost:8000
echo    * Swagger Docs:      http://localhost:8000/docs
echo    * Frontend Cockpit:  http://localhost:5173
echo.
echo  Extension:
echo    * Open chrome://extensions/
echo    * Click 'Load unpacked' and select the 'extension' folder.
echo ===============================================================
echo.
pause

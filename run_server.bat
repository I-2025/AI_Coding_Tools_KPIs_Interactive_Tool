@echo off
echo 🚀 KPI Scorecard Application Server
echo ================================
echo.
echo Starting server...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.6+ from https://python.org
    pause
    exit /b 1
)

REM Run the server
python server.py

echo.
echo Press any key to exit...
pause >nul 
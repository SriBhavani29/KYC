@echo off
echo ========================================================
echo Starting KYC Management System (Backend & Frontend)
echo ========================================================

echo Starting Backend Server on http://localhost:5000 ...
start "KYC Backend Server" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend Client on http://localhost:3000 ...
start "KYC Frontend Client" cmd /k "cd client && npm run dev"

echo.
echo Both services launched in separate windows!
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:5000
echo ========================================================
pause


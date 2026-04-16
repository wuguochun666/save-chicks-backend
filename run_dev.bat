@echo off
chcp 65001 >nul
cd /d C:\Users\32512\.qclaw\workspace-agent-28cec817\save-chicks-backend
echo Installing dependencies (sql.js, no C++ needed)...
npm install 2>&1
echo.
echo.
echo Starting server...
node server.js

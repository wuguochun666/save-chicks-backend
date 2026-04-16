@echo off
chcp 65001 >nul
cd /d C:\Users\32512\.qclaw\workspace-agent-28cec817\save-chicks-backend

echo [1/5] Creating .gitignore...
echo node_modules/ > .gitignore
echo data/ >> .gitignore
echo *.log >> .gitignore

echo [2/5] Git init...
"C:\Program Files\Git\bin\git.exe" init
"C:\Program Files\Git\bin\git.exe" config user.email "dev@savechicks.app"
"C:\Program Files\Git\bin\git.exe" config user.name "SaveChicks Dev"

echo [3/5] Adding files...
"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Initial commit: SaveChicks backend v1.0"

echo [4/5] Current status:
"C:\Program Files\Git\bin\git.exe" status --short

echo [5/5] Files committed. Ready for GitHub push or Railway deploy.
echo.
echo Next steps:
echo 1. Create a GitHub repo at https://github.com/new
echo 2. Run: git remote add origin YOUR_GITHUB_URL
echo 3. Run: git push -u origin main
echo 4. Connect repo to Railway at https://railway.app
echo.

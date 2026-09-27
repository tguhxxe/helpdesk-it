@echo off
setlocal
if not exist .env copy .env.example .env
call npm install
if errorlevel 1 goto :error

docker compose up -d
if errorlevel 1 (
  echo.
  echo PostgreSQL Docker gagal dijalankan. Pastikan Docker Desktop aktif.
  pause
  exit /b 1
)

echo.
echo Website akan berjalan di http://localhost:3000
call npm run dev
exit /b 0

:error
echo Gagal menginstall dependency Node.js.
pause
exit /b 1

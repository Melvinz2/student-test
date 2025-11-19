# Docker Stop Script for Windows
Write-Host "🛑 Stopping application..." -ForegroundColor Yellow

docker-compose down

Write-Host "✅ Application stopped!" -ForegroundColor Green

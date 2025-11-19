# Docker Build Script for Windows
Write-Host "🐳 Building Docker images..." -ForegroundColor Cyan

# Build backend
Write-Host "📦 Building backend image..." -ForegroundColor Yellow
docker-compose build backend

# Build frontend
Write-Host "📦 Building frontend image..." -ForegroundColor Yellow
docker-compose build frontend

Write-Host ""
Write-Host "✅ Build complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: docker-compose up -d"
Write-Host "  2. Setup database: docker-compose exec backend php artisan migrate --force"
Write-Host "  3. Seed users: docker-compose exec backend php artisan db:seed --force"

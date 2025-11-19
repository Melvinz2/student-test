# Docker Deploy Script for Windows (Production)
Write-Host "🚀 Deploying application..." -ForegroundColor Cyan

# Pull latest changes
Write-Host "📥 Pulling latest changes..." -ForegroundColor Yellow
git pull

# Build images
Write-Host "🏗️  Building images..." -ForegroundColor Yellow
docker-compose build --no-cache

# Stop current services
Write-Host "🛑 Stopping current services..." -ForegroundColor Yellow
docker-compose down

# Start new services
Write-Host "▶️  Starting services..." -ForegroundColor Yellow
docker-compose up -d

# Wait for services
Start-Sleep -Seconds 10

# Run migrations
Write-Host "🗄️  Running migrations..." -ForegroundColor Yellow
docker-compose exec -T backend php artisan migrate --force

# Clear and optimize caches
Write-Host "🧹 Optimizing caches..." -ForegroundColor Yellow
docker-compose exec -T backend php artisan config:cache
docker-compose exec -T backend php artisan route:cache
docker-compose exec -T backend php artisan view:cache

# Check status
Write-Host ""
Write-Host "📊 Deployment Status:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Application is live at:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000"
Write-Host "   Backend:  http://localhost:8000"

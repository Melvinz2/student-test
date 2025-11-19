# Database Setup Script for Windows
Write-Host "🗄️  Setting up database..." -ForegroundColor Cyan

# Create database file if not exists
$dbPath = "backend\database\database.sqlite"
if (!(Test-Path $dbPath)) {
    Write-Host "📝 Creating SQLite database file..." -ForegroundColor Yellow
    New-Item -Path $dbPath -ItemType File -Force | Out-Null
}

# Run migrations
Write-Host "🔄 Running migrations..." -ForegroundColor Yellow
docker-compose exec -T backend php artisan migrate --force

# Seed database
Write-Host "🌱 Seeding database..." -ForegroundColor Yellow
docker-compose exec -T backend php artisan db:seed --force

Write-Host ""
Write-Host "✅ Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Test credentials:" -ForegroundColor Cyan
Write-Host "  Username: demo"
Write-Host "  Password: 123456"

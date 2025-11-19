#!/bin/bash
# Docker Build Script

echo "🐳 Building Docker images..."

# Build backend
echo "📦 Building backend image..."
docker-compose build backend

# Build frontend
echo "📦 Building frontend image..."
docker-compose build frontend

echo "✅ Build complete!"
echo ""
echo "Next steps:"
echo "  1. Run: docker-compose up -d"
echo "  2. Setup database: docker-compose exec backend php artisan migrate --force"
echo "  3. Seed users: docker-compose exec backend php artisan db:seed --force"

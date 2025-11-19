#!/bin/bash
# Docker Deploy Script (Production)

echo "🚀 Deploying application..."

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull

# Build images
echo "🏗️  Building images..."
docker-compose build --no-cache

# Stop current services
echo "🛑 Stopping current services..."
docker-compose down

# Start new services
echo "▶️  Starting services..."
docker-compose up -d

# Wait for services
sleep 10

# Run migrations
echo "🗄️  Running migrations..."
docker-compose exec -T backend php artisan migrate --force

# Clear and optimize caches
echo "🧹 Optimizing caches..."
docker-compose exec -T backend php artisan config:cache
docker-compose exec -T backend php artisan route:cache
docker-compose exec -T backend php artisan view:cache

# Check status
echo ""
echo "📊 Deployment Status:"
docker-compose ps

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Application is live at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"

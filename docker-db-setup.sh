#!/bin/bash
# Database Setup Script

echo "🗄️  Setting up database..."

# Create database file if not exists
if [ ! -f "backend/database/database.sqlite" ]; then
    echo "📝 Creating SQLite database file..."
    touch backend/database/database.sqlite
fi

# Set permissions
chmod 664 backend/database/database.sqlite

# Run migrations
echo "🔄 Running migrations..."
docker-compose exec -T backend php artisan migrate --force

# Seed database
echo "🌱 Seeding database..."
docker-compose exec -T backend php artisan db:seed --force

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Test credentials:"
echo "  Username: demo"
echo "  Password: 123456"

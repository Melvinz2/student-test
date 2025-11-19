#!/bin/bash
# Application Deployment Script
# Run this after ubuntu-install.sh

set -e

echo "=========================================="
echo "Deploying Student Project"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
APP_DIR="/var/www/student-project"
DOMAIN="your-domain.com"

# Check if app directory exists
if [ ! -d "$APP_DIR" ]; then
    echo "Error: Application directory not found at $APP_DIR"
    echo "Please clone the repository first"
    exit 1
fi

cd $APP_DIR

echo -e "${GREEN}Step 1: Setup Backend Environment${NC}"
cd backend
if [ ! -f ".env" ]; then
    cp .env.production .env
    echo -e "${YELLOW}Please edit backend/.env with your configuration${NC}"
    read -p "Press enter when done..."
fi

echo -e "${GREEN}Step 2: Setup Frontend Environment${NC}"
cd ../frontend
if [ ! -f ".env.production" ]; then
    cp .env.example .env.production
    echo -e "${YELLOW}Please edit frontend/.env.production with your configuration${NC}"
    read -p "Press enter when done..."
fi

echo -e "${GREEN}Step 3: Create Database${NC}"
cd ../backend
touch database/database.sqlite
chmod 664 database/database.sqlite
chmod 775 database

echo -e "${GREEN}Step 4: Build Docker Images${NC}"
cd ..
docker-compose build

echo -e "${GREEN}Step 5: Start Containers${NC}"
docker-compose up -d

echo "Waiting for containers to start..."
sleep 10

echo -e "${GREEN}Step 6: Run Migrations${NC}"
docker-compose exec -T backend php artisan migrate --force

echo -e "${GREEN}Step 7: Seed Database${NC}"
docker-compose exec -T backend php artisan db:seed --force

echo -e "${GREEN}Step 8: Optimize Laravel${NC}"
docker-compose exec -T backend php artisan config:cache
docker-compose exec -T backend php artisan route:cache
docker-compose exec -T backend php artisan view:cache

echo ""
echo -e "${GREEN}=========================================="
echo "Deployment Complete!"
echo "==========================================${NC}"
echo ""
echo "Application Status:"
docker-compose ps
echo ""
echo "Access your application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo ""
echo "Next steps:"
echo "1. Configure Nginx reverse proxy"
echo "2. Setup SSL certificate"
echo "3. Configure your domain DNS"
echo ""
echo "Test credentials:"
echo "  Username: demo"
echo "  Password: 123456"

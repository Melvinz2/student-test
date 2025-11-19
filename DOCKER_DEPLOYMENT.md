# 🐳 Docker Deployment Guide

Panduan lengkap untuk deploy Student Project menggunakan Docker.

---

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git
- 2GB+ RAM
- 10GB+ disk space

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│         Docker Compose Services             │
├─────────────────────┬───────────────────────┤
│                     │                       │
│  Frontend (React)   │   Backend (Laravel)   │
│  ├─ Node.js 18      │   ├─ PHP 8.2-FPM      │
│  ├─ Nginx           │   ├─ Nginx            │
│  ├─ Port: 3000      │   ├─ SQLite           │
│  └─ Vite Build      │   ├─ Supervisor       │
│                     │   └─ Port: 8000       │
└─────────────────────┴───────────────────────┘
```

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd student-project
```

### 2. Setup Environment Variables

#### Backend (.env)
```bash
# Copy production template
cp .env.production .env

# Generate application key
php artisan key:generate

# Edit .env and update:
# - APP_URL with your domain
# - SANCTUM_STATEFUL_DOMAINS with your frontend domain
```

#### Frontend (.env.production)
```bash
cd codevault-cli
cp .env.production .env.production

# Edit and update VITE_API_URL
# Example: VITE_API_URL=http://your-domain.com:8000/api
```

### 3. Prepare Database
```bash
# Create SQLite database file
touch database/database.sqlite

# Run migrations (in container or locally)
php artisan migrate --force

# Seed test users
php artisan db:seed --class=UserSeeder --force
```

### 4. Build & Run with Docker Compose
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Health Check**: http://localhost:8000/up

---

## 📦 Docker Services

### Backend Service
- **Image**: Custom PHP 8.2-FPM Alpine
- **Port**: 8000 (host) → 80 (container)
- **Components**:
  - PHP 8.2 with extensions (PDO, SQLite, GD, etc.)
  - Nginx web server
  - Supervisor (process manager)
  - Laravel application

### Frontend Service
- **Image**: Nginx Alpine
- **Port**: 3000 (host) → 80 (container)
- **Components**:
  - React build artifacts
  - Nginx with SPA routing

---

## 🔧 Docker Commands

### Build & Start
```bash
# Build images (first time or after changes)
docker-compose build

# Start all services
docker-compose up -d

# Start with logs
docker-compose up

# Rebuild and restart
docker-compose up -d --build
```

### Manage Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Restart specific service
docker-compose restart backend
docker-compose restart frontend

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Execute Commands in Container
```bash
# Access backend container
docker-compose exec backend sh

# Run artisan commands
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan db:seed
docker-compose exec backend php artisan cache:clear

# Access frontend container
docker-compose exec frontend sh
```

---

## 🗄️ Database Management

### Inside Container
```bash
# Access backend container
docker-compose exec backend sh

# Run migrations
php artisan migrate --force

# Seed database
php artisan db:seed --force

# Access SQLite database
sqlite3 database/database.sqlite
```

### From Host (if SQLite CLI installed)
```bash
# Access database file
sqlite3 database/database.sqlite

# View users
SELECT * FROM users;
```

---

## 🔐 Environment Configuration

### Backend (.env)
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=http://your-domain.com

DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite

SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.com
SESSION_DOMAIN=.your-domain.com
```

### Frontend (.env.production)
```env
VITE_API_URL=http://your-backend-domain.com:8000/api
```

---

## 🌐 Production Deployment

### 1. Server Requirements
- Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- 2GB+ RAM
- Docker & Docker Compose installed
- Domain pointing to server IP

### 2. Install Docker (Ubuntu)
```bash
# Update packages
sudo apt update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 3. Deploy Application
```bash
# Clone repository
git clone <your-repo-url>
cd student-project

# Setup environment
cp .env.production .env
nano .env  # Edit configuration

# Create database
touch database/database.sqlite

# Build and start
docker-compose build
docker-compose up -d

# Run migrations
docker-compose exec backend php artisan migrate --force
docker-compose exec backend php artisan db:seed --force

# Verify services
docker-compose ps
curl http://localhost:8000/up
```

### 4. Setup Reverse Proxy (Nginx)

Create `/etc/nginx/sites-available/student-project`:
```nginx
# Frontend
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Backend API
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/student-project /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL/HTTPS with Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificates
sudo certbot --nginx -d your-domain.com -d api.your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 🔍 Monitoring & Logs

### View Logs
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100
```

### Check Container Health
```bash
# Service status
docker-compose ps

# Resource usage
docker stats

# Inspect container
docker inspect student_project_backend
```

### Laravel Logs
```bash
# Access backend container
docker-compose exec backend sh

# View Laravel logs
tail -f storage/logs/laravel.log
```

---

## 🛠️ Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Remove and rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Permission Issues
```bash
# Fix storage permissions
docker-compose exec backend chown -R www-data:www-data storage bootstrap/cache
docker-compose exec backend chmod -R 755 storage bootstrap/cache
```

### Database Issues
```bash
# Reset database
docker-compose exec backend php artisan migrate:fresh --force
docker-compose exec backend php artisan db:seed --force
```

### Port Already in Use
```bash
# Find process using port
sudo lsof -i :8000
sudo lsof -i :3000

# Kill process or change port in docker-compose.yml
```

### CORS Issues
- Check `SANCTUM_STATEFUL_DOMAINS` in backend `.env`
- Verify `VITE_API_URL` in frontend `.env.production`
- Ensure both domains match

---

## 📊 Performance Optimization

### Backend
```bash
# Optimize Laravel
docker-compose exec backend php artisan config:cache
docker-compose exec backend php artisan route:cache
docker-compose exec backend php artisan view:cache
docker-compose exec backend php artisan optimize
```

### Frontend
- Already optimized with production build
- Gzip compression enabled in Nginx
- Static assets cached for 1 year

### Database
- Using SQLite for simplicity
- For high traffic, consider MySQL/PostgreSQL

---

## 🔄 Updates & Maintenance

### Update Application
```bash
# Pull latest changes
git pull

# Rebuild containers
docker-compose build

# Restart services
docker-compose down
docker-compose up -d

# Run migrations
docker-compose exec backend php artisan migrate --force

# Clear caches
docker-compose exec backend php artisan optimize:clear
```

### Backup Database
```bash
# Backup SQLite database
cp database/database.sqlite database/database.sqlite.backup

# Or from container
docker cp student_project_backend:/var/www/html/database/database.sqlite ./backup.sqlite
```

### Restore Database
```bash
# Restore from backup
cp database/database.sqlite.backup database/database.sqlite

# Or to container
docker cp ./backup.sqlite student_project_backend:/var/www/html/database/database.sqlite
```

---

## 📝 Useful Scripts

### start.sh
```bash
#!/bin/bash
docker-compose up -d
echo "Application started!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000"
```

### stop.sh
```bash
#!/bin/bash
docker-compose down
echo "Application stopped!"
```

### deploy.sh
```bash
#!/bin/bash
git pull
docker-compose build
docker-compose down
docker-compose up -d
docker-compose exec backend php artisan migrate --force
docker-compose exec backend php artisan optimize
echo "Deployment complete!"
```

---

## 🔐 Security Checklist

- [ ] Change `APP_KEY` in production
- [ ] Set `APP_DEBUG=false`
- [ ] Configure firewall (UFW)
- [ ] Enable HTTPS/SSL
- [ ] Set strong database passwords (if using MySQL/PostgreSQL)
- [ ] Configure rate limiting
- [ ] Regular security updates
- [ ] Backup strategy in place

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Laravel Deployment](https://laravel.com/docs/deployment)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

## 🆘 Support

Jika mengalami masalah:
1. Check logs: `docker-compose logs`
2. Verify environment variables
3. Ensure ports are available
4. Check container health: `docker-compose ps`

---

**Created**: November 19, 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready

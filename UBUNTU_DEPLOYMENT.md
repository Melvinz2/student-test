# 🐧 Deployment Guide - Ubuntu Server with Docker

Panduan lengkap untuk deploy Student Project di Ubuntu Server menggunakan Docker.

---

## 📋 Prerequisites

### Server Requirements
- Ubuntu Server 20.04 LTS atau lebih baru
- Minimal 2GB RAM
- Minimal 10GB disk space
- Root atau sudo access
- Domain name (opsional, tapi recommended)

### Local Requirements
- SSH client
- Git
- File transfer tool (SCP/SFTP)

---

## 🚀 Step-by-Step Deployment

### Step 1: Setup Ubuntu Server

#### 1.1 Update System
```bash
sudo apt update
sudo apt upgrade -y
```

#### 1.2 Install Required Packages
```bash
sudo apt install -y curl git vim ufw
```

#### 1.3 Setup Firewall
```bash
# Enable firewall
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP & HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow custom ports (jika pakai port custom)
sudo ufw allow 3000/tcp
sudo ufw allow 8000/tcp

# Check status
sudo ufw status
```

---

### Step 2: Install Docker & Docker Compose

#### 2.1 Install Docker
```bash
# Remove old versions (jika ada)
sudo apt remove docker docker-engine docker.io containerd runc

# Install dependencies
sudo apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Setup repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
sudo docker --version
```

#### 2.2 Setup Docker Permissions
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Apply changes (logout & login, atau:)
newgrp docker

# Test without sudo
docker ps
```

#### 2.3 Install Docker Compose (standalone)
```bash
# Download latest version
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker-compose --version
```

---

### Step 3: Deploy Application

#### 3.1 Clone Repository
```bash
# Create directory
mkdir -p /var/www
cd /var/www

# Clone repository
git clone <your-repo-url> student-project
cd student-project

# Atau jika upload manual
# scp -r student-project user@server:/var/www/
```

#### 3.2 Setup Environment Variables

**Backend (.env)**
```bash
cd /var/www/student-project/backend

# Copy template
cp .env.production .env

# Edit configuration
nano .env
```

Isi `.env`:
```env
APP_NAME="Student Project"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=http://your-domain.com

DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite

SESSION_DRIVER=file
SESSION_LIFETIME=120
CACHE_STORE=file
QUEUE_CONNECTION=database

LOG_CHANNEL=stack
LOG_LEVEL=error

SANCTUM_STATEFUL_DOMAINS=your-domain.com
SESSION_DOMAIN=.your-domain.com
```

**Generate APP_KEY:**
```bash
# Install composer temporarily (jika belum punya)
docker run --rm -v $(pwd):/app composer install

# Generate key
docker run --rm -v $(pwd):/app -w /app php:8.2-cli php artisan key:generate
```

**Frontend (.env.production)**
```bash
cd /var/www/student-project/frontend

# Edit environment
nano .env.production
```

Isi `.env.production`:
```env
VITE_API_URL=http://your-domain.com/api
# atau
VITE_API_URL=http://your-ip:8000/api
```

#### 3.3 Setup Database
```bash
cd /var/www/student-project/backend

# Create SQLite database file
touch database/database.sqlite

# Set permissions
chmod 664 database/database.sqlite
chmod 775 database
```

#### 3.4 Build & Start Docker Containers
```bash
cd /var/www/student-project

# Build images
docker-compose build

# Start containers
docker-compose up -d

# Check status
docker-compose ps
```

#### 3.5 Run Migrations & Seeders
```bash
# Run migrations
docker-compose exec backend php artisan migrate --force

# Seed database
docker-compose exec backend php artisan db:seed --force

# Optimize Laravel
docker-compose exec backend php artisan config:cache
docker-compose exec backend php artisan route:cache
docker-compose exec backend php artisan view:cache
```

---

### Step 4: Setup Reverse Proxy (Nginx)

#### 4.1 Install Nginx
```bash
sudo apt install -y nginx
```

#### 4.2 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/student-project
```

**Configuration:**
```nginx
# Frontend
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Logging
    access_log /var/log/nginx/frontend-access.log;
    error_log /var/log/nginx/frontend-error.log;
}

# Backend API
server {
    listen 80;
    server_name api.your-domain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Logging
    access_log /var/log/nginx/backend-access.log;
    error_log /var/log/nginx/backend-error.log;
}
```

#### 4.3 Enable Site
```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/student-project /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Enable on boot
sudo systemctl enable nginx
```

---

### Step 5: Setup SSL/HTTPS (Let's Encrypt)

#### 5.1 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

#### 5.2 Obtain SSL Certificate
```bash
# For single domain
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# For multiple domains (including API)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com -d api.your-domain.com

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose redirect HTTP to HTTPS (recommended)
```

#### 5.3 Test Auto-Renewal
```bash
sudo certbot renew --dry-run
```

#### 5.4 Setup Auto-Renewal Cron
```bash
# Check if cron job exists
sudo systemctl status certbot.timer

# Or add manual cron job
sudo crontab -e

# Add this line:
0 0 * * * /usr/bin/certbot renew --quiet
```

---

### Step 6: Monitoring & Maintenance

#### 6.1 View Logs
```bash
# Docker logs
docker-compose logs -f

# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# Nginx logs
sudo tail -f /var/log/nginx/backend-access.log
sudo tail -f /var/log/nginx/backend-error.log
```

#### 6.2 Restart Services
```bash
# Restart Docker containers
docker-compose restart

# Restart Nginx
sudo systemctl restart nginx
```

#### 6.3 Update Application
```bash
cd /var/www/student-project

# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Run migrations (if any)
docker-compose exec backend php artisan migrate --force

# Clear and cache
docker-compose exec backend php artisan optimize
```

---

## 🔒 Security Best Practices

### 1. Firewall Rules
```bash
# Only allow necessary ports
sudo ufw status numbered
sudo ufw delete <number>  # Remove unnecessary rules
```

### 2. SSH Security
```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Recommended settings:
# PermitRootLogin no
# PasswordAuthentication no  # Use SSH keys only
# Port 2222  # Change default port

# Restart SSH
sudo systemctl restart sshd
```

### 3. Regular Updates
```bash
# Create update script
sudo nano /usr/local/bin/update-system.sh
```

```bash
#!/bin/bash
apt update
apt upgrade -y
apt autoremove -y
docker system prune -f
echo "System updated: $(date)" >> /var/log/system-updates.log
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/update-system.sh

# Add to cron (weekly)
sudo crontab -e
0 2 * * 0 /usr/local/bin/update-system.sh
```

### 4. Backup Strategy
```bash
# Create backup script
sudo nano /usr/local/bin/backup-app.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
cp /var/www/student-project/backend/database/database.sqlite $BACKUP_DIR/db_$DATE.sqlite

# Backup environment files
cp /var/www/student-project/backend/.env $BACKUP_DIR/backend_env_$DATE
cp /var/www/student-project/frontend/.env.production $BACKUP_DIR/frontend_env_$DATE

# Remove old backups (older than 7 days)
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE" >> /var/log/backup.log
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-app.sh

# Add to cron (daily)
sudo crontab -e
0 3 * * * /usr/local/bin/backup-app.sh
```

---

## 🧪 Testing Deployment

### 1. Test Backend API
```bash
# From server
curl http://localhost:8000/api/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","accessKey":"123456"}'

# From outside (if configured)
curl http://your-domain.com/api/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","accessKey":"123456"}'
```

### 2. Test Frontend
```bash
# Open in browser
http://your-domain.com
```

### 3. Test HTTPS
```bash
curl -I https://your-domain.com
```

---

## 🔧 Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs

# Rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Permission Issues
```bash
docker-compose exec backend chown -R www-data:www-data database
docker-compose exec backend chmod 775 database
docker-compose exec backend chmod 664 database/database.sqlite
```

### Nginx 502 Bad Gateway
```bash
# Check if containers are running
docker-compose ps

# Check Nginx config
sudo nginx -t

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Port Already in Use
```bash
# Find process using port
sudo lsof -i :8000
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>
```

### SSL Certificate Issues
```bash
# Renew certificate
sudo certbot renew

# Force renew
sudo certbot renew --force-renewal
```

---

## 📊 Monitoring Setup (Optional)

### Install htop
```bash
sudo apt install -y htop
htop
```

### Install Docker Stats
```bash
# Real-time stats
docker stats

# Container resource usage
docker-compose top
```

### Install Glances (Advanced)
```bash
sudo apt install -y glances
glances
```

---

## 🎯 Quick Reference Commands

```bash
# Start application
cd /var/www/student-project && docker-compose up -d

# Stop application
cd /var/www/student-project && docker-compose down

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Update
git pull && docker-compose up -d --build

# Backup database
cp backend/database/database.sqlite ~/backup_$(date +%Y%m%d).sqlite

# Check disk usage
df -h

# Check memory
free -h

# Check Docker images
docker images

# Clean Docker
docker system prune -a
```

---

## ✅ Post-Deployment Checklist

- [ ] Domain DNS configured
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Database migrated and seeded
- [ ] Application accessible via domain
- [ ] HTTPS working
- [ ] Backend API responding
- [ ] Frontend loading correctly
- [ ] Login functionality working
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Log rotation configured
- [ ] Auto-update script setup

---

**Deployment Date**: ___________  
**Server IP**: ___________  
**Domain**: ___________  
**Status**: ✅ Production Ready

# 🐳 Docker Quick Reference

Panduan cepat untuk menjalankan aplikasi dengan Docker.

---

## 🚀 Quick Start (3 Langkah)

### Windows (PowerShell)
```powershell
# 1. Build images
.\docker-build.ps1

# 2. Start application
.\docker-start.ps1

# 3. Setup database
.\docker-db-setup.ps1
```

### Linux/Mac (Bash)
```bash
# 1. Build images
chmod +x docker-build.sh
./docker-build.sh

# 2. Start application
chmod +x docker-start.sh
./docker-start.sh

# 3. Setup database
chmod +x docker-db-setup.sh
./docker-db-setup.sh
```

### Manual (Docker Compose)
```bash
# Build and start
docker-compose up -d

# Setup database (database file is in backend/database/)
docker-compose exec backend php artisan migrate --force
docker-compose exec backend php artisan db:seed --force
```

---

## 🌐 Access Points

| Service | URL | Port |
|---------|-----|------|
| Frontend (React) | http://localhost:3000 | 3000 |
| Backend (Laravel) | http://localhost:8000 | 8000 |
| API Endpoint | http://localhost:8000/api | 8000 |
| Health Check | http://localhost:8000/up | 8000 |

---

## 📝 Available Scripts

### Windows (PowerShell)

| Script | Deskripsi |
|--------|-----------|
| `.\docker-build.ps1` | Build Docker images |
| `.\docker-start.ps1` | Start application |
| `.\docker-stop.ps1` | Stop application |
| `.\docker-deploy.ps1` | Full deployment (production) |
| `.\docker-db-setup.ps1` | Setup database |

### Linux/Mac (Bash)

| Script | Deskripsi |
|--------|-----------|
| `./docker-build.sh` | Build Docker images |
| `./docker-start.sh` | Start application |
| `./docker-stop.sh` | Stop application |
| `./docker-deploy.sh` | Full deployment (production) |
| `./docker-db-setup.sh` | Setup database |

---

## 🔧 Common Commands

### Manage Services
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### Backend (Laravel)
```bash
# Run migrations
docker-compose exec backend php artisan migrate

# Seed database
docker-compose exec backend php artisan db:seed

# Clear cache
docker-compose exec backend php artisan cache:clear

# Access container shell
docker-compose exec backend sh
```

### Frontend (React)
```bash
# Access container shell
docker-compose exec frontend sh

# Rebuild frontend (if needed)
docker-compose build frontend
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process

# Linux/Mac
sudo lsof -ti:8000 | xargs kill -9
```

### Permission Denied
```bash
# Linux/Mac - Make scripts executable
chmod +x docker-*.sh

# Fix storage permissions
docker-compose exec backend chown -R www-data:www-data storage bootstrap/cache
```

### Container Won't Start
```bash
# View logs
docker-compose logs backend

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Database Not Found
```bash
# Create database file
touch database/database.sqlite

# Run migrations
docker-compose exec backend php artisan migrate --force
```

---

## 📦 What's Inside

### Docker Images
- **Backend**: PHP 8.2-FPM Alpine + Nginx + Supervisor
- **Frontend**: Node 18 Alpine (build) → Nginx Alpine (serve)

### Services
- **backend**: Laravel API (Port 8000)
- **frontend**: React SPA (Port 3000)

### Volumes
- `./storage`: Laravel storage (persistent)
- `./database/database.sqlite`: SQLite database (persistent)

---

## 🔐 Test Credentials

| Username | Password | Nama |
|----------|----------|------|
| demo | 123456 | Demo User |
| student_01 | learn2code | Alice Dev |
| student_02 | react_rocks | Bob Scripter |

---

## 📚 Full Documentation

- **DOCKER_DEPLOYMENT.md** - Complete deployment guide
- **QUICK_START.md** - Development quick start
- **INTEGRATION_GUIDE.md** - Integration details
- **SUMMARY.md** - Project overview

---

## 💡 Tips

1. **First Time Setup**: Run build → start → db-setup
2. **Daily Development**: Just run start/stop scripts
3. **After Git Pull**: Run deploy script
4. **Reset Everything**: `docker-compose down -v` then rebuild

---

**Need help?** Check **DOCKER_DEPLOYMENT.md** for detailed guide.

# 🎓 Student Project - Laravel + React with Authentication

Full-stack web application dengan Laravel backend dan React frontend, dilengkapi dengan Laravel Sanctum authentication dan Docker deployment ready.

---

## 🚀 Quick Start

### Opsi 1: Development (Traditional)

#### Backend (Laravel)
```bash
cd c:\xampp\htdocs\student-project\backend
composer install
php artisan migrate
php artisan db:seed --class=UserSeeder
php artisan serve
```
**URL**: http://127.0.0.1:8000

#### Frontend (React)
```bash
cd c:\xampp\htdocs\student-project\frontend
npm install
npm run dev
```
**URL**: http://localhost:5173

### Opsi 2: Production (Docker) ⭐ Recommended

#### Windows (PowerShell)
```powershell
.\docker-build.ps1      # Build images
.\docker-start.ps1      # Start services
.\docker-db-setup.ps1   # Setup database
```

#### Linux/Mac (Bash)
```bash
./docker-build.sh       # Build images
./docker-start.sh       # Start services
./docker-db-setup.sh    # Setup database
```

**URLs**:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API: http://localhost:8000/api

---

## 🔐 Test Credentials

| Username | Password | Nama |
|----------|----------|------|
| demo | 123456 | Demo User |
| student_01 | learn2code | Alice Dev |
| student_02 | react_rocks | Bob Scripter |

---

## ✨ Features

### Backend (Laravel 11)
- ✅ RESTful API with Laravel Sanctum
- ✅ Token-based authentication
- ✅ SQLite database (easy setup)
- ✅ CORS configured for React
- ✅ User management & seeding
- ✅ Production-ready Docker setup

### Frontend (React + TypeScript)
- ✅ Modern React with Vite
- ✅ TypeScript for type safety
- ✅ Tailwind CSS styling
- ✅ Real API integration
- ✅ Token storage & management
- ✅ SPA routing with Nginx

### Docker & DevOps
- ✅ Multi-stage builds
- ✅ Nginx + PHP-FPM
- ✅ Supervisor process manager
- ✅ Automated deployment scripts
- ✅ Production optimizations
- ✅ Health checks & monitoring

---

## 📂 Project Structure

```
student-project/
├── backend/                      # Laravel Backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   └── AuthController.php    # ✅ Auth API endpoints
│   │   └── Models/
│   │       └── User.php              # ✅ User model dengan Sanctum
│   ├── routes/
│   │   └── api.php               # ✅ API routes
│   ├── database/
│   │   └── seeders/
│   │       └── UserSeeder.php    # ✅ Test users
│   ├── docker/                   # Backend Docker configs
│   │   ├── nginx/
│   │   └── supervisor/
│   └── Dockerfile                # ✅ Backend Docker
├── frontend/                     # React Frontend
│   ├── services/
│   │   └── authService.ts        # ✅ API integration
│   ├── components/               # React components
│   ├── config.ts                 # ✅ API configuration
│   └── Dockerfile                # ✅ Frontend Docker
├── docker-compose.yml            # ✅ Services orchestration
├── docker-*.sh/ps1               # ✅ Automation scripts
└── Documentation/                # Comprehensive docs
    ├── QUICK_START.md
    ├── INTEGRATION_GUIDE.md
    ├── DOCKER_DEPLOYMENT.md
    └── More...
```

---

## 📊 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/login` | ❌ | Login user & get token |
| GET | `/api/user` | ✅ | Get current user data |
| POST | `/api/logout` | ✅ | Logout & revoke token |

**Authentication**: Bearer Token (Laravel Sanctum)

---

## 🐳 Docker Architecture

```
┌─────────────────────────────────────────────┐
│         Docker Compose Services             │
├─────────────────────┬───────────────────────┤
│  Frontend (React)   │   Backend (Laravel)   │
│  ├─ Nginx Alpine    │   ├─ PHP 8.2-FPM      │
│  ├─ Production Build│   ├─ Nginx            │
│  └─ Port: 3000      │   ├─ Supervisor       │
│                     │   └─ Port: 8000       │
└─────────────────────┴───────────────────────┘
```

---

## 📚 Documentation

### Getting Started
- **[QUICK_START.md](QUICK_START.md)** - 5-minute setup guide
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Complete integration details
- **[API_TESTING.md](API_TESTING.md)** - API testing with Postman/cURL

### Docker & Deployment
- **[DOCKER_README.md](DOCKER_README.md)** - Docker quick reference
- **[DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)** - Production deployment guide
- **[DOCKER_SUMMARY.md](DOCKER_SUMMARY.md)** - Complete Docker setup overview

### Frontend
- **[frontend/LARAVEL_INTEGRATION.md](frontend/LARAVEL_INTEGRATION.md)** - React integration docs

### Project Overview
- **[SUMMARY.md](SUMMARY.md)** - Complete project summary

---

## 🛠️ Tech Stack

### Backend
- Laravel 11
- PHP 8.2
- Laravel Sanctum (Authentication)
- SQLite (Database)
- Nginx (Web Server)

### Frontend
- React 18
- TypeScript
- Vite (Build Tool)
- Tailwind CSS
- Fetch API

### DevOps
- Docker & Docker Compose
- Nginx (Reverse Proxy)
- Supervisor (Process Manager)
- Alpine Linux (Base Images)

---

## 🔧 Development Commands

### Laravel (Backend)
```bash
# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Clear cache
php artisan cache:clear

# Start server
php artisan serve
```

### React (Frontend)
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
```

### Docker
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🚀 Production Deployment

1. **Setup Server** - Install Docker & Docker Compose
2. **Clone Repository** - `git clone <repo-url>`
3. **Configure Environment** - Copy and edit `.env.production`
4. **Build & Deploy** - Run `./docker-deploy.sh` (Linux) or `.\docker-deploy.ps1` (Windows)
5. **Setup SSL** - Configure HTTPS with Let's Encrypt
6. **Monitor** - Check logs and health endpoints

See **[DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)** for detailed guide.

---

## 📝 Environment Configuration

### Backend (.env)
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=http://your-domain.com
DB_CONNECTION=sqlite
SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.com
```

### Frontend (.env.production)
```env
VITE_API_URL=http://your-backend-domain.com:8000/api
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 About Laravel

Laravel is a web application framework with expressive, elegant syntax. Learn more at [laravel.com](https://laravel.com).

---

## 📧 Support

Need help? Check the documentation or open an issue.

---

**Created**: November 19, 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready

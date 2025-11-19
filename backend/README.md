# Backend - Laravel API

Backend API untuk Student Project menggunakan Laravel 11 dengan Sanctum authentication.

## 🚀 Quick Start

### Development Mode
```bash
# Install dependencies
composer install

# Setup database
touch database/database.sqlite
php artisan migrate
php artisan db:seed --class=UserSeeder

# Start server
php artisan serve
```

**API URL**: http://127.0.0.1:8000/api

### Production (Docker)
Backend sudah dikonfigurasi untuk berjalan di Docker. Lihat root folder untuk docker-compose.yml.

## 📊 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/login` | ❌ | Login dan dapatkan token |
| GET | `/api/user` | ✅ | Dapatkan data user saat ini |
| POST | `/api/logout` | ✅ | Logout dan revoke token |

## 🔧 Tech Stack

- **Framework**: Laravel 11
- **PHP Version**: 8.2
- **Database**: SQLite
- **Authentication**: Laravel Sanctum
- **Web Server**: Nginx (Docker) / PHP Built-in (Dev)

## 📁 Structure

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   └── AuthController.php      # Auth endpoints
│   └── Models/
│       └── User.php                 # User model
├── routes/
│   └── api.php                      # API routes
├── database/
│   ├── migrations/                  # Database migrations
│   └── seeders/
│       └── UserSeeder.php           # Test users
├── config/
│   ├── cors.php                     # CORS config
│   └── sanctum.php                  # Sanctum config
└── docker/                          # Docker configs
    ├── nginx/
    └── supervisor/
```

## 🔐 Test Users

| Username | Password | Nama |
|----------|----------|------|
| demo | 123456 | Demo User |
| student_01 | learn2code | Alice Dev |
| student_02 | react_rocks | Bob Scripter |

## 🛠️ Artisan Commands

```bash
# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 📝 Environment

Copy `.env.example` to `.env` dan update konfigurasi:

```env
APP_ENV=local
APP_DEBUG=true
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite
```

## 📚 Documentation

Lihat dokumentasi lengkap di root project:
- **../INTEGRATION_GUIDE.md** - Complete integration guide
- **../API_TESTING.md** - API testing guide
- **../DOCKER_DEPLOYMENT.md** - Production deployment

---

**Laravel Version**: 11.x  
**Created**: November 2025

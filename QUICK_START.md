# 🚀 Quick Start Guide

## Setup Cepat (5 Menit)

### 1️⃣ Setup Laravel Backend

```bash
# Di folder backend
cd c:\xampp\htdocs\student-project\backend

# Install dependencies (jika belum)
composer install

# Setup database (jika belum)
php artisan migrate

# Buat user test
php artisan db:seed --class=UserSeeder

# Jalankan server
php artisan serve
```

Server akan berjalan di: **http://127.0.0.1:8000**

### 2️⃣ Setup React Frontend

```bash
# Di folder frontend
cd c:\xampp\htdocs\student-project\frontend

# Install dependencies
npm install

# Update config.ts - sesuaikan BASE_URL
# Jika pakai artisan serve:
# BASE_URL: 'http://127.0.0.1:8000/api'

# Jalankan dev server
npm run dev
```

React app akan berjalan di: **http://localhost:5173** (atau port lain yang tersedia)

### 3️⃣ Test Login

Buka browser ke React app dan login dengan:
- **Username**: `demo`
- **Access Key**: `123456`

---

## 📝 Credentials untuk Testing

| Username | Access Key | Nama |
|----------|------------|------|
| student_01 | learn2code | Alice Dev |
| student_02 | react_rocks | Bob Scripter |
| demo | 123456 | Demo User |

---

## 🔧 Konfigurasi Penting

### Jika Menggunakan XAMPP

**File: `codevault-cli/config.ts`**
```typescript
BASE_URL: 'http://localhost/student-project/public/api',
```

### Jika Menggunakan PHP Artisan Serve

**File: `codevault-cli/config.ts`**
```typescript
BASE_URL: 'http://127.0.0.1:8000/api',
```

---

## 🎯 API Endpoints

| Method | Endpoint | Auth Required | Deskripsi |
|--------|----------|---------------|-----------|
| POST | /api/login | ❌ | Login user |
| GET | /api/user | ✅ | Get current user |
| POST | /api/logout | ✅ | Logout user |

---

## 🐛 Common Issues & Solutions

### ❌ CORS Error
**Solusi:** Pastikan Laravel server sudah running dan `config/cors.php` ada.

### ❌ 404 Not Found
**Solusi:** 
- Periksa URL di `config.ts`
- Pastikan server Laravel running
- Coba `php artisan route:list --path=api`

### ❌ Token Invalid / 401 Unauthorized
**Solusi:**
- Clear localStorage: F12 → Application → Local Storage → Clear
- Login ulang

### ❌ Connection Refused
**Solusi:**
- Pastikan Laravel server running di port yang benar
- Check firewall/antivirus

---

## 📂 File yang Dimodifikasi

### Laravel (Backend)
✅ `app/Http/Controllers/AuthController.php` - Controller untuk auth  
✅ `app/Models/User.php` - Model user dengan Sanctum  
✅ `routes/api.php` - API routes  
✅ `config/cors.php` - CORS configuration  
✅ `bootstrap/app.php` - Middleware config  
✅ `database/seeders/UserSeeder.php` - User seeder  

### React (Frontend)
✅ `codevault-cli/services/authService.ts` - Auth service dengan real API  
✅ `codevault-cli/config.ts` - API configuration  

---

## 🧪 Test API dengan PowerShell

```powershell
# Test Login
$body = @{
    username = "demo"
    accessKey = "123456"
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri "http://127.0.0.1:8000/api/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

Write-Host "Token: $($response.token)"
Write-Host "User: $($response.user.name)"
```

---

## 📖 Dokumentasi Lengkap

- **INTEGRATION_GUIDE.md** - Penjelasan lengkap integrasi
- **API_TESTING.md** - Cara testing API
- **frontend/LARAVEL_INTEGRATION.md** - Dokumentasi untuk React app

---

## 🔐 Security Checklist

- [x] Password di-hash dengan bcrypt
- [x] Token menggunakan Laravel Sanctum
- [x] API dilindungi middleware auth:sanctum
- [x] CORS dikonfigurasi dengan benar
- [ ] HTTPS untuk production (to-do)
- [ ] Rate limiting untuk login (to-do)

---

## 🎉 Selamat!

Integrasi Laravel + React dengan Sanctum authentication sudah berhasil!

**Next Steps:**
1. Customize UI sesuai kebutuhan
2. Tambahkan fitur register user
3. Implementasi forgot password
4. Deploy ke production server

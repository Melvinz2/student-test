# Integrasi React CodeVault-CLI dengan Laravel

Dokumentasi ini menjelaskan cara mengintegrasikan aplikasi React (codevault-cli) dengan backend Laravel menggunakan Laravel Sanctum untuk autentikasi.

## Setup yang Telah Dilakukan

### 1. Backend Laravel

#### a. AuthController (`app/Http/Controllers/AuthController.php`)
Controller yang menangani:
- **POST /api/login** - Login user dengan username dan accessKey
- **GET /api/user** - Mendapatkan data user yang sedang login (protected)
- **POST /api/logout** - Logout dan menghapus token (protected)

#### b. User Model (`app/Models/User.php`)
- Ditambahkan trait `HasApiTokens` untuk Laravel Sanctum
- Ditambahkan kolom `username` ke fillable attributes

#### c. Migration
- Migration untuk menambahkan kolom `username` ke tabel users
- File: `database/migrations/2025_11_19_164302_add_username_to_users_table.php`

#### d. API Routes (`routes/api.php`)
```php
// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (auth:sanctum middleware)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'checkSession']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
```

#### e. CORS Configuration (`config/cors.php`)
Mengizinkan request dari aplikasi React

#### f. Sanctum Configuration
- Published dengan: `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`
- Middleware ditambahkan di `bootstrap/app.php`

#### g. User Seeder (`database/seeders/UserSeeder.php`)
Membuat 3 user test:
- username: `student_01`, password: `learn2code`
- username: `student_02`, password: `react_rocks`
- username: `demo`, password: `123456`

### 2. Frontend React

#### a. authService.ts (`codevault-cli/services/authService.ts`)
Diubah dari mock data menjadi real API calls:
- `login()` - Memanggil Laravel API `/api/login`
- `checkSession()` - Memanggil Laravel API `/api/user` dengan Bearer token
- `logout()` - Memanggil Laravel API `/api/logout`

#### b. config.ts (`codevault-cli/config.ts`)
File konfigurasi untuk menyimpan API endpoints yang bisa disesuaikan

## Cara Menjalankan

### 1. Setup Database

```bash
# Jalankan migration (jika belum)
php artisan migrate

# Jalankan seeder untuk membuat user test
php artisan db:seed --class=UserSeeder
```

### 2. Jalankan Laravel Server

**Opsi 1: Menggunakan XAMPP**
- Pastikan Apache sudah running
- Akses: `http://localhost/student-project/public/api`

**Opsi 2: Menggunakan PHP Artisan Serve**
```bash
php artisan serve
```
- Akses: `http://127.0.0.1:8000/api`
- **PENTING**: Jika menggunakan artisan serve, update `codevault-cli/config.ts`:
  ```typescript
  BASE_URL: 'http://127.0.0.1:8000/api',
  ```

### 3. Jalankan React App

```bash
cd codevault-cli
npm install
npm run dev
```

### 4. Test Login

Gunakan salah satu kredensial berikut:
- Username: `student_01`, Access Key: `learn2code`
- Username: `student_02`, Access Key: `react_rocks`
- Username: `demo`, Access Key: `123456`

## Konfigurasi

### Mengubah API URL

Edit file `codevault-cli/config.ts`:

```typescript
export const API_CONFIG = {
  // Untuk XAMPP
  BASE_URL: 'http://localhost/student-project/public/api',
  
  // Untuk php artisan serve
  // BASE_URL: 'http://127.0.0.1:8000/api',
  
  // Untuk custom domain
  // BASE_URL: 'http://yourdomain.test/api',
};
```

## Flow Autentikasi

1. **Login**:
   - User input username & accessKey
   - React mengirim POST request ke `/api/login`
   - Laravel memvalidasi kredensial
   - Jika valid, Laravel membuat Sanctum token dan mengembalikan user data + token
   - React menyimpan token di localStorage

2. **Check Session**:
   - Saat app load, React membaca token dari localStorage
   - React mengirim GET request ke `/api/user` dengan Authorization header
   - Laravel memvalidasi token
   - Jika valid, Laravel mengembalikan user data
   - Jika tidak valid, React menghapus token dan redirect ke login

3. **Logout**:
   - User click logout
   - React mengirim POST request ke `/api/logout`
   - Laravel menghapus token dari database
   - React menghapus token dari localStorage

## Security

- Password di-hash menggunakan bcrypt
- Token disimpan menggunakan Laravel Sanctum
- CORS dikonfigurasi untuk mencegah unauthorized access
- API routes dilindungi dengan `auth:sanctum` middleware

## Troubleshooting

### CORS Error
Pastikan file `config/cors.php` sudah dibuat dan `allowed_origins` di-set ke `['*']` untuk development.

### Token Invalid
Hapus token dari localStorage browser (Application > Local Storage) dan login ulang.

### Migration Error "duplicate column"
Kolom username mungkin sudah ada. Skip migration atau rollback dulu dengan `php artisan migrate:rollback`.

### 404 Not Found pada API
Periksa:
- Apache/PHP server sudah running
- URL di `config.ts` sudah benar
- File `.htaccess` di folder `public/` ada

## File yang Dimodifikasi/Dibuat

### Laravel:
- ✅ `app/Http/Controllers/AuthController.php` (created)
- ✅ `app/Models/User.php` (modified)
- ✅ `routes/api.php` (modified)
- ✅ `config/cors.php` (created)
- ✅ `config/sanctum.php` (published)
- ✅ `bootstrap/app.php` (modified)
- ✅ `database/migrations/2025_11_19_164302_add_username_to_users_table.php` (created)
- ✅ `database/seeders/UserSeeder.php` (modified)
- ✅ `database/seeders/DatabaseSeeder.php` (modified)

### React:
- ✅ `frontend/services/authService.ts` (modified)
- ✅ `frontend/config.ts` (created)
- ✅ `frontend/components/Login.tsx` (no changes needed)

## Next Steps

1. Implementasi refresh token untuk session yang lebih aman
2. Tambahkan rate limiting pada login endpoint
3. Implementasi email verification
4. Tambahkan forgot password functionality
5. Tambahkan user roles dan permissions

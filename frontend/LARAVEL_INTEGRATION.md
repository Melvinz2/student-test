# CodeVault CLI - Laravel Integration

## Perubahan dari Mock ke Real API

Aplikasi React CodeVault CLI telah diintegrasikan dengan backend Laravel menggunakan Laravel Sanctum untuk autentikasi.

## Konfigurasi

### 1. Update API URL

Edit file `config.ts` untuk menyesuaikan dengan environment Anda:

```typescript
export const API_CONFIG = {
  // Pilih salah satu:
  
  // XAMPP (default)
  BASE_URL: 'http://localhost/student-project/public/api',
  
  // PHP Artisan Serve
  // BASE_URL: 'http://127.0.0.1:8000/api',
  
  // Custom domain
  // BASE_URL: 'http://yourdomain.test/api',
};
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

## Perubahan pada authService.ts

File `services/authService.ts` telah diubah dari simulasi mock data menjadi real API calls:

### Sebelumnya (Mock):
- Data user disimpan dalam array statis
- Token dibuat secara fake
- Validasi dilakukan di frontend

### Sekarang (Real API):
- Data user diambil dari database Laravel
- Token dibuat oleh Laravel Sanctum
- Validasi dilakukan di backend
- Token disimpan di localStorage dan dikirim sebagai Bearer token

## API Endpoints

### POST /api/login
Login user dengan username dan access key.

**Request:**
```json
{
  "username": "demo",
  "accessKey": "123456"
}
```

**Response:**
```json
{
  "user": {
    "id": "3",
    "username": "demo",
    "name": "Demo User"
  },
  "token": "1|xxxxxxxxxxxxx"
}
```

### GET /api/user
Mendapatkan data user yang sedang login (requires authentication).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "3",
  "username": "demo",
  "name": "Demo User"
}
```

### POST /api/logout
Logout user dan hapus token (requires authentication).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## Test Credentials

Gunakan salah satu akun berikut untuk login:

1. **Student 01**
   - Username: `student_01`
   - Access Key: `learn2code`

2. **Student 02**
   - Username: `student_02`
   - Access Key: `react_rocks`

3. **Demo User**
   - Username: `demo`
   - Access Key: `123456`

## Alur Kerja

1. **Saat App Load:**
   - React cek localStorage untuk token
   - Jika ada, panggil `checkSession()` untuk validasi
   - Jika valid, user otomatis login
   - Jika tidak valid, redirect ke halaman login

2. **Saat Login:**
   - User input username & access key
   - React panggil `login()` ke Laravel API
   - Laravel validasi dan return token
   - Token disimpan di localStorage
   - User data disimpan di state

3. **Saat Logout:**
   - React panggil `logout()` ke Laravel API
   - Laravel hapus token dari database
   - React hapus token dari localStorage
   - Redirect ke halaman login

## Troubleshooting

### CORS Error
Pastikan Laravel server sudah running dan CORS dikonfigurasi dengan benar. Check `config/cors.php` di Laravel.

### Connection Error
- Pastikan Laravel server running (`php artisan serve` atau Apache)
- Pastikan URL di `config.ts` sudah benar
- Check browser console untuk error detail

### Token Invalid
- Clear localStorage di browser (F12 → Application → Local Storage)
- Login ulang untuk mendapatkan token baru

### 401 Unauthorized
- Token mungkin expired atau invalid
- Logout dan login ulang

## File Structure

```
codevault-cli/
├── services/
│   └── authService.ts          # ✅ Updated - Real API integration
├── components/
│   ├── Login.tsx              # No changes needed
│   ├── Dashboard.tsx          # No changes needed
│   └── ...
├── config.ts                  # ✅ New - API configuration
└── types.ts                   # No changes needed
```

## Environment Variables (Optional)

Untuk production, bisa menggunakan environment variables:

```typescript
// config.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost/student-project/public/api',
};
```

Lalu buat file `.env`:
```
VITE_API_URL=http://your-production-api.com/api
```

## Security Notes

- Token disimpan di localStorage (untuk development)
- Untuk production, pertimbangkan menggunakan httpOnly cookies
- Jangan commit file `.env` ke git
- Pastikan HTTPS digunakan di production

## Next Features

- [ ] Token refresh mechanism
- [ ] Remember me functionality
- [ ] Password reset via email
- [ ] User profile management
- [ ] Role-based access control

# Frontend - React Application

Frontend aplikasi Student Project menggunakan React, TypeScript, dan Vite dengan integrasi ke Laravel API.

## 🚀 Quick Start

### Development Mode
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

**App URL**: http://localhost:5173

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Production (Docker)
Frontend sudah dikonfigurasi untuk berjalan di Docker. Lihat root folder untuk docker-compose.yml.

## 🔧 Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Fetch API
- **Web Server**: Nginx (Production)

## 📁 Structure

```
frontend/
├── components/
│   ├── Login.tsx                # Login component
│   ├── Dashboard.tsx            # Dashboard component
│   └── ...                      # Other components
├── services/
│   ├── authService.ts           # API integration
│   └── geminiService.ts         # AI service
├── config.ts                    # API configuration
├── types.ts                     # TypeScript types
├── App.tsx                      # Main app component
└── docker/
    └── nginx.conf               # Production Nginx config
```

## ⚙️ Configuration

### API Endpoint

Edit `config.ts` untuk mengubah API URL:

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
};
```

### Environment Variables

Buat file `.env` untuk development:

```env
VITE_API_URL=http://localhost:8000/api
```

Untuk production, gunakan `.env.production`:

```env
VITE_API_URL=http://your-domain.com/api
```

## 🔐 Authentication Flow

1. User login dengan username & password
2. Frontend memanggil `/api/login`
3. Backend return token
4. Token disimpan di localStorage
5. Token dikirim sebagai Bearer token untuk authenticated requests

## 🎨 Features

- ✅ Modern React with TypeScript
- ✅ Responsive design dengan Tailwind CSS
- ✅ Real-time API integration
- ✅ Token-based authentication
- ✅ Session persistence
- ✅ Error handling
- ✅ Loading states

## 📦 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run type-check
```

## 🔗 API Integration

File `services/authService.ts` menangani semua komunikasi dengan backend:

```typescript
// Login
const { user, token } = await login(username, password);

// Check session
const user = await checkSession();

// Logout
await logout();
```

## 📚 Documentation

Lihat dokumentasi lengkap:
- **LARAVEL_INTEGRATION.md** - Integration details
- **../INTEGRATION_GUIDE.md** - Complete guide
- **../DOCKER_DEPLOYMENT.md** - Production deployment

---

**React Version**: 18.x  
**Created**: November 2025

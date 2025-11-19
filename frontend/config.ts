// API Configuration
export const API_CONFIG = {
  // Prioritas: Environment Variable > Manual Config
  // Untuk menggunakan env variable, buat file .env dari .env.example
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost/student-project/public/api',
  
  // Update manual jika tidak menggunakan env file:
  // - XAMPP: 'http://localhost/student-project/public/api'
  // - Artisan Serve: 'http://127.0.0.1:8000/api'
  // - Custom Domain: 'http://yourdomain.test/api'
};

export const ENDPOINTS = {
  LOGIN: `${API_CONFIG.BASE_URL}/login`,
  LOGOUT: `${API_CONFIG.BASE_URL}/logout`,
  USER: `${API_CONFIG.BASE_URL}/user`,
};

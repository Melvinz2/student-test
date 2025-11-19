
import { Student, AuthResponse } from '../types';
import { ENDPOINTS } from '../config';

// Token storage key
const TOKEN_KEY = 'codevault_session_token';

/**
 * Login function - communicates with Laravel API
 */
export const login = async (username: string, accessKey: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        username,
        accessKey,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Invalid credentials');
    }

    const data: AuthResponse = await response.json();
    
    // Save token to localStorage
    localStorage.setItem(TOKEN_KEY, data.token);

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Session check function - verifies token with Laravel API
 */
export const checkSession = async (): Promise<Student | null> => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    const response = await fetch(ENDPOINTS.USER, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Token is invalid or expired
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }

    const user: Student = await response.json();
    return user;
  } catch (error) {
    console.error('Session check error:', error);
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
};

/**
 * Logout function - revokes token on Laravel API
 */
export const logout = async (): Promise<void> => {
  const token = localStorage.getItem(TOKEN_KEY);
  
  if (token) {
    try {
      await fetch(ENDPOINTS.LOGOUT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  
  localStorage.removeItem(TOKEN_KEY);
};

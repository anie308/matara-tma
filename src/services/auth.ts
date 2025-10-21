// Authentication service using RTK Query
import { apiSlice } from './api';

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  hasPassword?: boolean;
}

export interface CreatePasswordRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

// Export RTK Query hooks for auth
export const {
  useCheckPasswordStatusQuery,
  useCreatePasswordMutation,
  useLoginMutation,
  useVerifyTokenQuery,
} = apiSlice;

// Helper functions for auth operations
export class AuthService {
  // Logout user
  static logout(): void {
    localStorage.removeItem('jwt_token');  
  }

  // Store JWT token
  static setToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  // Get JWT token
  static getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default AuthService;

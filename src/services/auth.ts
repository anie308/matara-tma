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
  useLazyVerifyTokenQuery
} = apiSlice;


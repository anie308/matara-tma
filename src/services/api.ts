import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const DEV = import.meta.env.VITE_APP_API_URL;
export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({ 
    baseUrl: DEV,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  keepUnusedDataFor: 30,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    // Auth endpoints
    checkPasswordStatus: builder.query<{ hasPassword: boolean; message?: string }, string>({
      query: (username) => `/auth/check-password?username=${encodeURIComponent(username)}`,
    }),
    createPassword: builder.mutation<{ token?: string; message?: string }, { username: string; password: string }>({
      query: (body) => ({
        url: '/api/auth/create-password',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<{ token?: string; message?: string }, { username: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    verifyToken: builder.query<{ message?: string }, void>({
      query: () => '/auth/verify-token',
    }),
  }),
  tagTypes: ['tasks', 'user', 'milestone', 'mining', 'bonus', 'auth']
});






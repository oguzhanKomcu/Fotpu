import apiClient from './client';
import {
  LoginUserCommand,
  RegisterUserCommand,
  LoginResponse,
  RefreshTokenUserCommand,
  LogoutUserCommand,
  UpdatePasswordCommand,
} from '@/types/auth';

export const authService = {
  login: async (command: LoginUserCommand): Promise<LoginResponse> => {
    const response = await apiClient.post<any>('/api/users/login', command);
    const raw = response.data;
    return {
      accessToken:
        raw?.accessToken || raw?.value?.accessToken || raw?.data?.accessToken,
      refreshToken:
        raw?.refreshToken || raw?.value?.refreshToken || raw?.data?.refreshToken,
      refreshTokenExpiresAt:
        raw?.refreshTokenExpiresAt ||
        raw?.value?.refreshTokenExpiresAt ||
        raw?.data?.refreshTokenExpiresAt,
    };
  },

  register: async (command: RegisterUserCommand): Promise<string> => {
    const response = await apiClient.post<any>('/api/users/register', command);
    const raw = response.data;
    return typeof raw === 'string'
      ? raw
      : raw?.value || raw?.data || raw?.id || String(raw);
  },

  refreshToken: async (command: RefreshTokenUserCommand): Promise<LoginResponse> => {
    const response = await apiClient.post<any>('/api/Auth/refresh-token', command);
    const raw = response.data;
    return {
      accessToken:
        raw?.accessToken || raw?.value?.accessToken || raw?.data?.accessToken,
      refreshToken:
        raw?.refreshToken || raw?.value?.refreshToken || raw?.data?.refreshToken,
      refreshTokenExpiresAt:
        raw?.refreshTokenExpiresAt ||
        raw?.value?.refreshTokenExpiresAt ||
        raw?.data?.refreshTokenExpiresAt,
    };
  },

  logout: async (command: LogoutUserCommand): Promise<void> => {
    await apiClient.post('/api/users/logout', command);
  },

  updatePassword: async (command: UpdatePasswordCommand): Promise<void> => {
    await apiClient.put('/api/users/update-password', command);
  },
};

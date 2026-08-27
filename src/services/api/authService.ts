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
    const response = await apiClient.post<LoginResponse>('/api/users/login', command);
    return response.data;
  },

  register: async (command: RegisterUserCommand): Promise<string> => {
    const response = await apiClient.post<string>('/api/users/register', command);
    return response.data;
  },

  refreshToken: async (command: RefreshTokenUserCommand): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/Auth/refresh-token', command);
    return response.data;
  },

  logout: async (command: LogoutUserCommand): Promise<void> => {
    await apiClient.post('/api/users/logout', command);
  },

  updatePassword: async (command: UpdatePasswordCommand): Promise<void> => {
    await apiClient.put('/api/users/update-password', command);
  },
};

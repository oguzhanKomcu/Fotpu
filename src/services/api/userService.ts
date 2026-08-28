import apiClient from './client';
import { UserProfileDto, UpdateProfileCommand } from '@/types/user';

export const userService = {
  getCurrentUser: async (): Promise<UserProfileDto> => {
    const response = await apiClient.get<any>('/api/users/current');
    return response.data?.value || response.data?.data || response.data;
  },

  getUserProfile: async (userId: string): Promise<UserProfileDto> => {
    const response = await apiClient.get<any>(`/api/users/profile/${userId}`);
    return response.data?.value || response.data?.data || response.data;
  },

  updateProfile: async (command: UpdateProfileCommand): Promise<void> => {
    await apiClient.put('/api/users/profile', command);
  },
};

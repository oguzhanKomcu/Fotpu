import apiClient from './client';
import { FollowUserCommand, UnfollowUserCommand } from '@/types/social';
import { PostDto } from '@/types/post';

export const socialService = {
  followUser: async (command: FollowUserCommand): Promise<void> => {
    await apiClient.post('/api/social/follows', command);
  },

  unfollowUser: async (command: UnfollowUserCommand): Promise<void> => {
    await apiClient.delete('/api/social/follows', { data: command });
  },

  getFollowers: async (
    userId: string,
    pageNumber = 1,
    pageSize = 10
  ): Promise<any> => {
    const response = await apiClient.get(`/api/social/follows/${userId}/followers`, {
      params: { pageNumber, pageSize },
    });
    return response.data;
  },

  getFollowing: async (
    userId: string,
    pageNumber = 1,
    pageSize = 10
  ): Promise<any> => {
    const response = await apiClient.get(`/api/social/follows/${userId}/following`, {
      params: { pageNumber, pageSize },
    });
    return response.data;
  },

  savePost: async (postId: string): Promise<void> => {
    await apiClient.post(`/api/social/saved-posts/${postId}`);
  },

  unsavePost: async (postId: string): Promise<void> => {
    await apiClient.delete(`/api/social/saved-posts/${postId}`);
  },

  getSavedPosts: async (pageNumber = 1, pageSize = 10): Promise<PostDto[]> => {
    const response = await apiClient.get('/api/social/saved-posts', {
      params: { pageNumber, pageSize },
    });
    return response.data;
  },
};

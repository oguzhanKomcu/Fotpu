import { Platform } from 'react-native';
import apiClient from './client';
import {
  PostDtoPagedListResult,
  CreatePostPayload,
  UpdatePostRequest,
} from '@/types/post';

export const postService = {
  /**
   * GET /api/Posts
   * Fetches paginated posts feed
   */
  getFeed: async (page = 1, pageSize = 10): Promise<PostDtoPagedListResult> => {
    const response = await apiClient.get<PostDtoPagedListResult>('/api/Posts', {
      params: { page, pageSize },
    });
    return response.data;
  },

  /**
   * POST /api/Posts
   * Multipart/form-data schema:
   * - UserId (UUID)
   * - Description (string)
   * - File (binary/image file)
   * - Tags (array of string)
   */
  createPost: async (payload: CreatePostPayload): Promise<void> => {
    const formData = new FormData();
    formData.append('UserId', payload.userId);
    formData.append('Description', payload.description);

    const cleanUri =
      Platform.OS === 'ios'
        ? payload.fileUri.replace('file://', '')
        : payload.fileUri;

    formData.append('File', {
      uri: cleanUri,
      type: payload.fileType || 'image/jpeg',
      name: payload.fileName || `outfit_${Date.now()}.jpg`,
    } as any);

    if (payload.tags && payload.tags.length > 0) {
      payload.tags.forEach((tag) => {
        formData.append('Tags', tag);
      });
    }

    await apiClient.post('/api/Posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * PUT /api/Posts/{postId}
   * Request body: UpdatePostRequest { description?: string }
   */
  updatePost: async (postId: string, request: UpdatePostRequest): Promise<void> => {
    await apiClient.put(`/api/Posts/${postId}`, request);
  },

  /**
   * DELETE /api/Posts/{postId}
   * Deletes a post by ID
   */
  deletePost: async (postId: string): Promise<void> => {
    await apiClient.delete(`/api/Posts/${postId}`);
  },
};

export const outfitService = postService;

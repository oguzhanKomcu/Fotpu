import apiClient from './client';
import {
  PostDto,
  PostDtoPagedListResult,
  CreatePostPayload,
  UpdatePostRequest,
} from '@/types/post';

export const postService = {
  getFeed: async (page = 1, pageSize = 10): Promise<PostDtoPagedListResult> => {
    const response = await apiClient.get<PostDtoPagedListResult>('/api/Posts', {
      params: { page, pageSize },
    });
    return response.data;
  },

  createPost: async (payload: CreatePostPayload): Promise<void> => {
    const formData = new FormData();
    formData.append('UserId', payload.userId);
    formData.append('Description', payload.description);

    formData.append('File', {
      uri: payload.fileUri,
      type: payload.fileType || 'image/jpeg',
      name: payload.fileName || 'outfit.jpg',
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

  updatePost: async (postId: string, request: UpdatePostRequest): Promise<void> => {
    await apiClient.put(`/api/Posts/${postId}`, request);
  },
};

export const outfitService = postService;

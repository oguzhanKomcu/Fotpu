import apiClient from './client';
import {
  CommentDtoListResult,
  CreateCommentRequest,
  UpdateCommentRequest,
} from '@/types/comment';

export const commentService = {
  getComments: async (
    postId: string,
    pageNumber = 1,
    pageSize = 10
  ): Promise<CommentDtoListResult> => {
    const response = await apiClient.get<CommentDtoListResult>(
      `/api/posts/${postId}/comments`,
      { params: { pageNumber, pageSize } }
    );
    return response.data;
  },

  createComment: async (
    postId: string,
    request: CreateCommentRequest
  ): Promise<void> => {
    await apiClient.post(`/api/posts/${postId}/comments`, request);
  },

  updateComment: async (
    postId: string,
    commentId: string,
    request: UpdateCommentRequest
  ): Promise<void> => {
    await apiClient.put(`/api/posts/${postId}/comments/${commentId}`, request);
  },

  deleteComment: async (
    postId: string,
    commentId: string,
    userId: string
  ): Promise<void> => {
    await apiClient.delete(`/api/posts/${postId}/comments/${commentId}`, {
      params: { userId },
    });
  },
};

import { HttpStatusCode } from './api';

export interface CommentDto {
  commentId: string;
  userId: string;
  content?: string | null;
  createdAt: string;
  updatedAt?: string | null;

  // UI helpers
  username?: string;
  userAvatarUrl?: string | null;
}

export interface CommentDtoListResult {
  isSuccess: boolean;
  isFailure: boolean;
  error?: string | null;
  statusCode?: HttpStatusCode;
  value?: CommentDto[] | null;
}

export interface CreateCommentRequest {
  userId: string;
  content?: string | null;
}

export interface UpdateCommentRequest {
  userId: string;
  newContent?: string | null;
}

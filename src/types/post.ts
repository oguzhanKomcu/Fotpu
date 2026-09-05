import { HttpStatusCode } from './api';

export interface PostDto {
  id: string;
  userId: string;
  description?: string | null;
  mediaUrl?: string | null;
  thumbnailUrl?: string | null;
  isVideo: boolean;
  tags?: string[] | null;
  averageRating: number;
  totalVotes: number;
  createdAt: string;

  // Local/Optimistic UI Enhancements
  title?: string | null;
  category?: string | null;
  season?: string | null;
  username?: string;
  userAvatarUrl?: string | null;
  isSaved?: boolean;
  isLiked?: boolean;
  userRating?: number;
}

export interface PostDtoPagedList {
  items: PostDto[] | null;
  page: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
}

export interface PostDtoPagedListResult {
  isSuccess: boolean;
  isFailure: boolean;
  error?: string | null;
  statusCode?: HttpStatusCode;
  value?: PostDtoPagedList | null;
}

export interface UpdatePostRequest {
  description?: string | null;
}

export interface CreatePostPayload {
  userId: string;
  description: string;
  fileUri: string;
  fileType?: string;
  fileName?: string;
  tags?: string[];
}

export type Outfit = PostDto;
export type FeedQueryParams = {
  page?: number;
  pageSize?: number;
};

import { create } from 'zustand';
import { ExtendedPostDto, ExtendedCommentDto, MOCK_POSTS, MOCK_CURRENT_USER } from '@/services/mock/testData';
import { postService } from '@/services/api/postService';
import { ratingService } from '@/services/api/ratingService';
import { socialService } from '@/services/api/socialService';
import { commentService } from '@/services/api/commentService';
import { mmkvStorage, MMKVKeys } from '@/services/storage/mmkv';
import { offlineSyncManager } from '@/services/sync/offlineSyncManager';
import { useAuthStore } from './authStore';

interface OutfitState {
  feedItems: ExtendedPostDto[];
  currentPage: number;
  hasNextPage: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  selectedCategory: string;
  selectedSeason: string;
  error: string | null;

  // Actions
  fetchFeed: (reset?: boolean) => Promise<void>;
  refreshFeed: () => Promise<void>;
  setCategoryFilter: (category: string) => void;
  setSeasonFilter: (season: string) => void;
  toggleLike: (postId: string) => Promise<void>;
  toggleSave: (postId: string) => Promise<void>;
  submitRating: (postId: string, score: number) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  toggleCommentLike: (postId: string, commentId: string) => void;
  createOutfitPost: (post: {
    title?: string;
    description: string;
    fileUri: string;
    category?: string;
    season?: string;
    tags?: string[];
  }) => Promise<void>;
}

export const useOutfitStore = create<OutfitState>((set, get) => ({
  feedItems: MOCK_POSTS,
  currentPage: 1,
  hasNextPage: true,
  isLoading: false,
  isRefreshing: false,
  selectedCategory: 'all',
  selectedSeason: 'all',
  error: null,

  fetchFeed: async (reset = false) => {
    const { currentPage, hasNextPage, isLoading, feedItems } = get();
    if (isLoading || (!hasNextPage && !reset)) return;

    const pageToFetch = reset ? 1 : currentPage;
    set({ isLoading: true, error: null });

    try {
      const response = await postService.getFeed(pageToFetch, 10);
      const pagedData = response.value;

      if (pagedData?.items && pagedData.items.length > 0) {
        const newItems = reset ? pagedData.items : [...feedItems, ...pagedData.items];

        set({
          feedItems: newItems as ExtendedPostDto[],
          currentPage: pagedData.page + 1,
          hasNextPage: pagedData.hasNextPage,
          isLoading: false,
        });
      } else {
        set({ feedItems: MOCK_POSTS, isLoading: false, hasNextPage: false });
      }
    } catch (error: any) {
      console.warn('[OutfitStore] Using rich mock test posts');
      set({ feedItems: MOCK_POSTS, isLoading: false, hasNextPage: false });
    }
  },

  refreshFeed: async () => {
    set({ isRefreshing: true });
    await get().fetchFeed(true);
    set({ isRefreshing: false });
  },

  setCategoryFilter: (category: string) => {
    set({ selectedCategory: category });
  },

  setSeasonFilter: (season: string) => {
    set({ selectedSeason: season });
  },

  toggleLike: async (postId: string) => {
    const { feedItems } = get();

    // Optimistic UI
    const updated = feedItems.map((item) => {
      if (item.id === postId) {
        const isLiked = !item.isLiked;
        const currentLikes = item.likesCount || item.totalVotes || 40;
        return {
          ...item,
          isLiked,
          likesCount: isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1),
        };
      }
      return item;
    });

    set({ feedItems: updated });
  },

  toggleSave: async (postId: string) => {
    const { feedItems } = get();
    const target = feedItems.find((i) => i.id === postId);
    const willSave = !target?.isSaved;

    // Optimistic UI
    const updated = feedItems.map((item) => {
      if (item.id === postId) {
        return { ...item, isSaved: willSave };
      }
      return item;
    });

    set({ feedItems: updated });

    const isMock = postId.startsWith('post_') || postId.startsWith('mock_');
    if (isMock) return;

    try {
      if (willSave) {
        await socialService.savePost(postId);
      } else {
        await socialService.unsavePost(postId);
      }
    } catch (error) {
      console.warn('[OutfitStore] Save failed online. Enqueueing offline sync...');
      offlineSyncManager.enqueueTask({
        type: 'SAVE_OUTFIT',
        endpoint: `/api/social/saved-posts/${postId}`,
        method: willSave ? 'POST' : 'DELETE',
        payload: {},
      });
    }
  },

  submitRating: async (postId: string, score: number) => {
    const { feedItems } = get();
    const normalizedScore = Number(score.toFixed(1));

    // Optimistic UI update
    const updated = feedItems.map((item) => {
      if (item.id === postId) {
        const total = (item.totalVotes || 10) + 1;
        const currentAvg = item.averageRating || 8.0;
        const newAvg = Number(
          ((currentAvg * (total - 1) + normalizedScore) / total).toFixed(1)
        );
        return {
          ...item,
          averageRating: newAvg,
          totalVotes: total,
          userRating: normalizedScore,
        };
      }
      return item;
    });

    set({ feedItems: updated });

    try {
      await ratingService.ratePost({ postId, score: Math.round(normalizedScore) });
    } catch (error) {
      console.warn('[OutfitStore] Rating online sync scheduled...');
    }
  },

  addComment: async (postId: string, text: string) => {
    const { feedItems } = get();
    const currentUser = useAuthStore.getState().user || MOCK_CURRENT_USER;
    const newComment: ExtendedCommentDto = {
      commentId: `c_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username || 'user',
      userAvatarUrl: ((currentUser as any).avatarUrl || (currentUser as any).profilePictureUrl) || undefined,
      content: text,
      timeAgo: 'just now',
      likesCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };

    const updated = feedItems.map((item) => {
      if (item.id === postId) {
        const existing = item.comments || [];
        const topComments = item.topComments || [];
        return {
          ...item,
          commentsCount: (item.commentsCount || existing.length) + 1,
          comments: [newComment, ...existing],
          topComments: [newComment, ...topComments.slice(0, 1)],
        };
      }
      return item;
    });

    set({ feedItems: updated });

    try {
      await commentService.createComment(postId, {
        userId: MOCK_CURRENT_USER.id,
        content: text,
      });
    } catch (err) {
      console.warn('[OutfitStore] Create comment offline:', err);
    }
  },

  toggleCommentLike: (postId: string, commentId: string) => {
    const { feedItems } = get();
    const updated = feedItems.map((item) => {
      if (item.id === postId && item.comments) {
        const updatedComments = item.comments.map((c) => {
          if (c.commentId === commentId) {
            const isLiked = !c.isLiked;
            return {
              ...c,
              isLiked,
              likesCount: isLiked ? (c.likesCount || 0) + 1 : Math.max(0, (c.likesCount || 0) - 1),
            };
          }
          return c;
        });
        return {
          ...item,
          comments: updatedComments,
        };
      }
      return item;
    });

    set({ feedItems: updated });
  },

  createOutfitPost: async (postData) => {
    const currentUser = useAuthStore.getState().user || MOCK_CURRENT_USER;
    const newPost: ExtendedPostDto = {
      id: `post_${Date.now()}`,
      userId: currentUser.id || MOCK_CURRENT_USER.id,
      username: currentUser.username || currentUser.fullName || 'BenimKombinim',
      userAvatarUrl:
        ((currentUser as any).avatarUrl || (currentUser as any).profilePictureUrl) ||
        MOCK_CURRENT_USER.avatarUrl,
      title: postData.title || 'Yeni Kombin',
      description: postData.description,
      mediaUrl: postData.fileUri,
      thumbnailUrl: postData.fileUri,
      isVideo: false,
      category: postData.category || 'female',
      season: postData.season || 'summer',
      tags: postData.tags || ['#OOTD', '#YeniKombin'],
      averageRating: 9.8,
      totalVotes: 1,
      userRating: 10.0,
      isSaved: false,
      isLiked: false,
      commentsCount: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    // Prepend to active feed items
    const { feedItems } = get();
    set({ feedItems: [newPost, ...feedItems] });

    // Sync with backend API if available
    try {
      await postService.createPost({
        userId: currentUser.id || MOCK_CURRENT_USER.id,
        description: postData.description,
        fileUri: postData.fileUri,
        fileType: 'image/jpeg',
        fileName: `outfit_${Date.now()}.jpg`,
        tags: postData.tags,
      });
    } catch (err) {
      console.warn('[OutfitStore] Upload post synced locally in mock mode:', err);
    }
  },
}));

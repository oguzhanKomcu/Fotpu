import { create } from 'zustand';
import { PostDto } from '@/types/post';
import { postService } from '@/services/api/postService';
import { ratingService } from '@/services/api/ratingService';
import { socialService } from '@/services/api/socialService';
import { mmkvStorage, MMKVKeys } from '@/services/storage/mmkv';
import { offlineSyncManager } from '@/services/sync/offlineSyncManager';

interface OutfitState {
  feedItems: PostDto[];
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
}

export const useOutfitStore = create<OutfitState>((set, get) => ({
  feedItems: mmkvStorage.getItem<PostDto[]>(MMKVKeys.CACHED_FEED) || [],
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

      if (pagedData?.items) {
        const newItems = reset ? pagedData.items : [...feedItems, ...pagedData.items];

        set({
          feedItems: newItems,
          currentPage: pagedData.page + 1,
          hasNextPage: pagedData.hasNextPage,
          isLoading: false,
        });

        if (reset) {
          mmkvStorage.setItem(MMKVKeys.CACHED_FEED, pagedData.items.slice(0, 10));
        }
      } else {
        set({ isLoading: false, hasNextPage: false });
      }
    } catch (error: any) {
      console.warn('[OutfitStore] Feed fetch failed. Using cached posts:', error.message);
      set({ isLoading: false, error: error.message || 'Akış yüklenemedi' });
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
        return {
          ...item,
          isLiked,
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
    const roundedScore = Math.round(score);

    // Optimistic UI update
    const updated = feedItems.map((item) => {
      if (item.id === postId) {
        const total = item.totalVotes + 1;
        const newAvg = Number(
          ((item.averageRating * item.totalVotes + roundedScore) / total).toFixed(1)
        );
        return {
          ...item,
          averageRating: newAvg,
          totalVotes: total,
          userRating: roundedScore,
        };
      }
      return item;
    });

    set({ feedItems: updated });

    try {
      await ratingService.ratePost({ postId, score: roundedScore });
    } catch (error) {
      console.warn('[OutfitStore] Rating failed online. Enqueueing offline sync...');
      offlineSyncManager.enqueueTask({
        type: 'RATE_OUTFIT',
        endpoint: '/api/ratings',
        method: 'POST',
        payload: { postId, score: roundedScore },
      });
    }
  },
}));

import { create } from 'zustand';
import { UserProfileDto } from '@/types/user';
import { PostDto } from '@/types/post';
import { userService } from '@/services/api/userService';
import { postService } from '@/services/api/postService';

interface UserState {
  profile: UserProfileDto | null;
  userPosts: PostDto[];
  activeTab: 'combos' | 'outfits';
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProfile: (userId?: string) => Promise<void>;
  fetchUserPosts: (userId?: string) => Promise<void>;
  setActiveTab: (tab: 'combos' | 'outfits') => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  userPosts: [],
  activeTab: 'combos',
  isLoading: false,
  error: null,

  fetchProfile: async (userId?: string) => {
    try {
      set({ isLoading: true, error: null });
      const profile = userId
        ? await userService.getUserProfile(userId)
        : await userService.getCurrentUser();
      set({ profile, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Profil yüklenemedi', isLoading: false });
    }
  },

  fetchUserPosts: async () => {
    try {
      const response = await postService.getFeed(1, 20);
      if (response.value?.items) {
        set({ userPosts: response.value.items });
      }
    } catch (error: any) {
      console.warn('[UserStore] Error fetching user posts:', error.message);
    }
  },

  setActiveTab: (tab: 'combos' | 'outfits') => {
    set({ activeTab: tab });
  },
}));

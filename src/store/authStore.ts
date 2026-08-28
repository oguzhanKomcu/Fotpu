import { create } from 'zustand';
import { UserProfileDto } from '@/types/user';
import { LoginUserCommand, RegisterUserCommand } from '@/types/auth';
import { authService } from '@/services/api/authService';
import { userService } from '@/services/api/userService';
import { secureStorage } from '@/services/storage/secureStorage';
import { mmkvStorage, MMKVKeys } from '@/services/storage/mmkv';

interface AuthState {
  user: UserProfileDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeAuth: () => Promise<void>;
  login: (command: LoginUserCommand) => Promise<void>;
  register: (command: RegisterUserCommand) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<UserProfileDto>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: mmkvStorage.getItem<UserProfileDto>(MMKVKeys.USER_DATA),
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initializeAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const tokens = await secureStorage.getTokens();
      const cachedUser = mmkvStorage.getItem<UserProfileDto>(MMKVKeys.USER_DATA);

      if (tokens?.accessToken) {
        // Fetch freshest profile in background
        userService
          .getCurrentUser()
          .then((freshUser) => {
            mmkvStorage.setItem(MMKVKeys.USER_DATA, freshUser);
            set({ user: freshUser });
          })
          .catch((err) => console.warn('[AuthStore] Failed to refresh profile on launch:', err.message));

        set({ user: cachedUser, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error: any) {
      console.error('[AuthStore] Initialization failed:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (command: LoginUserCommand) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.login(command);

      if (!response.accessToken) {
        throw new Error('Geçersiz kullanıcı adı veya şifre.');
      }

      await secureStorage.saveTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken || '',
        expiresIn: 3600,
      });

      // Retrieve Current Profile
      const currentUser = await userService.getCurrentUser();
      mmkvStorage.setItem(MMKVKeys.USER_DATA, currentUser);

      set({ user: currentUser, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Giriş yapılamadı';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (command: RegisterUserCommand) => {
    try {
      set({ isLoading: true, error: null });
      await authService.register(command);

      // Auto login after registration
      await get().login({
        emailOrUsername: command.email || command.username,
        password: command.password,
      });
    } catch (error: any) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Kayıt olunamadı';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    const user = get().user;
    const tokens = await secureStorage.getTokens();

    try {
      if (tokens?.accessToken && user?.id) {
        await authService.logout({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          logoutAllDevices: false,
          userId: user.id,
        }).catch(() => {});
      }
    } finally {
      await secureStorage.clearTokens();
      mmkvStorage.removeItem(MMKVKeys.USER_DATA);
      set({ user: null, isAuthenticated: false, error: null });
    }
  },

  updateUser: (updatedUser: Partial<UserProfileDto>) => {
    const current = get().user;
    if (current) {
      const merged = { ...current, ...updatedUser };
      mmkvStorage.setItem(MMKVKeys.USER_DATA, merged);
      set({ user: merged });
    }
  },

  clearError: () => set({ error: null }),
}));

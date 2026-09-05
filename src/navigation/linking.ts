import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    'fotpu://',
    'https://fotpu.app',
    'https://dev.fotpu.app',
  ],
  config: {
    screens: {
      Auth: {
        screens: {
          Splash: 'splash',
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
        },
      },
      App: {
        screens: {
          Home: 'home',
          Wardrobe: 'wardrobe',
          Saved: 'saved',
          Discover: 'discover',
          Upload: 'upload',
          Messages: 'messages',
          Profile: {
            screens: {
              ProfileMain: 'profile/:username?',
              Settings: 'settings',
              EditProfile: 'edit-profile',
            },
          },
        },
      },
      UploadOutfit: 'upload-outfit',
      OutfitDetail: 'outfit/:outfitId',
      CommentsModal: 'outfit/:outfitId/comments',
    },
  },
};

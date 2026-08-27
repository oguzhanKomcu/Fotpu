import { NavigatorScreenParams } from '@react-navigation/native';
import { Outfit } from './outfit';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: { email?: string } | undefined;
};

export type ProfileStackParamList = {
  ProfileMain: { username?: string } | undefined;
  EditProfile: undefined;
  Settings: undefined;
  SavedOutfits: undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Discover: undefined;
  Upload: undefined;
  Messages: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppTabParamList>;
  OutfitDetail: { outfitId: string; initialOutfit?: Outfit };
  CommentsModal: { outfitId: string };
};

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/store/languageStore';
import { FotpuImage } from '@/components/common/FotpuImage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@/types/navigation';
import Svg, { Path } from 'react-native-svg';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const currentUser = useAuthStore((state) => state.user);
  const { t } = useTranslation();
  const {
    profile,
    userPosts,
    activeTab,
    fetchProfile,
    fetchUserPosts,
    setActiveTab,
  } = useUserStore();

  useEffect(() => {
    fetchProfile(currentUser?.id);
    fetchUserPosts(currentUser?.id);
  }, [currentUser?.id]);

  const activeUser = profile || currentUser;

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Top App Bar */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-3 bg-background-light dark:bg-background-dark border-b border-gray-100 dark:border-zinc-800">
        <View className="w-10" />
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {t('profile.title')}
        </Text>
        {/* Settings Button (Top Right) */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Settings')}
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 items-center justify-center shadow-sm"
        >
          <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 15a3 3 0 100-6 3 3 0 000 6z"
              stroke="#333333"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
              stroke="#333333"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Profile Header */}
        <View className="items-center px-4 pt-6 pb-4">
          <FotpuImage
            uri={activeUser?.profilePictureUrl}
            style={{ width: 110, height: 110, borderRadius: 55 }}
          />

          <Text className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mt-3">
            @{activeUser?.username || 'stylemaven'}
          </Text>

          {activeUser?.fullName && (
            <Text className="text-sm font-medium text-gray-500 mt-0.5">
              {activeUser.fullName}
            </Text>
          )}

          {/* Followers / Following Counts */}
          <View className="flex-row items-center gap-6 mt-3">
            <View className="items-center">
              <Text className="text-base font-extrabold text-gray-900 dark:text-white">
                {activeUser?.followersCount || 0}
              </Text>
              <Text className="text-xs text-gray-400">{t('profile.followers')}</Text>
            </View>
            <View className="w-[1px] h-6 bg-gray-200 dark:bg-zinc-700" />
            <View className="items-center">
              <Text className="text-base font-extrabold text-gray-900 dark:text-white">
                {activeUser?.followingCount || 0}
              </Text>
              <Text className="text-xs text-gray-400">{t('profile.following')}</Text>
            </View>
          </View>

          {/* Total Style Score Badge */}
          <View className="flex-row items-center gap-1.5 mt-3 bg-yellow-400/10 dark:bg-yellow-400/20 px-3.5 py-1.5 rounded-full">
            <Text className="text-base">⭐</Text>
            <Text className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {t('profile.totalStyleScore')}: {(activeUser?.userScore || 8450).toLocaleString()}
            </Text>
          </View>

          {/* Edit Profile / Settings Shortcut Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Settings')}
            className="w-full max-w-xs h-10 mt-4 rounded-xl bg-gray-200/70 dark:bg-white/10 items-center justify-center"
          >
            <Text className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {t('profile.editProfile')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Switcher */}
        <View className="flex-row border-b border-gray-200/80 dark:border-zinc-700 px-4 mt-2">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('combos')}
            className={`flex-1 pb-3 items-center border-b-2 ${
              activeTab === 'combos' ? 'border-b-primary' : 'border-b-transparent'
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                activeTab === 'combos' ? 'text-gray-900 dark:text-white' : 'text-gray-400'
              }`}
            >
              {t('profile.aiCombos')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('outfits')}
            className={`flex-1 pb-3 items-center border-b-2 ${
              activeTab === 'outfits' ? 'border-b-primary' : 'border-b-transparent'
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                activeTab === 'outfits' ? 'text-gray-900 dark:text-white' : 'text-gray-400'
              }`}
            >
              {t('profile.myOutfits')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 2-Column Outfit Grid */}
        <View className="flex-row flex-wrap justify-between p-4">
          {userPosts.length === 0 ? (
            <View className="w-full py-12 items-center justify-center">
              <Text className="text-gray-400 text-sm">{t('profile.noOutfitsYet')}</Text>
            </View>
          ) : (
            userPosts.map((item) => (
              <View key={item.id} className="w-[48%] mb-4">
                <View className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800 shadow-sm">
                  <FotpuImage
                    uri={item.mediaUrl || item.thumbnailUrl}
                    style={{ width: '100%', height: '100%', borderRadius: 16 }}
                  />
                </View>

                {/* Card Meta */}
                <View className="pt-2 px-1">
                  <View className="flex-row items-center justify-between">
                    <Text
                      numberOfLines={1}
                      className="text-sm font-bold text-gray-900 dark:text-gray-100 flex-1"
                    >
                      {item.description || 'Kombin'}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-0.5 mt-0.5">
                    <Text className="text-xs">⭐</Text>
                    <Text className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      {(item.averageRating || 0).toFixed(1)} / 5 ({item.totalVotes})
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

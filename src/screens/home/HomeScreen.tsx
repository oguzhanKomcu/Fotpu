import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useOutfitStore } from '@/store/outfitStore';
import { useTranslation } from '@/store/languageStore';
import { FotpuImage } from '@/components/common/FotpuImage';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppTabParamList } from '@/types/navigation';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<BottomTabNavigationProp<AppTabParamList>>();
  const { t } = useTranslation();
  const {
    feedItems,
    selectedCategory,
    selectedSeason,
    setCategoryFilter,
    setSeasonFilter,
    fetchFeed,
    isRefreshing,
    refreshFeed,
    toggleLike,
  } = useOutfitStore();

  useEffect(() => {
    fetchFeed(true);
  }, []);

  const categoryTabs = [
    { key: 'female', label: t('home.womenswear') },
    { key: 'male', label: t('home.menswear') },
    { key: 'all', label: t('home.all') },
  ];

  const seasonTabs = [
    { key: 'spring', label: t('home.spring') },
    { key: 'summer', label: t('home.summer') },
    { key: 'autumn', label: t('home.autumn') },
    { key: 'winter', label: t('home.winter') },
  ];

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Top App Bar */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-3 bg-background-light dark:bg-background-dark border-b border-gray-100 dark:border-zinc-800">
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Text className="text-xl text-gray-800 dark:text-white">☰</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-extrabold text-[#181110] dark:text-white tracking-tight">
          {t('home.headerTitle')}
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refreshFeed} />
        }
      >
        {/* Primary CTA: Upload an item */}
        <View className="py-5">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Upload')}
            className="flex-row items-center justify-center rounded-2xl h-14 px-6 bg-pastel-lavender dark:bg-primary/20 shadow-sm"
          >
            <Text className="text-xl mr-3">📷</Text>
            <Text className="text-base font-extrabold text-[#181110] dark:text-white tracking-wide">
              {t('home.uploadItemCta')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Gender / Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row pb-3"
        >
          {categoryTabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.7}
              onPress={() => setCategoryFilter(tab.key)}
              className={`h-10 px-5 rounded-full mr-3 items-center justify-center ${
                selectedCategory === tab.key
                  ? 'bg-primary shadow-sm'
                  : 'bg-gray-200 dark:bg-zinc-800'
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  selectedCategory === tab.key
                    ? 'text-white font-bold'
                    : 'text-[#333333] dark:text-gray-300'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Season Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row pb-5"
        >
          {seasonTabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.7}
              onPress={() => setSeasonFilter(tab.key)}
              className={`h-10 px-5 rounded-full mr-3 items-center justify-center ${
                selectedSeason === tab.key
                  ? 'bg-primary shadow-sm'
                  : 'bg-gray-200 dark:bg-zinc-800'
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  selectedSeason === tab.key
                    ? 'text-white font-bold'
                    : 'text-[#333333] dark:text-gray-300'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Section Header: AI-Generated Looks */}
        <Text className="text-xl font-extrabold text-[#181110] dark:text-white pt-2 pb-4">
          {t('home.aiGeneratedLooks')}
        </Text>

        {/* Horizontal Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row pb-8"
        >
          {feedItems.slice(0, 10).map((item) => (
            <View key={item.id} className="relative w-48 mr-4">
              <View className="relative overflow-hidden rounded-2xl shadow-md aspect-[3/4] bg-gray-100 dark:bg-zinc-800">
                <FotpuImage
                  uri={item.mediaUrl || item.thumbnailUrl}
                  style={{ width: '100%', height: '100%', borderRadius: 16 }}
                />

                {/* Favorite Badge */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => toggleLike(item.id)}
                  className="absolute right-3 top-3 w-8 h-8 rounded-full bg-white/70 backdrop-blur-md items-center justify-center shadow-sm"
                >
                  <Text className="text-sm">{item.isLiked ? '❤️' : '🤍'}</Text>
                </TouchableOpacity>
              </View>

              {/* Title & Score */}
              <View className="flex-row items-center justify-between pt-2 px-1">
                <Text
                  numberOfLines={1}
                  className="text-sm font-bold text-[#333333] dark:text-gray-200 flex-1 pr-2"
                >
                  {item.description || t('home.trendyStyle')}
                </Text>
                <View className="flex-row items-center gap-0.5">
                  <Text className="text-xs">⭐</Text>
                  <Text className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {(item.averageRating || 0).toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

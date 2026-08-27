import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useOutfitStore } from '@/store/outfitStore';
import { useTranslation } from '@/store/languageStore';
import { OutfitCard } from '@/components/outfit/OutfitCard';
import { PostDto } from '@/types/post';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';

export const DiscoverScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const {
    feedItems,
    fetchFeed,
    refreshFeed,
    isRefreshing,
    isLoading,
    hasNextPage,
    toggleLike,
    toggleSave,
    submitRating,
  } = useOutfitStore();

  useEffect(() => {
    fetchFeed(true);
  }, []);

  const renderItem = ({ item }: { item: PostDto }) => (
    <OutfitCard
      outfit={item}
      onLikePress={toggleLike}
      onSavePress={toggleSave}
      onRateSubmit={submitRating}
      onCommentsPress={(outfitId) => navigation.navigate('CommentsModal', { outfitId })}
    />
  );

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Top App Bar */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-3 bg-background-light/90 dark:bg-background-dark/90 border-b border-gray-100 dark:border-zinc-800">
        <Text className="text-2xl font-extrabold text-[#333333] dark:text-white tracking-tight">
          {t('discover.title')}
        </Text>
        <TouchableOpacity className="h-9 w-9 rounded-full bg-primary/10 items-center justify-center">
          <Text className="text-base">🔍</Text>
        </TouchableOpacity>
      </View>

      {/* High-Performance FlashList Feed */}
      <View className="flex-1 px-3 pt-3">
        <FlashList
          data={feedItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          estimatedItemSize={520}
          onRefresh={refreshFeed}
          refreshing={isRefreshing}
          onEndReached={() => {
            if (hasNextPage && !isLoading) {
              fetchFeed();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading ? (
              <View className="py-6 items-center">
                <ActivityIndicator size="small" color="#7E47EB" />
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

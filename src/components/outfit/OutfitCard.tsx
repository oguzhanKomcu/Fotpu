import React, { useState, memo } from 'react';
import { View, Text, TouchableOpacity, Share } from 'react-native';
import { PostDto } from '@/types/post';
import { FotpuImage } from '../common/FotpuImage';
import { RatingSliderPopup } from '../rating/RatingSliderPopup';
import { useTranslation } from '@/store/languageStore';

interface OutfitCardProps {
  outfit: PostDto;
  onLikePress: (id: string) => void;
  onSavePress: (id: string) => void;
  onRateSubmit: (id: string, rating: number) => void;
  onCommentsPress: (id: string) => void;
  onUserPress?: (userId: string) => void;
}

export const OutfitCard = memo<OutfitCardProps>(({
  outfit,
  onLikePress,
  onSavePress,
  onRateSubmit,
  onCommentsPress,
  onUserPress,
}) => {
  const { t } = useTranslation();
  const [showRatingPopup, setShowRatingPopup] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${t('discover.shareMessage')} https://fotpu.app/outfit/${outfit.id}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <View className="flex-col gap-3 rounded-2xl bg-white dark:bg-zinc-800/90 p-4 mb-4 shadow-sm border border-gray-100 dark:border-zinc-700/50">
      {/* Header: User Info */}
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onUserPress?.(outfit.userId)}
          className="flex-row items-center gap-3"
        >
          <FotpuImage
            uri={outfit.userAvatarUrl}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
          <View>
            <Text className="text-sm font-bold text-[#333333] dark:text-gray-100">
              {outfit.username || 'Combince Stylist'}
            </Text>
            <Text className="text-[11px] font-medium text-primary">AI Look</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="p-1">
          <Text className="text-gray-400 font-bold text-lg">•••</Text>
        </TouchableOpacity>
      </View>

      {/* Outfit Image (3:4 Ratio) */}
      <View className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-700">
        <FotpuImage
          uri={outfit.mediaUrl || outfit.thumbnailUrl}
          style={{ width: '100%', height: '100%', borderRadius: 12 }}
        />
      </View>

      {/* Action Bar */}
      <View className="flex-row items-center justify-between pt-1 relative">
        {/* Left Actions: Like, Comment, Share, Save */}
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onLikePress(outfit.id)}
            className="flex-row items-center"
          >
            <Text className="text-xl">{outfit.isLiked ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onCommentsPress(outfit.id)}
            className="flex-row items-center"
          >
            <Text className="text-xl">💬</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleShare}
            className="flex-row items-center"
          >
            <Text className="text-xl">🚀</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onSavePress(outfit.id)}
            className="flex-row items-center"
          >
            <Text className="text-xl">{outfit.isSaved ? '🔖' : '🏷️'}</Text>
          </TouchableOpacity>
        </View>

        {/* Right Actions: Rating Button + Score Badge */}
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowRatingPopup(!showRatingPopup)}
            className="h-8 px-3.5 rounded-full border border-primary/30 bg-primary/10 items-center justify-center"
          >
            <Text className="text-xs font-bold uppercase tracking-wider text-primary">
              {outfit.userRating
                ? `${t('discover.yourRating')}: ${outfit.userRating}`
                : t('discover.rateButtonText')}
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center gap-1 bg-yellow-500/10 dark:bg-yellow-500/20 px-2 py-1 rounded-full">
            <Text className="text-sm">⭐</Text>
            <Text className="text-sm font-extrabold text-[#333333] dark:text-gray-100">
              {(outfit.averageRating || 0).toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Rating Slider Popup */}
        {showRatingPopup && (
          <RatingSliderPopup
            initialRating={outfit.userRating || 5}
            onRateSubmit={(rating) => onRateSubmit(outfit.id, rating)}
            onClose={() => setShowRatingPopup(false)}
          />
        )}
      </View>

      {/* Stats & Description */}
      <View className="pt-1">
        <Text className="text-sm font-bold text-[#333333] dark:text-gray-200">
          {outfit.totalVotes} {t('discover.ratingsCount')}
        </Text>
        {outfit.description ? (
          <Text className="mt-1 text-sm text-[#333333] dark:text-gray-300">
            {outfit.description}
          </Text>
        ) : null}
      </View>

      {/* Comment Link */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onCommentsPress(outfit.id)}
        className="pt-1"
      >
        <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {t('discover.firstCommentPrompt')}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

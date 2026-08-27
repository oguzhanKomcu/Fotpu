import React, { useState } from 'react';
import { View, Text, TouchableOpacity, PanResponder } from 'react-native';
import { useTranslation } from '@/store/languageStore';

interface RatingSliderPopupProps {
  initialRating?: number;
  onRateSubmit: (rating: number) => void;
  onClose: () => void;
}

export const RatingSliderPopup: React.FC<RatingSliderPopupProps> = ({
  initialRating = 5,
  onRateSubmit,
  onClose,
}) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number>(initialRating);
  const [sliderWidth, setSliderWidth] = useState<number>(180);

  const calculateRatingFromX = (x: number) => {
    const clampedX = Math.max(0, Math.min(x, sliderWidth));
    const ratio = clampedX / sliderWidth;
    const computed = 1.0 + ratio * 4.0; // 1 to 5 scale (or up to 10)
    return Math.round(computed);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const newRating = calculateRatingFromX(gestureState.dx + ((rating - 1) / 4) * sliderWidth);
      setRating(newRating);
    },
    onPanResponderRelease: () => {},
  });

  const progressPercent = ((rating - 1) / 4) * 100;

  return (
    <View className="absolute bottom-12 right-0 z-30 w-56 p-4 rounded-2xl bg-white/95 dark:bg-zinc-900/95 border border-purple-100 dark:border-zinc-700 shadow-2xl">
      {/* Header */}
      <View className="flex-row items-center justify-between pb-2">
        <Text className="text-xs font-bold text-primary uppercase tracking-wider">
          {t('discover.rateLook')}
        </Text>
        <View className="bg-primary/10 px-2 py-0.5 rounded-full">
          <Text className="text-sm font-extrabold text-primary">{rating} / 5</Text>
        </View>
      </View>

      {/* Interactive Slider Track */}
      <View
        className="py-3"
        onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
      >
        <View className="h-2 w-full bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden justify-center">
          <View
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-primary rounded-full"
          />
        </View>

        {/* Min / Max Labels */}
        <View className="flex-row justify-between mt-2">
          <Text className="text-[10px] font-medium text-gray-400">1</Text>
          <Text className="text-[10px] font-medium text-gray-400">5</Text>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row gap-2 mt-1">
        <TouchableOpacity
          onPress={onClose}
          className="flex-1 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 items-center"
        >
          <Text className="text-xs font-semibold text-gray-600 dark:text-gray-300">
            {t('common.cancel')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onRateSubmit(rating);
            onClose();
          }}
          className="flex-1 py-2 rounded-lg bg-primary items-center"
        >
          <Text className="text-xs font-bold text-white">
            {t('discover.rateButtonText')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

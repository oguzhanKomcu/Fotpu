import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  StyleSheet,
} from 'react-native';
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
    const computed = 1.0 + ratio * 4.0;
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
    <View style={styles.popupContainer}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.titleText}>{t('discover.rateLook')}</Text>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>{rating} / 5</Text>
        </View>
      </View>

      {/* Interactive Slider Track */}
      <View
        style={styles.sliderBox}
        onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
      >
        <View style={styles.trackBackground}>
          <View style={[styles.trackFill, { width: `${progressPercent}%` }]} />
        </View>

        {/* Min / Max Labels */}
        <View style={styles.rangeLabelsRow}>
          <Text style={styles.rangeLabel}>1</Text>
          <Text style={styles.rangeLabel}>5</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onClose}
          style={styles.cancelBtn}
        >
          <Text style={styles.cancelText}>{t('common.cancel')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            onRateSubmit(rating);
            onClose();
          }}
          style={styles.submitBtn}
        >
          <Text style={styles.submitText}>{t('discover.rateButtonText')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    bottom: 50,
    right: 0,
    zIndex: 99,
    width: 230,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7e47eb',
    textTransform: 'uppercase',
  },
  scoreBadge: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#7e47eb',
  },
  sliderBox: {
    paddingVertical: 8,
  },
  trackBackground: {
    height: 8,
    width: '100%',
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    backgroundColor: '#7e47eb',
    borderRadius: 4,
  },
  rangeLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rangeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  submitBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#7e47eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

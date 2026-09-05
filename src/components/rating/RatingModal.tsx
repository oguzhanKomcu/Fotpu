import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
  PanResponder,
} from 'react-native';
import { useTranslation } from '@/store/languageStore';
import Svg, { Path } from 'react-native-svg';

interface RatingModalProps {
  visible: boolean;
  initialRating?: number;
  currentAverage?: number;
  onRateSubmit: (rating: number) => void;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  initialRating = 8.0,
  onRateSubmit,
  onClose,
}) => {
  const { t } = useTranslation();
  const [selectedScore, setSelectedScore] = useState<number>(initialRating || 8.0);

  // Integers 2 to 10 without decimals
  const quickScores = [2, 3, 4, 5, 6, 7, 8, 9, 10];

  const trackRef = useRef<View>(null);
  const trackWidthRef = useRef<number>(300);
  const trackPageXRef = useRef<number>(0);

  const updateScoreFromPageX = (pageX: number) => {
    const width = trackWidthRef.current || 300;
    const startX = trackPageXRef.current;
    const relativeX = pageX - startX;
    const ratio = Math.max(0, Math.min(1, relativeX / width));
    const score = +(1.0 + ratio * 9.0).toFixed(1);
    setSelectedScore(score);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        const touchPageX = evt.nativeEvent?.pageX ?? gestureState.x0;
        trackRef.current?.measureInWindow((pageX, _pageY, width) => {
          if (width > 0) {
            trackWidthRef.current = width;
            trackPageXRef.current = pageX;
            const relativeX = touchPageX - pageX;
            const ratio = Math.max(0, Math.min(1, relativeX / width));
            const score = +(1.0 + ratio * 9.0).toFixed(1);
            setSelectedScore(score);
          }
        });
      },
      onPanResponderMove: (_evt, gestureState) => {
        updateScoreFromPageX(gestureState.moveX);
      },
    })
  ).current;

  const handleScoreSelect = (score: number) => {
    setSelectedScore(score);
  };

  const handleConfirm = () => {
    onRateSubmit(selectedScore);
    onClose();
  };

  const sliderPercent = Math.max(0, Math.min(100, ((selectedScore - 1.0) / 9.0) * 100));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.overlay} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.placeholder} />
            <Text style={styles.title}>{t('discover.rateOutfitTitle')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="#111827"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* Big Score Display */}
          <View style={styles.scoreDisplayBox}>
            <Text style={styles.starIcon}>★</Text>
            <Text style={styles.scoreNumber}>{selectedScore.toFixed(1)}</Text>
            <Text style={styles.maxScore}>/ 10</Text>
          </View>

          {/* Quick Score Chips (2 to 10) */}
          <Text style={styles.sectionSubtitle}>{t('discover.chooseRating')}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickScrollContent}
            style={styles.quickScrollView}
          >
            {quickScores.map((score) => {
              const isSelected = Math.abs(selectedScore - score) < 0.05;
              return (
                <TouchableOpacity
                  key={score}
                  activeOpacity={0.75}
                  onPress={() => handleScoreSelect(score)}
                  style={[
                    styles.scoreChip,
                    isSelected ? styles.scoreChipActive : styles.scoreChipInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.scoreChipText,
                      isSelected ? styles.scoreChipTextActive : styles.scoreChipTextInactive,
                    ]}
                  >
                    {score}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Fine-tune Section with Slider Bar and Stepper */}
          <View style={styles.fineTuneSection}>
            <View style={styles.fineTuneHeader}>
              <Text style={styles.sectionSubtitle}>{t('discover.fineTuneScore')}</Text>
              <Text style={styles.fineTuneValueHint}>{selectedScore.toFixed(1)} / 10</Text>
            </View>

            {/* Slider Track */}
            <View
              ref={trackRef}
              style={styles.sliderTouchArea}
              onLayout={(e) => {
                trackWidthRef.current = e.nativeEvent.layout.width;
              }}
              {...panResponder.panHandlers}
            >
              <View style={styles.sliderTrackBg}>
                <View
                  style={[
                    styles.sliderTrackFilled,
                    { width: `${sliderPercent}%` },
                  ]}
                />
              </View>
              <View
                style={[
                  styles.sliderThumb,
                  {
                    left: `${sliderPercent}%`,
                    transform: [{ translateX: -12 }],
                  },
                ]}
              >
                <View style={styles.sliderThumbCore} />
              </View>
            </View>

            {/* Stepper Buttons (-0.1 / +0.1) */}
            <View style={styles.stepperRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSelectedScore((prev) => Math.max(1.0, +(prev - 0.1).toFixed(1)))}
                style={styles.stepBtn}
              >
                <Text style={styles.stepBtnText}>-0.1</Text>
              </TouchableOpacity>
              <Text style={styles.stepInfoText}>{t('discover.sliderHint')}</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSelectedScore((prev) => Math.min(10.0, +(prev + 0.1).toFixed(1)))}
                style={styles.stepBtn}
              >
                <Text style={styles.stepBtnText}>+0.1</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onClose}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleConfirm}
              style={styles.submitBtn}
            >
              <Text style={styles.submitBtnText}>{t('discover.submitRating')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  placeholder: {
    width: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreDisplayBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F3FF',
    borderRadius: 20,
    paddingVertical: 12,
    marginBottom: 14,
  },
  starIcon: {
    fontSize: 28,
    color: '#FBBF24',
    marginRight: 6,
  },
  scoreNumber: {
    fontSize: 34,
    fontWeight: '800',
    color: '#7E47EB',
  },
  maxScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    marginLeft: 4,
    marginTop: 10,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  quickScrollView: {
    marginBottom: 16,
  },
  quickScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 8,
  },
  scoreChip: {
    minWidth: 42,
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreChipActive: {
    backgroundColor: '#7E47EB',
    shadowColor: '#7E47EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreChipInactive: {
    backgroundColor: '#F3F4F6',
  },
  scoreChipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  scoreChipTextActive: {
    color: '#FFFFFF',
  },
  scoreChipTextInactive: {
    color: '#374151',
  },
  fineTuneSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
  },
  fineTuneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  fineTuneValueHint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7E47EB',
  },
  sliderTouchArea: {
    height: 36,
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  sliderTrackBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
    width: '100%',
  },
  sliderTrackFilled: {
    height: '100%',
    backgroundColor: '#7E47EB',
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    top: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#7E47EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7E47EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
  sliderThumbCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7E47EB',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  stepBtn: {
    backgroundColor: '#ECEAFE',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stepBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7E47EB',
  },
  stepInfoText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  submitBtn: {
    flex: 1.6,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#7E47EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7E47EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});


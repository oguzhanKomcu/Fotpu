import React, { useRef, useState, useEffect } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FotpuImage } from './FotpuImage';
import Svg, { Path } from 'react-native-svg';

interface ImageViewerModalProps {
  visible: boolean;
  imageUrl: string;
  onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  visible,
  imageUrl,
  onClose,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const currentScale = useRef(1);
  const currentTranslateX = useRef(0);
  const currentTranslateY = useRef(0);

  const lastTap = useRef<number>(0);
  const initialDistance = useRef<number | null>(null);
  const initialMidpoint = useRef<{ x: number; y: number } | null>(null);
  const baseScale = useRef(1);
  const baseTranslateX = useRef(0);
  const baseTranslateY = useRef(0);
  const singleTouchStart = useRef<{ x: number; y: number } | null>(null);

  // Keep ref values in sync with Animated values
  useEffect(() => {
    const scaleListener = scale.addListener(({ value }) => {
      currentScale.current = value;
    });
    const txListener = translateX.addListener(({ value }) => {
      currentTranslateX.current = value;
    });
    const tyListener = translateY.addListener(({ value }) => {
      currentTranslateY.current = value;
    });

    return () => {
      scale.removeListener(scaleListener);
      translateX.removeListener(txListener);
      translateY.removeListener(tyListener);
    };
  }, []);

  // Reset transform when modal opens/closes
  useEffect(() => {
    if (visible) {
      scale.setValue(1);
      translateX.setValue(0);
      translateY.setValue(0);
      opacity.setValue(1);
      currentScale.current = 1;
      currentTranslateX.current = 0;
      currentTranslateY.current = 0;
      initialDistance.current = null;
      initialMidpoint.current = null;
    }
  }, [visible]);

  const resetTransform = (animate = true) => {
    if (animate) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 7,
          tension: 40,
        }),
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          friction: 7,
          tension: 40,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 7,
          tension: 40,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        currentScale.current = 1;
        currentTranslateX.current = 0;
        currentTranslateY.current = 0;
      });
    } else {
      scale.setValue(1);
      translateX.setValue(0);
      translateY.setValue(0);
      opacity.setValue(1);
      currentScale.current = 1;
      currentTranslateX.current = 0;
      currentTranslateY.current = 0;
    }
  };

  const calcDistance = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,

      onPanResponderGrant: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length === 2) {
          // 2-finger pinch start
          initialDistance.current = calcDistance(
            touches[0].pageX,
            touches[0].pageY,
            touches[1].pageX,
            touches[1].pageY
          );
          initialMidpoint.current = {
            x: (touches[0].pageX + touches[1].pageX) / 2,
            y: (touches[0].pageY + touches[1].pageY) / 2,
          };
          baseScale.current = currentScale.current;
          baseTranslateX.current = currentTranslateX.current;
          baseTranslateY.current = currentTranslateY.current;
        } else if (touches.length === 1) {
          singleTouchStart.current = {
            x: touches[0].pageX,
            y: touches[0].pageY,
          };
          baseTranslateX.current = currentTranslateX.current;
          baseTranslateY.current = currentTranslateY.current;

          // Double tap zoom toggle
          const now = Date.now();
          if (now - lastTap.current < 280) {
            if (currentScale.current > 1.2) {
              resetTransform(true);
            } else {
              Animated.parallel([
                Animated.spring(scale, {
                  toValue: 2.5,
                  useNativeDriver: true,
                  friction: 6,
                }),
                Animated.spring(translateX, {
                  toValue: 0,
                  useNativeDriver: true,
                  friction: 6,
                }),
                Animated.spring(translateY, {
                  toValue: 0,
                  useNativeDriver: true,
                  friction: 6,
                }),
              ]).start(() => {
                currentScale.current = 2.5;
                currentTranslateX.current = 0;
                currentTranslateY.current = 0;
              });
            }
            lastTap.current = 0;
          } else {
            lastTap.current = now;
          }
        }
      },

      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;

        if (touches.length >= 2) {
          // 2-finger pinch-to-zoom and pan
          const currentDistance = calcDistance(
            touches[0].pageX,
            touches[0].pageY,
            touches[1].pageX,
            touches[1].pageY
          );
          const currentMidX = (touches[0].pageX + touches[1].pageX) / 2;
          const currentMidY = (touches[0].pageY + touches[1].pageY) / 2;

          if (initialDistance.current === null) {
            // Second finger arrived during movement
            initialDistance.current = currentDistance;
            initialMidpoint.current = { x: currentMidX, y: currentMidY };
            baseScale.current = currentScale.current;
            baseTranslateX.current = currentTranslateX.current;
            baseTranslateY.current = currentTranslateY.current;
          } else {
            // Compute scale factor
            const factor = currentDistance / initialDistance.current;
            let targetScale = baseScale.current * factor;
            // Bound scale between 0.7x (rubberband) and 4.5x
            targetScale = Math.max(0.7, Math.min(targetScale, 4.5));
            scale.setValue(targetScale);

            // Compute midpoint translation
            if (initialMidpoint.current) {
              const dx = currentMidX - initialMidpoint.current.x;
              const dy = currentMidY - initialMidpoint.current.y;
              translateX.setValue(baseTranslateX.current + dx);
              translateY.setValue(baseTranslateY.current + dy);
            }
          }
        } else if (touches.length === 1) {
          // If returning from 2 fingers to 1 finger
          if (initialDistance.current !== null) {
            initialDistance.current = null;
            initialMidpoint.current = null;
            baseScale.current = currentScale.current;
            baseTranslateX.current = currentTranslateX.current;
            baseTranslateY.current = currentTranslateY.current;
            singleTouchStart.current = {
              x: touches[0].pageX,
              y: touches[0].pageY,
            };
          }

          if (currentScale.current > 1.05) {
            // 1-finger pan when zoomed in
            if (singleTouchStart.current) {
              const dx = touches[0].pageX - singleTouchStart.current.x;
              const dy = touches[0].pageY - singleTouchStart.current.y;
              translateX.setValue(baseTranslateX.current + dx);
              translateY.setValue(baseTranslateY.current + dy);
            }
          } else {
            // 1-finger swipe down to dismiss when at normal scale (1x)
            if (gestureState.dy > 0) {
              translateY.setValue(gestureState.dy);
              const newOpacity = Math.max(1 - gestureState.dy / (SCREEN_HEIGHT * 0.5), 0.2);
              opacity.setValue(newOpacity);
            }
          }
        }
      },

      onPanResponderRelease: (_, gestureState) => {
        initialDistance.current = null;
        initialMidpoint.current = null;
        singleTouchStart.current = null;

        if (currentScale.current < 1.0) {
          // Zoom out rubberband: return to 1x
          resetTransform(true);
        } else if (currentScale.current > 3.8) {
          // Zoom in cap
          Animated.spring(scale, {
            toValue: 3.5,
            useNativeDriver: true,
            friction: 7,
          }).start(() => {
            currentScale.current = 3.5;
          });
        } else if (currentScale.current <= 1.05) {
          // If pulled down far enough at 1x, close modal
          if (gestureState.dy > 100) {
            Animated.timing(translateY, {
              toValue: SCREEN_HEIGHT,
              duration: 180,
              useNativeDriver: true,
            }).start(onClose);
          } else {
            resetTransform(true);
          }
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />

        {/* Top Header / Close Button */}
        <SafeAreaView edges={['top']} style={styles.topSafeArea}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.closeBtn}
            >
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="#FFFFFF"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Zoomable / Pannable Image Area */}
        <View style={styles.imageContainer} {...panResponder.panHandlers}>
          <Animated.View
            style={[
              styles.imageWrapper,
              {
                opacity,
                transform: [
                  { translateX },
                  { translateY },
                  { scale },
                ],
              },
            ]}
          >
            <FotpuImage
              uri={imageUrl}
              style={styles.image}
            />
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerRow: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.33,
    maxWidth: SCREEN_WIDTH,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { useAuthStore } from '@/store/authStore';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { initializeAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
      setTimeout(() => {
        if (!isAuthenticated) {
          navigation.replace('Login');
        }
      }, 2000);
    };

    init();
  }, [initializeAuth, isAuthenticated, navigation]);

  return (
    <LinearGradient
      colors={['#FFFDD0', '#FFDAB9', '#E6E6FA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View className="items-center justify-center space-y-6">
        {/* Animated Hanger Logo (Vector SVG) */}
        <View className="w-32 h-32 items-center justify-center">
          <Svg viewBox="0 0 100 100" width="100" height="100">
            <G fill="none" stroke="#4a4a4a" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
              <Path d="M 30 55 C 30 40, 40 30, 50 30 C 60 30, 70 40, 70 55 L 85 55 L 15 55 L 30 55 Z" />
              <Path d="M 50 30 L 50 15 Q 50 10, 55 15" />
            </G>
          </Svg>
        </View>

        {/* Brand Name */}
        <Text className="text-[#4a4a4a] text-4xl font-extrabold tracking-tight">
          Fotpu
        </Text>
        <Text className="text-[#6f6388] text-sm font-medium tracking-wide">
          Your Personal AI Stylist & Outfit Rating
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

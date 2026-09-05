import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '@/store/languageStore';
import { useOutfitStore } from '@/store/outfitStore';
import { FotpuImage } from '@/components/common/FotpuImage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import Svg, { Path } from 'react-native-svg';

export const SavedScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { feedItems, toggleSave } = useOutfitStore();

  const savedItems = feedItems.filter((item) => item.isSaved);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {savedItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <Svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                  stroke="#7E47EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={styles.emptyTitle}>No Saved Outfits Yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the bookmark icon on any outfit to save it to your collection.
            </Text>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {savedItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('OutfitDetail', { outfitId: item.id, initialOutfit: item })}
                style={styles.gridCard}
              >
                <View style={styles.imageWrapper}>
                  <FotpuImage uri={item.mediaUrl || item.thumbnailUrl} style={styles.cardImage} />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => toggleSave(item.id)}
                    style={styles.saveBtn}
                  >
                    <Svg width="18" height="18" viewBox="0 0 24 24" fill="#7E47EB">
                      <Path
                        d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                        stroke="#7E47EB"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </TouchableOpacity>
                </View>
                <View style={styles.metaContainer}>
                  <Text numberOfLines={1} style={styles.cardTitle}>
                    {item.description || 'Saved Look'}
                  </Text>
                  <View style={styles.ratingRow}>
                    <Text style={styles.star}>★</Text>
                    <Text style={styles.rating}>{(item.averageRating || 8.5).toFixed(1)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF9F8',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 14,
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  saveBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaContainer: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 12,
    color: '#FBBF24',
    marginRight: 3,
  },
  rating: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    paddingHorizontal: 30,
  },
  emptyIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ECEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

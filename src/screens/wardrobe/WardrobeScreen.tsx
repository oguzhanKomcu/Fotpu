import React, { useState } from 'react';
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

export const WardrobeScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { feedItems } = useOutfitStore();
  const [selectedSection, setSelectedSection] = useState<'all' | 'tops' | 'bottoms' | 'dresses' | 'shoes'>('all');

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'tops', label: 'Tops' },
    { key: 'bottoms', label: 'Bottoms' },
    { key: 'dresses', label: 'Dresses' },
    { key: 'shoes', label: 'Shoes' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wardrobe</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('UploadOutfit')}
          style={styles.addBtn}
        >
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <Path d="M12 5v14M5 12h14" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => {
            const isSelected = selectedSection === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                activeOpacity={0.75}
                onPress={() => setSelectedSection(cat.key as any)}
                style={[
                  styles.filterPill,
                  isSelected ? styles.filterPillActive : styles.filterPillInactive,
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isSelected ? styles.filterPillTextActive : styles.filterPillTextInactive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Wardrobe Grid */}
        <View style={styles.gridContainer}>
          {feedItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>👗</Text>
              <Text style={styles.emptyTitle}>Your Wardrobe is Empty</Text>
              <Text style={styles.emptySubtitle}>Upload your clothes and outfits to manage your digital closet.</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('UploadOutfit')}
                style={styles.uploadCta}
              >
                <Text style={styles.uploadCtaText}>Upload an item</Text>
              </TouchableOpacity>
            </View>
          ) : (
            feedItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('OutfitDetail', { outfitId: item.id, initialOutfit: item })}
                style={styles.gridCard}
              >
                <View style={styles.imageWrapper}>
                  <FotpuImage uri={item.mediaUrl || item.thumbnailUrl} style={styles.cardImage} />
                </View>
                <Text numberOfLines={1} style={styles.cardTitle}>
                  {item.description || 'Outfit'}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
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
    justifyContent: 'space-between',
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
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ECEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF9F8',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: '#ECEAFE',
  },
  filterPillInactive: {
    backgroundColor: '#ECEEF2',
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#111827',
  },
  filterPillTextInactive: {
    color: '#4B5563',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingBottom: 24,
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
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    padding: 10,
  },
  emptyContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
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
    marginBottom: 20,
    lineHeight: 20,
  },
  uploadCta: {
    backgroundColor: '#ECEAFE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  uploadCtaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
});

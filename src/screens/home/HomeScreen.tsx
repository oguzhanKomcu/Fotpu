import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fotpu</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Upload')}
          style={styles.headerUploadBtn}
        >
          <Text style={styles.headerUploadIcon}>➕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshFeed}
            colors={['#7e47eb']}
          />
        }
      >
        {/* Banner CTA */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => navigation.navigate('Upload')}
          style={styles.bannerCta}
        >
          <View style={styles.bannerIconBox}>
            <Text style={styles.bannerIcon}>✨</Text>
          </View>
          <View style={styles.bannerTextBox}>
            <Text style={styles.bannerTitle}>{t('home.uploadItemCta')}</Text>
            <Text style={styles.bannerSubTitle}>Kombinini paylaş, AI ve topluluk puanlasın!</Text>
          </View>
          <Text style={styles.bannerArrow}>➔</Text>
        </TouchableOpacity>

        {/* Category Pills */}
        <Text style={styles.filterSectionTitle}>Kategori</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterRow}
        >
          {categoryTabs.map((tab) => {
            const isSelected = selectedCategory === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.75}
                onPress={() => setCategoryFilter(tab.key)}
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
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Season Pills */}
        <Text style={styles.filterSectionTitle}>Mevsim</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterRow}
        >
          {seasonTabs.map((tab) => {
            const isSelected = selectedSeason === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.75}
                onPress={() => setSeasonFilter(tab.key)}
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
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t('home.aiGeneratedLooks')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Discover')}>
            <Text style={styles.sectionMoreLink}>Tümü ➔</Text>
          </TouchableOpacity>
        </View>

        {/* Cards Grid / Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsRow}
        >
          {feedItems.map((item) => (
            <View key={item.id} style={styles.outfitCard}>
              <View style={styles.imageContainer}>
                <FotpuImage
                  uri={item.mediaUrl || item.thumbnailUrl}
                  style={styles.cardImage}
                />
                {/* Like Button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => toggleLike(item.id)}
                  style={styles.likeBadge}
                >
                  <Text style={styles.likeIcon}>{item.isLiked ? '❤️' : '🤍'}</Text>
                </TouchableOpacity>

                {/* Rating Badge */}
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingStar}>★</Text>
                  <Text style={styles.ratingNumber}>
                    {(item.averageRating || 8.5).toFixed(1)}
                  </Text>
                </View>
              </View>

              {/* Card Meta */}
              <View style={styles.cardMeta}>
                <Text numberOfLines={1} style={styles.cardDescription}>
                  {item.description || t('home.trendyStyle')}
                </Text>
                <Text style={styles.cardVotes}>
                  {item.totalVotes || 42} oylama
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
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
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#181110',
    letterSpacing: -0.5,
  },
  headerUploadBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerUploadIcon: {
    fontSize: 16,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FAF9F8',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  bannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6E6FA',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  bannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerIcon: {
    fontSize: 22,
  },
  bannerTextBox: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#181110',
    marginBottom: 2,
  },
  bannerSubTitle: {
    fontSize: 12,
    color: '#555555',
  },
  bannerArrow: {
    fontSize: 18,
    color: '#7e47eb',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  filterSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  filterScrollView: {
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    height: 38,
    paddingHorizontal: 18,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: '#7e47eb',
    shadowColor: '#7e47eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  filterPillInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  filterPillTextInactive: {
    color: '#444444',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#181110',
  },
  sectionMoreLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7e47eb',
  },
  cardsRow: {
    paddingBottom: 24,
    gap: 16,
  },
  outfitCard: {
    width: 200,
    marginRight: 14,
  },
  imageContainer: {
    width: '100%',
    height: 260,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#EAEAEA',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  likeBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  likeIcon: {
    fontSize: 16,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingStar: {
    fontSize: 12,
    color: '#FBBF24',
    marginRight: 4,
  },
  ratingNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardMeta: {
    paddingTop: 8,
    paddingHorizontal: 2,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 2,
  },
  cardVotes: {
    fontSize: 12,
    color: '#888888',
  },
});

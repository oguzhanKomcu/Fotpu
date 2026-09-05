import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StyleSheet,
  StatusBar,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOutfitStore } from '@/store/outfitStore';
import { useTranslation } from '@/store/languageStore';
import { FotpuImage } from '@/components/common/FotpuImage';
import { OutfitCard } from '@/components/outfit/OutfitCard';
import { CommentsBottomSheet } from '@/components/outfit/CommentsBottomSheet';
import { RatingModal } from '@/components/rating/RatingModal';
import { ExtendedPostDto, MOCK_CURRENT_USER } from '@/services/mock/testData';
import { socialService } from '@/services/api/socialService';
import Svg, { Path } from 'react-native-svg';

export const DiscoverScreen: React.FC = () => {
  const { t } = useTranslation();
  const {
    feedItems,
    fetchFeed,
    refreshFeed,
    isRefreshing,
    toggleSave,
    submitRating,
    addComment,
    toggleCommentLike,
  } = useOutfitStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeason, setSelectedSeason] = useState('all');

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [followedUserIds, setFollowedUserIds] = useState<Set<string>>(new Set());

  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [activeRatingPost, setActiveRatingPost] = useState<ExtendedPostDto | null>(null);

  useEffect(() => {
    fetchFeed(true);
  }, []);

  // Handle hardware back button on Android to return to grid view if in feed view
  useEffect(() => {
    const onBackPress = () => {
      if (selectedPostId) {
        setSelectedPostId(null);
        return true;
      }
      return false;
    };

    const backHandlerSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );
    return () => backHandlerSubscription.remove();
  }, [selectedPostId]);

  const categoryTabs = [
    { key: 'female', label: t('home.womenswear') },
    { key: 'male', label: t('home.menswear') },
    { key: 'all', label: t('home.all') },
  ];

  const seasonTabs = [
    { key: 'all', label: t('home.all') },
    { key: 'spring', label: t('home.spring') },
    { key: 'summer', label: t('home.summer') },
    { key: 'autumn', label: t('home.autumn') },
    { key: 'winter', label: t('home.winter') },
  ];

  // Filter feed items according to search, category, and season
  const filteredItems = useMemo(() => {
    return feedItems.filter((item) => {
      // Search matching
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchUser = item.username?.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query);
        const matchTags = item.tags?.some((tag) => tag.toLowerCase().includes(query));
        if (!matchUser && !matchDesc && !matchTags) {
          return false;
        }
      }

      // Category matching
      if (selectedCategory !== 'all') {
        const itemCat = (item as any).category?.toLowerCase();
        if (itemCat && itemCat !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Season matching
      if (selectedSeason !== 'all') {
        const itemSeason = (item as any).season?.toLowerCase();
        if (itemSeason && itemSeason !== selectedSeason.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [feedItems, searchQuery, selectedCategory, selectedSeason]);

  // Order detail feed items starting from the clicked post and then subsequent discover posts
  const detailFeedItems = useMemo(() => {
    if (!selectedPostId) return [];
    const clickedIndex = filteredItems.findIndex((item) => item.id === selectedPostId);
    if (clickedIndex === -1) {
      // If not in filtered items, find in feedItems
      const rawIndex = feedItems.findIndex((item) => item.id === selectedPostId);
      if (rawIndex === -1) return filteredItems;
      return [...feedItems.slice(rawIndex), ...feedItems.slice(0, rawIndex)];
    }
    return [...filteredItems.slice(clickedIndex), ...filteredItems.slice(0, clickedIndex)];
  }, [filteredItems, feedItems, selectedPostId]);

  const activePost = feedItems.find((p) => p.id === activeCommentsPostId);

  const handleToggleFollow = async (userId: string) => {
    const isCurrentlyFollowing = followedUserIds.has(userId);
    setFollowedUserIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyFollowing) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });

    try {
      if (isCurrentlyFollowing) {
        await socialService.unfollowUser({
          followerId: MOCK_CURRENT_USER.id,
          followingId: userId,
        });
      } else {
        await socialService.followUser({
          followerId: MOCK_CURRENT_USER.id,
          followingId: userId,
        });
      }
    } catch (error) {
      console.log('Follow API call completed/mock fallback:', error);
    }
  };

  const handleOpenComments = (postId: string) => {
    setActiveCommentsPostId(postId);
  };

  const handleCloseComments = () => {
    setActiveCommentsPostId(null);
  };

  const handleOpenRating = (outfit: ExtendedPostDto) => {
    setActiveRatingPost(outfit);
  };

  const handleCloseRating = () => {
    setActiveRatingPost(null);
  };

  const handleAddComment = (text: string) => {
    if (activeCommentsPostId) {
      addComment(activeCommentsPostId, text);
    }
  };

  const handleToggleCommentLike = (commentId: string) => {
    if (activeCommentsPostId) {
      toggleCommentLike(activeCommentsPostId, commentId);
    }
  };

  const handleRateSubmit = (rating: number) => {
    if (activeRatingPost) {
      submitRating(activeRatingPost.id, rating);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSeason('all');
  };

  // If a post is clicked, render the Full Feed View (Home-style large cards starting at clicked post)
  if (selectedPostId) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Feed View Header with Back button */}
        <View style={styles.detailHeader}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSelectedPostId(null)}
            style={styles.backBtn}
          >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 19l-7-7 7-7"
                stroke="#111827"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
          <Text style={styles.detailHeaderTitle}>{t('discover.title')}</Text>
          <View style={styles.detailHeaderPlaceholder} />
        </View>

        {/* Scrollable Feed List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollContainer}
          contentContainerStyle={styles.detailScrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshFeed}
              colors={['#7E47EB']}
            />
          }
        >
          {detailFeedItems.map((item) => (
            <OutfitCard
              key={item.id}
              outfit={item}
              onSavePress={toggleSave}
              onRatePress={handleOpenRating}
              onCommentsPress={handleOpenComments}
              showFollowButton={item.userId !== MOCK_CURRENT_USER.id}
              isFollowing={followedUserIds.has(item.userId)}
              onFollowPress={handleToggleFollow}
            />
          ))}
        </ScrollView>

        {/* Comments Bottom Sheet */}
        {activePost && (
          <CommentsBottomSheet
            visible={!!activeCommentsPostId}
            comments={activePost.comments || []}
            onClose={handleCloseComments}
            onAddComment={handleAddComment}
            onToggleCommentLike={handleToggleCommentLike}
          />
        )}

        {/* Rating Modal */}
        {activeRatingPost && (
          <RatingModal
            visible={!!activeRatingPost}
            initialRating={activeRatingPost.userRating || 8.0}
            currentAverage={activeRatingPost.averageRating}
            onRateSubmit={handleRateSubmit}
            onClose={handleCloseRating}
          />
        )}
      </SafeAreaView>
    );
  }

  // Otherwise, render Grid Discovery Mode
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('discover.title')}</Text>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={styles.searchIcon}>
            <Path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              stroke="#7E47EB"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('discover.searchPlaceholder')}
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            returnKeyType="search"
            clearButtonMode="never"
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSearchQuery('')}
              style={styles.clearSearchBtn}
            >
              <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="#9CA3AF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter Pills Section */}
      <View style={styles.filtersSection}>
        {/* Category Filter Pills */}
        <View style={styles.categoryRow}>
          {categoryTabs.map((tab) => {
            const isSelected = selectedCategory === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(tab.key)}
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
        </View>

        {/* Season Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.seasonsScrollRow}
        >
          {seasonTabs.map((tab) => {
            const isSelected = selectedSeason === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.8}
                onPress={() => setSelectedSeason(tab.key)}
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
      </View>

      {/* Main Grid Feed */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshFeed}
            colors={['#7E47EB']}
          />
        }
      >
        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  stroke="#7E47EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={styles.emptyTitle}>{t('discover.noResults')}</Text>
            <Text style={styles.emptySubtitle}>{t('discover.noResultsDesc')}</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleClearFilters}
              style={styles.clearFiltersBtn}
            >
              <Text style={styles.clearFiltersText}>{t('discover.clearFilters')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {filteredItems.map((item) => {
              const ratingScore = item.averageRating || 8.0;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.88}
                  onPress={() => setSelectedPostId(item.id)}
                  style={styles.gridCard}
                >
                  {/* Image with Floating Badges */}
                  <View style={styles.imageWrapper}>
                    <FotpuImage
                      uri={item.mediaUrl || item.thumbnailUrl}
                      style={styles.cardImage}
                    />

                    {/* Bookmark Save Button */}
                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        toggleSave(item.id);
                      }}
                      style={styles.saveBadge}
                    >
                      <Svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={item.isSaved ? '#7E47EB' : 'none'}
                      >
                        <Path
                          d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                          stroke={item.isSaved ? '#7E47EB' : '#111827'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    </TouchableOpacity>

                    {/* Rating Pill Badge */}
                    <View style={styles.ratingBadge}>
                      <Text style={styles.starIcon}>★</Text>
                      <Text style={styles.ratingText}>{ratingScore.toFixed(1)}</Text>
                    </View>
                  </View>

                  {/* Card Info: User & Description Snippet */}
                  <View style={styles.cardInfo}>
                    {/* User Row */}
                    <View style={styles.userRow}>
                      <View style={styles.userAvatarWrapper}>
                        <FotpuImage
                          uri={item.userAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                          style={styles.userAvatarImg}
                        />
                      </View>
                      <Text numberOfLines={1} style={styles.usernameText}>
                        {item.username || 'FotpuStyle'}
                      </Text>
                    </View>

                    {/* Description (Partial snippet) */}
                    {item.description ? (
                      <Text numberOfLines={2} style={styles.descriptionSnippet}>
                        {item.description}
                      </Text>
                    ) : null}

                    {/* Quick Comments Link */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        handleOpenComments(item.id);
                      }}
                      style={styles.commentsQuickBtn}
                    >
                      <Svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
                          stroke="#6B7280"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                      <Text style={styles.commentsCountText}>
                        {item.commentsCount || (item.comments?.length || 0)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Comments Bottom Sheet */}
      {activePost && (
        <CommentsBottomSheet
          visible={!!activeCommentsPostId}
          comments={activePost.comments || []}
          onClose={handleCloseComments}
          onAddComment={handleAddComment}
          onToggleCommentLike={handleToggleCommentLike}
        />
      )}

      {/* Rating Modal */}
      {activeRatingPost && (
        <RatingModal
          visible={!!activeRatingPost}
          initialRating={activeRatingPost.userRating || 8.0}
          currentAverage={activeRatingPost.averageRating}
          onRateSubmit={handleRateSubmit}
          onClose={handleCloseRating}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.4,
  },
  detailHeader: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  detailHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  detailHeaderPlaceholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    paddingVertical: 0,
  },
  clearSearchBtn: {
    padding: 4,
  },
  filtersSection: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  seasonsScrollRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterPillActive: {
    backgroundColor: '#ECEAFE',
  },
  filterPillInactive: {
    backgroundColor: '#F3F4F6',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  filterPillTextActive: {
    color: '#111827',
  },
  filterPillTextInactive: {
    color: '#111827',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FAF9F8',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  detailScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 12,
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
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
  saveBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.90)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.78)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
    gap: 3,
  },
  starIcon: {
    fontSize: 11,
    color: '#FBBF24',
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardInfo: {
    padding: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userAvatarWrapper: {
    width: 18,
    height: 18,
    borderRadius: 9,
    overflow: 'hidden',
    backgroundColor: '#ECEAFE',
    marginRight: 6,
  },
  userAvatarImg: {
    width: '100%',
    height: '100%',
  },
  usernameText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  descriptionSnippet: {
    fontSize: 12,
    lineHeight: 16,
    color: '#4B5563',
    fontWeight: '500',
    marginBottom: 6,
  },
  commentsQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  commentsCountText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ECEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  clearFiltersBtn: {
    backgroundColor: '#7E47EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  clearFiltersText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

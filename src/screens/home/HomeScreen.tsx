import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOutfitStore } from '@/store/outfitStore';
import { useTranslation } from '@/store/languageStore';
import { OutfitCard } from '@/components/outfit/OutfitCard';
import { CommentsBottomSheet } from '@/components/outfit/CommentsBottomSheet';
import { RatingModal } from '@/components/rating/RatingModal';
import { ExtendedPostDto } from '@/services/mock/testData';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import Svg, { Path } from 'react-native-svg';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const {
    feedItems,
    fetchFeed,
    isRefreshing,
    refreshFeed,
    toggleLike,
    toggleSave,
    submitRating,
    addComment,
    toggleCommentLike,
  } = useOutfitStore();

  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [activeRatingPost, setActiveRatingPost] = useState<ExtendedPostDto | null>(null);

  useEffect(() => {
    fetchFeed(true);
  }, []);

  const activePost = feedItems.find((p) => p.id === activeCommentsPostId);

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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {}}
          style={styles.menuBtn}
        >
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              stroke="#111827"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Fotpu</Text>

        {/* Dummy placeholder for perfect center alignment */}
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshFeed}
            colors={['#8B7EF8']}
          />
        }
      >
        {/* Upload an item CTA button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('UploadOutfit')}
          style={styles.uploadCtaBox}
        >
          <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <Path
              d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
              stroke="#111827"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M12 9v6M9 12h6"
              stroke="#111827"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.uploadCtaText}>{t('home.uploadItemCta')}</Text>
        </TouchableOpacity>

        {/* Following / Feed Posts */}
        <View style={styles.feedSection}>
          <Text style={styles.feedSectionTitle}>{t('home.followingFeed')}</Text>
          {feedItems.map((item) => (
            <OutfitCard
              key={item.id}
              outfit={item}
              onLikePress={toggleLike}
              onSavePress={toggleSave}
              onRatePress={handleOpenRating}
              onCommentsPress={handleOpenComments}
            />
          ))}
        </View>
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
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  menuBtn: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FAF9F8',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 30,
  },
  uploadCtaBox: {
    height: 56,
    backgroundColor: '#ECEAFE',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  uploadCtaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  pillsScrollRow: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 4,
    marginBottom: 16,
  },
  filterPill: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#1F2937',
  },
  feedSection: {
    marginTop: 6,
  },
  feedSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 14,
    marginLeft: 4,
  },
});

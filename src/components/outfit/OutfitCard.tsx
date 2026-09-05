import React, { memo, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Share,
  StyleSheet,
  Animated,
} from 'react-native';
import { ExtendedPostDto, MOCK_CURRENT_USER } from '@/services/mock/testData';
import { FotpuImage } from '../common/FotpuImage';
import { ImageViewerModal } from '../common/ImageViewerModal';
import { useTranslation } from '@/store/languageStore';
import Svg, { Path } from 'react-native-svg';

interface OutfitCardProps {
  outfit: ExtendedPostDto;
  onLikePress?: (id: string) => void;
  onSavePress?: (id: string) => void;
  onRatePress: (outfit: ExtendedPostDto) => void;
  onCommentsPress: (id: string) => void;
  onUserPress?: (userId: string) => void;
  showFollowButton?: boolean;
  isFollowing?: boolean;
  onFollowPress?: (userId: string) => void;
  onImagePress?: (imageUrl: string) => void;
}

export const OutfitCard = memo<OutfitCardProps>(({
  outfit,
  onSavePress,
  onRatePress,
  onCommentsPress,
  onUserPress,
  showFollowButton,
  isFollowing,
  onFollowPress,
  onImagePress,
}) => {
  const { t } = useTranslation();
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(8)).current;
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${outfit.username || 'this stylist'}'s look on Fotpu: https://fotpu.app/outfit/${outfit.id}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleSavePress = () => {
    const willBeSaved = !outfit.isSaved;
    onSavePress?.(outfit.id);

    const msg = willBeSaved ? t('common.savedSuccess') : t('common.unsavedSuccess');
    setToastMessage(msg);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastOpacity.setValue(0);
    toastTranslateY.setValue(8);

    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(toastTranslateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    toastTimeoutRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(toastTranslateY, {
          toValue: -6,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToastMessage(null);
      });
    }, 1500);
  };

  const commentsCount = outfit.commentsCount || (outfit.comments?.length || 0);
  const ratingScore = outfit.averageRating || 8.0;
  const ratingsCount = outfit.totalVotes || 0;

  return (
    <View style={styles.card}>
      {/* Header: Avatar + Username + Follow Button + More dots */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onUserPress?.(outfit.userId)}
          style={styles.userInfoBtn}
        >
          <View style={styles.avatarWrapper}>
            <FotpuImage
              uri={outfit.userAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              style={styles.avatarImage}
            />
          </View>
          <Text style={styles.usernameText}>
            {outfit.username || 'FotpuStyle'}
          </Text>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          {showFollowButton && (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => onFollowPress?.(outfit.userId)}
              style={[
                styles.followBtn,
                isFollowing ? styles.followingBtn : styles.notFollowingBtn,
              ]}
            >
              <Text
                style={[
                  styles.followBtnText,
                  isFollowing ? styles.followingBtnText : styles.notFollowingBtnText,
                ]}
              >
                {isFollowing ? t('common.following') : t('common.follow')}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity activeOpacity={0.6} style={styles.moreBtn}>
            <Text style={styles.moreDots}>•••</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Image with Floating Toast */}
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => {
          setIsImageViewerOpen(true);
          onImagePress?.(outfit.mediaUrl || outfit.thumbnailUrl || '');
        }}
        style={styles.imageWrapper}
      >
        <FotpuImage
          uri={outfit.mediaUrl || outfit.thumbnailUrl}
          style={styles.postImage}
        />
        {toastMessage ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.toastContainer,
              {
                opacity: toastOpacity,
                transform: [{ translateY: toastTranslateY }],
              },
            ]}
          >
            <View style={styles.toastPill}>
              <Svg width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF">
                <Path
                  d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.toastText}>{toastMessage}</Text>
            </View>
          </Animated.View>
        ) : null}
      </TouchableOpacity>

      {/* Action Bar (Save, Comment, Share | RATING, Star Score) */}
      <View style={styles.actionBar}>
        {/* Left Icons */}
        <View style={styles.leftActions}>
          {/* Bookmark / Save */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSavePress}
            style={styles.iconBtn}
          >
            <Svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={outfit.isSaved ? '#7E47EB' : 'none'}
            >
              <Path
                d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                stroke={outfit.isSaved ? '#7E47EB' : '#111827'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>

          {/* Comment */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onCommentsPress(outfit.id)}
            style={styles.iconBtn}
          >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
                stroke="#111827"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>

          {/* Share / Paper Plane */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleShare}
            style={styles.iconBtn}
          >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                stroke="#111827"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Right Actions: RATING Button & Star Score */}
        <View style={styles.rightActions}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onRatePress(outfit)}
            style={[
              styles.ratingPill,
              outfit.userRating ? styles.ratingPillRated : styles.ratingPillDefault,
            ]}
          >
            <Text
              style={[
                styles.ratingPillText,
                outfit.userRating ? styles.ratingPillTextRated : styles.ratingPillTextDefault,
              ]}
            >
              {outfit.userRating
                ? `${t('discover.ratedButtonText')} ${outfit.userRating}`
                : t('discover.rateButtonText')}
            </Text>
          </TouchableOpacity>

          <View style={styles.starScoreBox}>
            <Text style={styles.starIcon}>★</Text>
            <Text style={styles.starScoreNumber}>{ratingScore.toFixed(1)}</Text>
          </View>
        </View>
      </View>

      {/* Ratings Count */}
      <Text style={styles.ratingsCountText}>
        {ratingsCount > 0
          ? `${ratingsCount.toLocaleString()} ${t('discover.ratingsCount')}`
          : t('discover.firstToRate')}
      </Text>

      {/* Caption */}
      {outfit.description ? (
        <Text style={styles.captionText}>
          <Text style={styles.captionUsername}>
            {outfit.username || 'FotpuStyle'}{' '}
          </Text>
          <Text style={styles.captionBody}>{outfit.description}</Text>
        </Text>
      ) : null}

      {/* View all comments link */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onCommentsPress(outfit.id)}
        style={styles.viewCommentsBtn}
      >
        <Text style={styles.viewCommentsText}>
          {t('discover.viewAllComments', { count: commentsCount })}
        </Text>
      </TouchableOpacity>

      {/* Comment Snippets (Top 2) */}
      {outfit.topComments && outfit.topComments.length > 0 ? (
        <View style={styles.commentSnippets}>
          {outfit.topComments.map((tc, idx) => (
            <Text key={tc.commentId || idx} style={styles.snippetLine}>
              <Text style={styles.snippetUsername}>{tc.username} </Text>
              <Text style={styles.snippetBody}>{tc.content}</Text>
            </Text>
          ))}
        </View>
      ) : null}

      {/* Inline Quick Add Comment Bar */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onCommentsPress(outfit.id)}
        style={styles.inlineCommentBar}
      >
        <View style={styles.inlineUserAvatar}>
          <FotpuImage
            uri={MOCK_CURRENT_USER.avatarUrl}
            style={styles.inlineAvatarImg}
          />
        </View>
        <View style={styles.inlineInputFake}>
          <Text style={styles.inlineInputPlaceholder}>
            {t('discover.addCommentPlaceholder')}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Fullscreen Zoomable Image Viewer Modal */}
      <ImageViewerModal
        visible={isImageViewerOpen}
        imageUrl={outfit.mediaUrl || outfit.thumbnailUrl || ''}
        onClose={() => setIsImageViewerOpen(false)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userInfoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  followBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFollowingBtn: {
    backgroundColor: '#7E47EB',
  },
  followingBtn: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  followBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  notFollowingBtnText: {
    color: '#FFFFFF',
  },
  followingBtnText: {
    color: '#4B5563',
  },
  avatarWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  usernameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 10,
  },
  moreBtn: {
    padding: 6,
  },
  moreDots: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 1,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 8,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBtn: {
    padding: 2,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ratingPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingPillDefault: {
    backgroundColor: '#ECEAFE',
  },
  ratingPillRated: {
    backgroundColor: '#ECEAFE',
    borderWidth: 1,
    borderColor: '#7E47EB',
  },
  ratingPillText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ratingPillTextDefault: {
    color: '#7E47EB',
  },
  ratingPillTextRated: {
    color: '#7E47EB',
  },
  starScoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starIcon: {
    fontSize: 15,
    color: '#FBBF24',
  },
  starScoreNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  ratingsCountText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  captionText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#1F2937',
    marginBottom: 6,
  },
  captionUsername: {
    fontWeight: '700',
    color: '#111827',
  },
  captionBody: {
    color: '#1F2937',
  },
  viewCommentsBtn: {
    marginTop: 2,
    marginBottom: 6,
  },
  viewCommentsText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  commentSnippets: {
    marginBottom: 10,
    gap: 3,
  },
  snippetLine: {
    fontSize: 13,
    lineHeight: 18,
    color: '#1F2937',
  },
  snippetUsername: {
    fontWeight: '700',
    color: '#111827',
  },
  snippetBody: {
    color: '#1F2937',
  },
  inlineCommentBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  inlineUserAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    marginRight: 10,
  },
  inlineAvatarImg: {
    width: '100%',
    height: '100%',
  },
  inlineInputFake: {
    flex: 1,
    height: 36,
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  inlineInputPlaceholder: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  toastPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(17, 24, 39, 0.78)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

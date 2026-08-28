import React, { useState, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Share,
  StyleSheet,
} from 'react-native';
import { PostDto } from '@/types/post';
import { FotpuImage } from '../common/FotpuImage';
import { RatingSliderPopup } from '../rating/RatingSliderPopup';
import { useTranslation } from '@/store/languageStore';

interface OutfitCardProps {
  outfit: PostDto;
  onLikePress: (id: string) => void;
  onSavePress: (id: string) => void;
  onRateSubmit: (id: string, rating: number) => void;
  onCommentsPress: (id: string) => void;
  onUserPress?: (userId: string) => void;
}

export const OutfitCard = memo<OutfitCardProps>(({
  outfit,
  onLikePress,
  onSavePress,
  onRateSubmit,
  onCommentsPress,
  onUserPress,
}) => {
  const { t } = useTranslation();
  const [showRatingPopup, setShowRatingPopup] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${t('discover.shareMessage')} https://fotpu.app/outfit/${outfit.id}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* Header: User Info */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onUserPress?.(outfit.userId)}
          style={styles.userProfileBtn}
        >
          <FotpuImage
            uri={outfit.userAvatarUrl}
            style={styles.avatarImage}
          />
          <View style={styles.userInfoCol}>
            <Text style={styles.usernameText}>
              {outfit.username || 'Fotpu Stylist'}
            </Text>
            <Text style={styles.badgeText}>AI Look</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moreBtn}>
          <Text style={styles.moreDots}>•••</Text>
        </TouchableOpacity>
      </View>

      {/* Outfit Image (3:4 Ratio) */}
      <View style={styles.imageWrapper}>
        <FotpuImage
          uri={outfit.mediaUrl || outfit.thumbnailUrl}
          style={styles.outfitImage}
        />
      </View>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        {/* Left Actions: Like, Comment, Share, Save */}
        <View style={styles.leftActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onLikePress(outfit.id)}
            style={styles.actionBtn}
          >
            <Text style={styles.actionIcon}>{outfit.isLiked ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onCommentsPress(outfit.id)}
            style={styles.actionBtn}
          >
            <Text style={styles.actionIcon}>💬</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleShare}
            style={styles.actionBtn}
          >
            <Text style={styles.actionIcon}>🚀</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onSavePress(outfit.id)}
            style={styles.actionBtn}
          >
            <Text style={styles.actionIcon}>{outfit.isSaved ? '🔖' : '🏷️'}</Text>
          </TouchableOpacity>
        </View>

        {/* Right Actions: Rating Button + Score Badge */}
        <View style={styles.rightActions}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowRatingPopup(!showRatingPopup)}
            style={styles.rateBtn}
          >
            <Text style={styles.rateBtnText}>
              {outfit.userRating
                ? `${t('discover.yourRating')}: ${outfit.userRating}`
                : t('discover.rateButtonText')}
            </Text>
          </TouchableOpacity>

          <View style={styles.scoreBadge}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.scoreNumber}>
              {(outfit.averageRating || 8.5).toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Rating Slider Popup */}
        {showRatingPopup && (
          <RatingSliderPopup
            initialRating={outfit.userRating || 5}
            onRateSubmit={(rating) => onRateSubmit(outfit.id, rating)}
            onClose={() => setShowRatingPopup(false)}
          />
        )}
      </View>

      {/* Stats & Description */}
      <View style={styles.detailsContainer}>
        <Text style={styles.votesCount}>
          {outfit.totalVotes || 38} {t('discover.ratingsCount')}
        </Text>
        {outfit.description ? (
          <Text style={styles.descriptionText}>{outfit.description}</Text>
        ) : null}
      </View>

      {/* Comment Prompt */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onCommentsPress(outfit.id)}
        style={styles.commentPromptBtn}
      >
        <Text style={styles.commentPromptText}>
          {t('discover.firstCommentPrompt')}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAEAEA',
  },
  userInfoCol: {
    marginLeft: 10,
  },
  usernameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#181110',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7e47eb',
  },
  moreBtn: {
    padding: 4,
  },
  moreDots: {
    fontSize: 16,
    color: '#888888',
    fontWeight: 'bold',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  outfitImage: {
    width: '100%',
    height: '100%',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    position: 'relative',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionBtn: {
    padding: 4,
  },
  actionIcon: {
    fontSize: 22,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rateBtn: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: 'rgba(126, 71, 235, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7e47eb',
    textTransform: 'uppercase',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  starIcon: {
    fontSize: 12,
    marginRight: 2,
  },
  scoreNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  detailsContainer: {
    marginTop: 10,
  },
  votesCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
  },
  descriptionText: {
    fontSize: 14,
    color: '#444444',
    marginTop: 2,
    lineHeight: 20,
  },
  commentPromptBtn: {
    marginTop: 8,
  },
  commentPromptText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888888',
  },
});

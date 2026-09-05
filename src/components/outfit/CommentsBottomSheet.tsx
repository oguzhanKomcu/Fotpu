import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Pressable,
} from 'react-native';
import { ExtendedCommentDto, MOCK_CURRENT_USER } from '@/services/mock/testData';
import { FotpuImage } from '../common/FotpuImage';
import { useTranslation } from '@/store/languageStore';
import Svg, { Path } from 'react-native-svg';

interface CommentsBottomSheetProps {
  visible: boolean;
  comments: ExtendedCommentDto[];
  onClose: () => void;
  onAddComment: (text: string) => void;
  onToggleCommentLike?: (commentId: string) => void;
}

export const CommentsBottomSheet: React.FC<CommentsBottomSheetProps> = ({
  visible,
  comments,
  onClose,
  onAddComment,
  onToggleCommentLike,
}) => {
  const { t } = useTranslation();
  const [commentText, setCommentText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handlePost = () => {
    if (!commentText.trim()) return;
    onAddComment(commentText.trim());
    setCommentText('');
  };

  const handleReplyPress = (username?: string) => {
    if (username) {
      setCommentText(`@${username} `);
      inputRef.current?.focus();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.placeholder} />
            <Text style={styles.headerTitle}>{t('common.comments')}</Text>
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

          {/* Comments List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {comments.map((comment) => (
              <View key={comment.commentId} style={styles.commentRow}>
                {/* Avatar */}
                <View style={styles.avatarWrapper}>
                  <FotpuImage
                    uri={comment.userAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                    style={styles.avatarImage}
                  />
                </View>

                {/* Comment Content */}
                <View style={styles.contentCol}>
                  <Text style={styles.commentText}>
                    <Text style={styles.usernameText}>
                      {comment.username || 'User'}{' '}
                    </Text>
                    {comment.replyToUsername ? (
                      <Text style={styles.mentionText}>
                        @{comment.replyToUsername}{' '}
                      </Text>
                    ) : null}
                    <Text style={styles.bodyText}>{comment.content}</Text>
                  </Text>

                  {/* Meta: Timestamp & Reply */}
                  <View style={styles.metaRow}>
                    <Text style={styles.timeText}>{comment.timeAgo || 'just now'}</Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleReplyPress(comment.username)}
                      style={styles.replyBtn}
                    >
                      <Text style={styles.replyText}>{t('common.reply')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Like Button */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => onToggleCommentLike?.(comment.commentId)}
                  style={styles.likeBtn}
                >
                  <Svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={comment.isLiked ? '#EF4444' : 'none'}
                  >
                    <Path
                      d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                      stroke={comment.isLiked ? '#EF4444' : '#8E8E93'}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Sticky Bottom Add Comment Input */}
          <View style={styles.inputBar}>
            <View style={styles.userAvatarWrapper}>
              <FotpuImage
                uri={MOCK_CURRENT_USER.avatarUrl}
                style={styles.userAvatarImage}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                value={commentText}
                onChangeText={setCommentText}
                placeholder={t('discover.addCommentPlaceholder')}
                placeholderTextColor="#9CA3AF"
                style={styles.textInput}
                onSubmitEditing={handlePost}
                returnKeyType="send"
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePost}
              disabled={!commentText.trim()}
              style={styles.postBtn}
            >
              <Text
                style={[
                  styles.postBtnText,
                  !commentText.trim() && styles.postBtnDisabled,
                ]}
              >
                {t('discover.postButton')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    minHeight: 450,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  placeholder: {
    width: 32,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
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
  contentCol: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  commentText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#1F2937',
  },
  usernameText: {
    fontWeight: '700',
    color: '#111827',
  },
  mentionText: {
    fontWeight: '600',
    color: '#7E47EB',
  },
  bodyText: {
    color: '#1F2937',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  timeText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  replyBtn: {
    marginLeft: 16,
  },
  replyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  likeBtn: {
    padding: 6,
    marginTop: 2,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  userAvatarWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  userAvatarImage: {
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 40,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 14,
    color: '#111827',
    paddingVertical: 0,
  },
  postBtn: {
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  postBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7E47EB',
  },
  postBtnDisabled: {
    color: '#C4B5FD',
  },
});

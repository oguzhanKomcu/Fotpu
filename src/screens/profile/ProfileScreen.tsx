import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/store/languageStore';
import { FotpuImage } from '@/components/common/FotpuImage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@/types/navigation';
import Svg, { Path } from 'react-native-svg';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const currentUser = useAuthStore((state) => state.user);
  const { t } = useTranslation();
  const {
    profile,
    userPosts,
    activeTab,
    fetchProfile,
    fetchUserPosts,
    setActiveTab,
  } = useUserStore();

  useEffect(() => {
    fetchProfile(currentUser?.id);
    fetchUserPosts(currentUser?.id);
  }, [currentUser?.id]);

  const activeUser = profile || currentUser;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.placeholderBox} />
        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
        {/* Settings Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Settings')}
          style={styles.settingsBtn}
        >
          <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 15a3 3 0 100-6 3 3 0 000 6z"
              stroke="#333333"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
              stroke="#333333"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        {/* Profile Card Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <FotpuImage
              uri={activeUser?.profilePictureUrl}
              style={styles.avatarImage}
            />
          </View>

          <Text style={styles.usernameText}>
            @{activeUser?.username || 'stylemaven'}
          </Text>

          {activeUser?.fullName ? (
            <Text style={styles.fullNameText}>{activeUser.fullName}</Text>
          ) : null}

          {/* Followers / Following */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {activeUser?.followersCount || 0}
              </Text>
              <Text style={styles.statLabel}>{t('profile.followers')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {activeUser?.followingCount || 0}
              </Text>
              <Text style={styles.statLabel}>{t('profile.following')}</Text>
            </View>
          </View>

          {/* Style Score Badge */}
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreStar}>⭐</Text>
            <Text style={styles.scoreText}>
              {t('profile.totalStyleScore')}: {(activeUser?.userScore || 8450).toLocaleString()}
            </Text>
          </View>

          {/* Edit Profile / Settings Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Settings')}
            style={styles.editProfileBtn}
          >
            <Text style={styles.editProfileBtnText}>
              {t('profile.editProfile')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('combos')}
            style={[
              styles.tabBtn,
              activeTab === 'combos' && styles.tabBtnActive,
            ]}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'combos' && styles.tabBtnTextActive,
              ]}
            >
              {t('profile.aiCombos')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('outfits')}
            style={[
              styles.tabBtn,
              activeTab === 'outfits' && styles.tabBtnActive,
            ]}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'outfits' && styles.tabBtnTextActive,
              ]}
            >
              {t('profile.myOutfits')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 2-Column Outfit Grid */}
        <View style={styles.gridContainer}>
          {userPosts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>👗</Text>
              <Text style={styles.emptyText}>{t('profile.noOutfitsYet')}</Text>
            </View>
          ) : (
            userPosts.map((item) => (
              <View key={item.id} style={styles.gridItem}>
                <View style={styles.gridImageWrapper}>
                  <FotpuImage
                    uri={item.mediaUrl || item.thumbnailUrl}
                    style={styles.gridImage}
                  />
                </View>
                <View style={styles.gridMeta}>
                  <Text numberOfLines={1} style={styles.gridItemTitle}>
                    {item.description || 'Kombin'}
                  </Text>
                  <View style={styles.gridRatingRow}>
                    <Text style={styles.gridRatingStar}>⭐</Text>
                    <Text style={styles.gridRatingText}>
                      {(item.averageRating || 8.5).toFixed(1)} / 5 ({item.totalVotes || 12})
                    </Text>
                  </View>
                </View>
              </View>
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
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  placeholderBox: {
    width: 38,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#181110',
  },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FAF9F8',
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    borderWidth: 3,
    borderColor: '#7e47eb',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  usernameText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#181110',
    marginTop: 10,
  },
  fullNameText: {
    fontSize: 14,
    color: '#777777',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginTop: 14,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#181110',
  },
  statLabel: {
    fontSize: 12,
    color: '#888888',
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 14,
  },
  scoreStar: {
    fontSize: 14,
    marginRight: 4,
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  editProfileBtn: {
    width: '100%',
    maxWidth: 280,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  editProfileBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: '#7e47eb',
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888888',
  },
  tabBtnTextActive: {
    color: '#7e47eb',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  emptyContainer: {
    width: '100%',
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '600',
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  gridImageWrapper: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#F3F4F6',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridMeta: {
    padding: 8,
  },
  gridItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#181110',
  },
  gridRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  gridRatingStar: {
    fontSize: 11,
    marginRight: 2,
  },
  gridRatingText: {
    fontSize: 11,
    color: '#666666',
    fontWeight: '600',
  },
});

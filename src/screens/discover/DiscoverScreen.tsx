import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useOutfitStore } from '@/store/outfitStore';
import { useTranslation } from '@/store/languageStore';
import { OutfitCard } from '@/components/outfit/OutfitCard';
import { PostDto } from '@/types/post';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';

export const DiscoverScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const {
    feedItems,
    fetchFeed,
    refreshFeed,
    isRefreshing,
    isLoading,
    hasNextPage,
    toggleLike,
    toggleSave,
    submitRating,
  } = useOutfitStore();

  useEffect(() => {
    fetchFeed(true);
  }, []);

  const renderItem = ({ item }: { item: PostDto }) => (
    <OutfitCard
      outfit={item}
      onLikePress={toggleLike}
      onSavePress={toggleSave}
      onRateSubmit={submitRating}
      onCommentsPress={(outfitId) => navigation.navigate('CommentsModal', { outfitId })}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('discover.title')}</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Feed List */}
      <View style={styles.listContainer}>
        <FlashList
          data={feedItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          estimatedItemSize={480}
          onRefresh={refreshFeed}
          refreshing={isRefreshing}
          contentContainerStyle={styles.listContent}
          onEndReached={() => {
            if (hasNextPage && !isLoading) {
              fetchFeed();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading ? (
              <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color="#7E47EB" />
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
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
    fontSize: 24,
    fontWeight: '900',
    color: '#181110',
    letterSpacing: -0.5,
  },
  searchBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#FAF9F8',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

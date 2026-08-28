import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { PermissionService } from '@/services/permissions/permissionService';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { postService } from '@/services/api/postService';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/store/languageStore';
import { useNavigation } from '@react-navigation/native';

export const UploadOutfitScreen: React.FC = () => {
  const navigation = useNavigation();
  const currentUser = useAuthStore((state) => state.user);
  const { t } = useTranslation();

  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleCameraPress = async () => {
    const granted = await PermissionService.requestCameraPermission();
    if (!granted) {
      Alert.alert(t('upload.permissionNeeded'), t('upload.cameraPermissionDesc'));
      return;
    }
    setImageUri('https://cdn.fotpu.app/samples/captured_outfit.jpg');
    Alert.alert(t('upload.camera'), t('upload.photoReady'));
  };

  const handleGalleryPress = async () => {
    const granted = await PermissionService.requestGalleryPermission();
    if (!granted) {
      Alert.alert(t('upload.permissionNeeded'), t('upload.galleryPermissionDesc'));
      return;
    }
    setImageUri('https://cdn.fotpu.app/samples/gallery_outfit.jpg');
    Alert.alert(t('upload.gallery'), t('upload.photoReady'));
  };

  const handleUpload = async () => {
    if (!description.trim()) {
      Alert.alert(t('common.error'), t('upload.missingInfo'));
      return;
    }

    if (!currentUser?.id) {
      Alert.alert(t('common.error'), 'Lütfen önce giriş yapınız.');
      return;
    }

    setIsUploading(true);
    try {
      const tags = tagInput
        .split(/[\s,#]+/)
        .filter((tag) => tag.trim().length > 0);

      await postService.createPost({
        userId: currentUser.id,
        description: description.trim(),
        fileUri: imageUri || 'https://cdn.fotpu.app/samples/outfit_default.jpg',
        fileType: 'image/jpeg',
        fileName: 'outfit.jpg',
        tags,
      });

      Alert.alert(t('common.success'), t('upload.successMessage'), [
        { text: t('common.ok'), onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message || t('upload.errorMessage'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.cancelBtn}
        >
          <Text style={styles.cancelText}>{t('upload.cancel')}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('upload.title')}</Text>
        <View style={styles.placeholderBox} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Photo Selection Box */}
        <View style={styles.photoBox}>
          {imageUri ? (
            <View style={styles.photoReadyBox}>
              <Text style={styles.photoReadyEmoji}>✨</Text>
              <Text style={styles.photoReadyTitle}>{t('upload.photoReady')}</Text>
              <TouchableOpacity onPress={() => setImageUri(null)} style={styles.changePhotoBtn}>
                <Text style={styles.changePhotoText}>{t('upload.changePhoto')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.pickRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCameraPress}
                style={styles.pickOption}
              >
                <Text style={styles.pickIcon}>📷</Text>
                <Text style={styles.pickLabel}>{t('upload.camera')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleGalleryPress}
                style={styles.pickOption}
              >
                <Text style={styles.pickIcon}>🖼️</Text>
                <Text style={styles.pickLabel}>{t('upload.gallery')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Inputs */}
        <View style={styles.formContainer}>
          <Input
            label={t('upload.description')}
            placeholder={t('upload.descriptionPlaceholder')}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />

          <Input
            label="Tags"
            placeholder="#OOTD, #Summer, #StreetWear"
            value={tagInput}
            onChangeText={setTagInput}
          />

          <Button
            title={t('upload.publish')}
            variant="primary"
            size="lg"
            isLoading={isUploading}
            onPress={handleUpload}
            style={styles.publishBtn}
          />
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
  cancelBtn: {
    paddingVertical: 6,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7e47eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#181110',
  },
  placeholderBox: {
    width: 48,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FAF9F8',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  photoBox: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 20,
  },
  photoReadyBox: {
    alignItems: 'center',
  },
  photoReadyEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  photoReadyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#7e47eb',
  },
  changePhotoBtn: {
    marginTop: 8,
    padding: 4,
  },
  changePhotoText: {
    fontSize: 13,
    color: '#EF4444',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  pickRow: {
    flexDirection: 'row',
    gap: 16,
  },
  pickOption: {
    width: 110,
    height: 100,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  pickLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
  },
  formContainer: {
    width: '100%',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  publishBtn: {
    marginTop: 16,
    marginBottom: 32,
  },
});

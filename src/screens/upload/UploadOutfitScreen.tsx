import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
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
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-3 border-b border-gray-100 dark:border-zinc-800">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-base text-primary font-bold">{t('upload.cancel')}</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#181110] dark:text-white">
          {t('upload.title')}
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        {/* Photo Selection Box */}
        <View className="w-full aspect-[4/3] rounded-2xl bg-gray-100 dark:bg-zinc-800 border-2 border-dashed border-gray-300 dark:border-zinc-700 items-center justify-center p-4 mb-6">
          {imageUri ? (
            <View className="items-center">
              <Text className="text-3xl mb-2">✨</Text>
              <Text className="text-sm font-bold text-primary">{t('upload.photoReady')}</Text>
              <TouchableOpacity onPress={() => setImageUri(null)} className="mt-2">
                <Text className="text-xs text-red-500 underline">{t('upload.changePhoto')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row gap-4">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCameraPress}
                className="items-center justify-center p-4 bg-white dark:bg-zinc-700 rounded-xl shadow-sm"
              >
                <Text className="text-3xl mb-1">📷</Text>
                <Text className="text-xs font-bold text-gray-700 dark:text-gray-200">
                  {t('upload.camera')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleGalleryPress}
                className="items-center justify-center p-4 bg-white dark:bg-zinc-700 rounded-xl shadow-sm"
              >
                <Text className="text-3xl mb-1">🖼️</Text>
                <Text className="text-xs font-bold text-gray-700 dark:text-gray-200">
                  {t('upload.gallery')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Inputs */}
        <View className="space-y-4">
          <Input
            label={t('upload.description')}
            placeholder={t('upload.descriptionPlaceholder')}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            className="h-20"
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
            className="mt-6 mb-12"
            isLoading={isUploading}
            onPress={handleUpload}
          />
        </View>
      </ScrollView>
    </View>
  );
};

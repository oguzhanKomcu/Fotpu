import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOutfitStore } from '@/store/outfitStore';
import { useTranslation } from '@/store/languageStore';
import { useNavigation } from '@react-navigation/native';
import { FotpuImage } from '@/components/common/FotpuImage';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Svg, { Path } from 'react-native-svg';

import { PermissionService } from '@/services/permissions/permissionService';

const SAMPLE_OUTFIT_PRESETS = [
  {
    id: 'preset_1',
    label: 'Yazlık Sarı Takım',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
    category: 'female',
    season: 'summer',
    defaultTitle: 'Sarı Takım & Enerji',
    defaultDesc: 'Canlı sarı eşofman takımı ve beyaz botlar #StreetWear #Casual #Vibrant',
  },
  {
    id: 'preset_2',
    label: 'Modern Sonbahar',
    url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800',
    category: 'female',
    season: 'autumn',
    defaultTitle: 'Sonbahar Sokak Modası',
    defaultDesc: 'Bordo kaban ve rahat kazak uyumu. Günlük şehir gezintileri için ideal #StreetFashion #AutumnLook',
  },
  {
    id: 'preset_3',
    label: 'Şık Topuklu & Çanta',
    url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800',
    category: 'female',
    season: 'spring',
    defaultTitle: 'Gece Daveti Parıltısı',
    defaultDesc: 'Özel geceler için renkli ve iddialı kombin #Glamour #Chic',
  },
  {
    id: 'preset_4',
    label: 'Erkek Klasik Takım',
    url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800',
    category: 'male',
    season: 'autumn',
    defaultTitle: 'Şehirli Erkek Şıklığı',
    defaultDesc: 'Minimalist ceket ve pantolon uyumu #Menswear #UrbanStyle',
  },
];

export const UploadOutfitScreen: React.FC = () => {
  const navigation = useNavigation();
  const { createOutfitPost } = useOutfitStore();
  const { t } = useTranslation();

  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(SAMPLE_OUTFIT_PRESETS[0].id);
  const [imageUri, setImageUri] = useState<string>(SAMPLE_OUTFIT_PRESETS[0].url);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('female');
  const [selectedSeason, setSelectedSeason] = useState<string>('summer');
  const [isUploading, setIsUploading] = useState(false);

  const categoryTabs = [
    { key: 'female', label: t('home.womenswear') },
    { key: 'male', label: t('home.menswear') },
    { key: 'all', label: t('home.all') },
  ];

  const seasonTabs = [
    { key: 'summer', label: t('home.summer') },
    { key: 'spring', label: t('home.spring') },
    { key: 'autumn', label: t('home.autumn') },
    { key: 'winter', label: t('home.winter') },
  ];

  const handlePickFromGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        console.warn('Gallery pick errorCode:', result.errorCode, result.errorMessage);
        Alert.alert(t('common.error'), result.errorMessage || 'Galeriden fotoğraf seçilemedi.');
        return;
      }

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setImageUri(result.assets[0].uri);
        setSelectedPresetId(null);
      }
    } catch (error: any) {
      console.warn('Gallery pick error:', error);
      Alert.alert(t('common.error'), 'Galeriden fotoğraf seçilemedi.');
    }
  };

  const handlePickFromCamera = async () => {
    try {
      const granted = await PermissionService.requestCameraPermission();
      if (!granted) {
        Alert.alert(t('upload.permissionNeeded'), t('upload.cameraPermissionDesc'));
        return;
      }

      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setImageUri(result.assets[0].uri);
        setSelectedPresetId(null);
      }
    } catch (error: any) {
      console.warn('Camera capture error:', error);
      Alert.alert(t('common.error'), 'Kamera açılamadı.');
    }
  };

  const handleSelectPreset = (preset: typeof SAMPLE_OUTFIT_PRESETS[0]) => {
    setSelectedPresetId(preset.id);
    setImageUri(preset.url);
    setTitle(preset.defaultTitle);
    setDescription(preset.defaultDesc);
    setSelectedCategory(preset.category);
    setSelectedSeason(preset.season);
  };

  const handlePublish = async () => {
    if (!description.trim()) {
      Alert.alert(t('common.error'), t('upload.missingInfo'));
      return;
    }

    setIsUploading(true);
    try {
      const tags = tagInput
        .split(/[\s,#]+/)
        .filter((tag) => tag.trim().length > 0)
        .map((t) => (t.startsWith('#') ? t : `#${t}`));

      await createOutfitPost({
        title: title.trim(),
        description: description.trim(),
        fileUri: imageUri,
        category: selectedCategory,
        season: selectedSeason,
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
        {/* Gallery & Camera Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePickFromGallery}
            style={styles.actionBtnPrimary}
          >
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <Path
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.actionBtnPrimaryText}>{t('upload.pickFromGallery')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePickFromCamera}
            style={styles.actionBtnSecondary}
          >
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <Path
                d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
                stroke="#7E47EB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M12 17a4 4 0 100-8 4 4 0 000 8z"
                stroke="#7E47EB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.actionBtnSecondaryText}>{t('upload.camera')}</Text>
          </TouchableOpacity>
        </View>

        {/* Big Live Photo Preview */}
        <View style={styles.photoPreviewCard}>
          <FotpuImage uri={imageUri} style={styles.mainPreviewImage} />
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handlePickFromGallery}
            style={styles.previewTagOverlay}
          >
            <Text style={styles.previewTagText}>{t('upload.changePhoto')}</Text>
          </TouchableOpacity>
        </View>



        {/* Inputs */}
        <View style={styles.formContainer}>
          <Input
            label={t('upload.postTitle')}
            placeholder={t('upload.postTitlePlaceholder')}
            value={title}
            onChangeText={setTitle}
          />

          <Input
            label={t('upload.description')}
            placeholder={t('upload.descriptionPlaceholder')}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />

          {/* Category Selector */}
          <Text style={styles.inputLabel}>{t('upload.category')}</Text>
          <View style={styles.pillsRow}>
            {categoryTabs.map((tab) => {
              const isSelected = selectedCategory === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  activeOpacity={0.8}
                  onPress={() => setSelectedCategory(tab.key)}
                  style={[
                    styles.pillBtn,
                    isSelected ? styles.pillBtnActive : styles.pillBtnInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.pillBtnText,
                      isSelected ? styles.pillBtnTextActive : styles.pillBtnTextInactive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Season Selector */}
          <Text style={styles.inputLabel}>{t('upload.season')}</Text>
          <View style={styles.pillsRow}>
            {seasonTabs.map((tab) => {
              const isSelected = selectedSeason === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  activeOpacity={0.8}
                  onPress={() => setSelectedSeason(tab.key)}
                  style={[
                    styles.pillBtn,
                    isSelected ? styles.pillBtnActive : styles.pillBtnInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.pillBtnText,
                      isSelected ? styles.pillBtnTextActive : styles.pillBtnTextInactive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Input
            label={t('upload.tags')}
            placeholder={t('upload.tagsPlaceholder')}
            value={tagInput}
            onChangeText={setTagInput}
          />

          <Button
            title={t('upload.publish')}
            variant="primary"
            size="lg"
            isLoading={isUploading}
            onPress={handlePublish}
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
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  cancelBtn: {
    paddingVertical: 6,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7E47EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  placeholderBox: {
    width: 48,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FAF9F8',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingBottom: 40,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionBtnPrimary: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#7E47EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#7E47EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  actionBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  actionBtnSecondary: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#ECEAFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnSecondaryText: {
    color: '#7E47EB',
    fontSize: 14,
    fontWeight: '700',
  },
  photoPreviewCard: {
    width: '100%',
    aspectRatio: 4 / 4.5,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 18,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  mainPreviewImage: {
    width: '100%',
    height: '100%',
  },
  previewTagOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(17, 24, 39, 0.82)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  previewTagText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 10,
    marginLeft: 4,
  },
  presetScroll: {
    gap: 12,
    paddingBottom: 16,
  },
  presetCard: {
    width: 72,
    height: 92,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  presetCardActive: {
    borderColor: '#7E47EB',
    borderWidth: 3,
  },
  presetThumb: {
    width: '100%',
    height: '100%',
  },
  presetCheckBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#7E47EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    marginTop: 6,
    marginLeft: 4,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  pillBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pillBtnActive: {
    backgroundColor: '#ECEAFE',
  },
  pillBtnInactive: {
    backgroundColor: '#F3F4F6',
  },
  pillBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  pillBtnTextActive: {
    color: '#7E47EB',
  },
  pillBtnTextInactive: {
    color: '#4B5563',
  },
  publishBtn: {
    marginTop: 12,
    marginBottom: 20,
  },
});

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, Modal } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/store/languageStore';
import { useNavigation } from '@react-navigation/native';
import { SupportedLanguage } from '@/localization/types';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const logout = useAuthStore((state) => state.logout);
  const { t, currentLanguage, setLanguage, supportedLanguages } = useTranslation();

  const [isPushEnabled, setIsPushEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert(t('settings.logoutConfirmTitle'), t('settings.logoutConfirmMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('settings.logout'), style: 'destructive', onPress: () => logout() },
    ]);
  };

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsLanguageModalVisible(false);
  };

  const activeLangInfo = supportedLanguages.find((l) => l.code === currentLanguage);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-3 border-b border-gray-100 dark:border-zinc-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10">
          <Text className="text-xl text-gray-800 dark:text-white">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#181110] dark:text-white">
          {t('settings.title')}
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        {/* Section: Preferences */}
        <Text className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
          {t('settings.preferences')}
        </Text>
        <View className="bg-white dark:bg-zinc-800 rounded-2xl p-4 mb-6 shadow-sm border border-gray-100 dark:border-zinc-700/50 space-y-4">
          {/* Language Selector */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsLanguageModalVisible(true)}
            className="flex-row items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-700"
          >
            <View>
              <Text className="text-base font-semibold text-gray-900 dark:text-white">
                {t('settings.language')}
              </Text>
              <Text className="text-xs text-gray-400">{t('settings.languageDesc')}</Text>
            </View>
            <View className="flex-row items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
              <Text className="text-sm">{activeLangInfo?.flag}</Text>
              <Text className="text-xs font-bold text-primary">
                {activeLangInfo?.nativeName}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Push Notifications */}
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-base font-semibold text-gray-900 dark:text-white">
                {t('settings.notifications')}
              </Text>
              <Text className="text-xs text-gray-400">{t('settings.notificationsDesc')}</Text>
            </View>
            <Switch
              value={isPushEnabled}
              onValueChange={setIsPushEnabled}
              trackColor={{ false: '#767577', true: '#7E47EB' }}
            />
          </View>

          {/* Dark Mode */}
          <View className="flex-row items-center justify-between pt-2 border-t border-gray-100 dark:border-zinc-700">
            <View>
              <Text className="text-base font-semibold text-gray-900 dark:text-white">
                {t('settings.darkMode')}
              </Text>
              <Text className="text-xs text-gray-400">{t('settings.darkModeDesc')}</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#767577', true: '#7E47EB' }}
            />
          </View>
        </View>

        {/* Section: Account & Security */}
        <Text className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
          {t('settings.accountSecurity')}
        </Text>
        <View className="bg-white dark:bg-zinc-800 rounded-2xl p-4 mb-6 shadow-sm border border-gray-100 dark:border-zinc-700/50 space-y-3">
          <TouchableOpacity className="py-2">
            <Text className="text-base font-semibold text-gray-900 dark:text-white">
              {t('settings.changePassword')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2 border-t border-gray-100 dark:border-zinc-700">
            <Text className="text-base font-semibold text-gray-900 dark:text-white">
              {t('settings.privacyPolicy')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2 border-t border-gray-100 dark:border-zinc-700">
            <Text className="text-base font-semibold text-gray-900 dark:text-white">
              {t('settings.termsOfService')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="h-14 rounded-2xl bg-red-50 dark:bg-red-950/30 items-center justify-center border border-red-200 dark:border-red-800/50 mt-4 mb-10"
        >
          <Text className="text-base font-bold text-red-600 dark:text-red-400">
            {t('settings.logout')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={isLanguageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLanguageModalVisible(false)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center p-6">
          <View className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl">
            <Text className="text-xl font-extrabold text-gray-900 dark:text-white pb-4 text-center">
              {t('settings.selectLanguage')}
            </Text>

            <View className="space-y-2 mb-4">
              {supportedLanguages.map((lang) => {
                const isSelected = currentLanguage === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    onPress={() => handleSelectLanguage(lang.code)}
                    className={`flex-row items-center justify-between p-4 rounded-2xl border ${
                      isSelected
                        ? 'bg-primary/10 border-primary'
                        : 'bg-gray-50 dark:bg-zinc-800 border-gray-100 dark:border-zinc-700'
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <Text className="text-2xl">{lang.flag}</Text>
                      <View>
                        <Text className="text-base font-bold text-gray-900 dark:text-white">
                          {lang.nativeName}
                        </Text>
                        <Text className="text-xs text-gray-400">{lang.name}</Text>
                      </View>
                    </View>
                    {isSelected && <Text className="text-primary font-bold">✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              onPress={() => setIsLanguageModalVisible(false)}
              className="py-3 rounded-xl bg-gray-100 dark:bg-zinc-800 items-center"
            >
              <Text className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

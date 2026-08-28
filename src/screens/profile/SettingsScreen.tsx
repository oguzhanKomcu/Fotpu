import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Modal,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <View style={styles.placeholderBox} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section: Preferences */}
        <Text style={styles.sectionHeader}>{t('settings.preferences')}</Text>
        <View style={styles.cardBox}>
          {/* Language Selector */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsLanguageModalVisible(true)}
            style={styles.settingRow}
          >
            <View>
              <Text style={styles.settingLabel}>{t('settings.language')}</Text>
              <Text style={styles.settingSubLabel}>{t('settings.languageDesc')}</Text>
            </View>
            <View style={styles.langBadge}>
              <Text style={styles.flagText}>{activeLangInfo?.flag}</Text>
              <Text style={styles.langText}>{activeLangInfo?.nativeName}</Text>
            </View>
          </TouchableOpacity>

          {/* Push Notifications */}
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>{t('settings.notifications')}</Text>
              <Text style={styles.settingSubLabel}>{t('settings.notificationsDesc')}</Text>
            </View>
            <Switch
              value={isPushEnabled}
              onValueChange={setIsPushEnabled}
              trackColor={{ false: '#D1D5DB', true: '#7e47eb' }}
            />
          </View>

          {/* Dark Mode */}
          <View style={[styles.settingRow, styles.lastRow]}>
            <View>
              <Text style={styles.settingLabel}>{t('settings.darkMode')}</Text>
              <Text style={styles.settingSubLabel}>{t('settings.darkModeDesc')}</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#D1D5DB', true: '#7e47eb' }}
            />
          </View>
        </View>

        {/* Section: Account & Security */}
        <Text style={styles.sectionHeader}>{t('settings.accountSecurity')}</Text>
        <View style={styles.cardBox}>
          <TouchableOpacity style={styles.menuRow}>
            <Text style={styles.menuText}>{t('settings.changePassword')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuRow}>
            <Text style={styles.menuText}>{t('settings.privacyPolicy')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuRow, styles.lastRow]}>
            <Text style={styles.menuText}>{t('settings.termsOfService')}</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          style={styles.logoutBtn}
        >
          <Text style={styles.logoutBtnText}>{t('settings.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={isLanguageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('settings.selectLanguage')}</Text>

            <View style={styles.langList}>
              {supportedLanguages.map((lang) => {
                const isSelected = currentLanguage === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    activeOpacity={0.7}
                    onPress={() => handleSelectLanguage(lang.code)}
                    style={[
                      styles.langOption,
                      isSelected && styles.langOptionSelected,
                    ]}
                  >
                    <View style={styles.langLeft}>
                      <Text style={styles.modalFlag}>{lang.flag}</Text>
                      <View>
                        <Text style={styles.modalLangName}>{lang.nativeName}</Text>
                        <Text style={styles.modalLangSub}>{lang.name}</Text>
                      </View>
                    </View>
                    {isSelected && <Text style={styles.checkIcon}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsLanguageModalVisible(false)}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  backBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: '#181110',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#181110',
  },
  placeholderBox: {
    width: 38,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FAF9F8',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
    marginLeft: 4,
  },
  cardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#181110',
  },
  settingSubLabel: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  langBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  flagText: {
    fontSize: 14,
  },
  langText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7e47eb',
  },
  menuRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#181110',
  },
  logoutBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#DC2626',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#181110',
    textAlign: 'center',
    marginBottom: 16,
  },
  langList: {
    gap: 10,
    marginBottom: 16,
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  langOptionSelected: {
    borderColor: '#7e47eb',
    backgroundColor: '#F5F3FF',
  },
  langLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalFlag: {
    fontSize: 24,
  },
  modalLangName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#181110',
  },
  modalLangSub: {
    fontSize: 12,
    color: '#888888',
  },
  checkIcon: {
    fontSize: 16,
    fontWeight: '900',
    color: '#7e47eb',
  },
  cancelBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555555',
  },
});

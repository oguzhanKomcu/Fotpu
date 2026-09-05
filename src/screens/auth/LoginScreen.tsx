import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/store/languageStore';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { getLocalizedAuthError } from '@/utils/authErrorHelper';
import Svg, { Path } from 'react-native-svg';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login, isLoading } = useAuthStore();
  const { t } = useTranslation();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Field validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  const validate = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setServerError('');

    if (!emailOrUsername.trim()) {
      setEmailError(t('auth.errors.usernameRequired'));
      isValid = false;
    }

    if (!password) {
      setPasswordError(t('auth.errors.passwordRequired'));
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(t('auth.errors.passwordTooShort'));
      isValid = false;
    }

    return isValid;
  };

  const handleEmailLogin = async () => {
    if (!validate()) return;

    try {
      await login({
        emailOrUsername: emailOrUsername.trim(),
        password,
      });
    } catch (err: any) {
      console.log('[Login Error Debug]:', err?.message, err?.response?.status, JSON.stringify(err?.response?.data));
      const localizedError = getLocalizedAuthError(err);
      setServerError(localizedError);
      Alert.alert(t('common.error'), localizedError);
    }
  };

  return (
    <LinearGradient
      colors={['#FFDAB9', '#E6E6FA']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradientContainer}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.cardContainer}>
            {/* Logo */}
            <View style={styles.logoRow}>
              <Svg width="42" height="42" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="#333333"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M2 17L12 22L22 17"
                  stroke="#333333"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M2 12L12 17L22 12"
                  stroke="#333333"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.appTitle}>{t('auth.appTitle')}</Text>
            </View>

            {/* Tagline */}
            <Text style={styles.tagline}>{t('auth.appTagline')}</Text>

            {/* Social Logins */}
            <View style={styles.buttonGroup}>
              <Button
                title={t('auth.continueWithGoogle')}
                variant="secondary"
                size="lg"
                onPress={() => setShowEmailForm(true)}
              />

              <Button
                title={t('auth.continueWithApple')}
                variant="secondary"
                size="lg"
                onPress={() => setShowEmailForm(true)}
              />
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t('common.or')}</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Email Login Form */}
            {!showEmailForm ? (
              <Button
                title={t('auth.signInWithEmail')}
                variant="dark"
                size="lg"
                onPress={() => setShowEmailForm(true)}
              />
            ) : (
              <View style={styles.formContainer}>
                {serverError ? (
                  <View style={styles.serverErrorBox}>
                    <Text style={styles.serverErrorText}>{serverError}</Text>
                  </View>
                ) : null}

                <Input
                  label={t('auth.username')}
                  placeholder={t('auth.emailPlaceholder')}
                  value={emailOrUsername}
                  onChangeText={(text) => {
                    setEmailOrUsername(text);
                    if (emailError) setEmailError('');
                  }}
                  error={emailError}
                  autoCapitalize="none"
                />

                <Input
                  label={t('auth.password')}
                  placeholder={t('auth.passwordPlaceholder')}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError('');
                  }}
                  error={passwordError}
                  secureTextEntry
                />

                <Button
                  title={t('auth.login')}
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  onPress={handleEmailLogin}
                  style={styles.submitBtn}
                />
              </View>
            )}

            {/* Register Link */}
            <View style={styles.registerRow}>
              <Text style={styles.registerPrompt}>{t('auth.dontHaveAccount')} </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.registerLink}>{t('auth.register')}</Text>
              </TouchableOpacity>
            </View>

            {/* Legal Notice */}
            <Text style={styles.legalNotice}>{t('auth.termsNotice')}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#181110',
    marginLeft: 10,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2A2220',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 28,
    paddingHorizontal: 12,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#888888',
    fontWeight: '500',
  },
  formContainer: {
    width: '100%',
  },
  submitBtn: {
    marginTop: 8,
  },
  serverErrorBox: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  serverErrorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerPrompt: {
    fontSize: 14,
    color: '#666666',
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ff6e61',
    textDecorationLine: 'underline',
  },
  legalNotice: {
    fontSize: 11,
    color: '#888888',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 16,
    paddingHorizontal: 16,
  },
});

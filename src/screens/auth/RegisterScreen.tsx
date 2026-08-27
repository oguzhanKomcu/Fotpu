import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/store/languageStore';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { getLocalizedAuthError } from '@/utils/authErrorHelper';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register, isLoading } = useAuthStore();
  const { t } = useTranslation();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Field validation errors
  const [fullNameError, setFullNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  const validate = (): boolean => {
    let isValid = true;
    setFullNameError('');
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setServerError('');

    if (!fullName.trim()) {
      setFullNameError(t('auth.errors.fullNameRequired'));
      isValid = false;
    }

    if (!username.trim()) {
      setUsernameError(t('auth.errors.usernameRequired'));
      isValid = false;
    } else if (username.trim().length < 3) {
      setUsernameError('Kullanıcı adı en az 3 karakter olmalıdır.');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError(t('auth.errors.emailRequired'));
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError(t('auth.errors.invalidEmail'));
      isValid = false;
    }

    if (!password) {
      setPasswordError(t('auth.errors.passwordRequired'));
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(t('auth.errors.passwordTooShort'));
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError(t('auth.errors.confirmPasswordRequired'));
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(t('auth.errors.passwordsDoNotMatch'));
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      await register({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      });
      Alert.alert(t('common.success'), t('auth.registerSuccess'));
    } catch (err: any) {
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
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.cardContainer}>
            <Text style={styles.headerTitle}>{t('auth.signUpWithEmail')}</Text>

            {serverError ? (
              <View style={styles.serverErrorBox}>
                <Text style={styles.serverErrorText}>{serverError}</Text>
              </View>
            ) : null}

            <View style={styles.formContainer}>
              <Input
                label={t('auth.fullName')}
                placeholder={t('auth.fullNamePlaceholder')}
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (fullNameError) setFullNameError('');
                }}
                error={fullNameError}
              />

              <Input
                label={t('auth.username')}
                placeholder={t('auth.usernamePlaceholder')}
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (usernameError) setUsernameError('');
                }}
                error={usernameError}
                autoCapitalize="none"
              />

              <Input
                label={t('auth.email')}
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError('');
                }}
                error={emailError}
                keyboardType="email-address"
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

              <Input
                label={t('auth.confirmPassword')}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (confirmPasswordError) setConfirmPasswordError('');
                }}
                error={confirmPasswordError}
                secureTextEntry
              />
            </View>

            <View style={styles.actionContainer}>
              <Button
                title={t('auth.register')}
                variant="primary"
                size="lg"
                isLoading={isLoading}
                onPress={handleRegister}
              />

              <View style={styles.loginRow}>
                <Text style={styles.loginPrompt}>{t('auth.alreadyHaveAccount')} </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.loginLink}>{t('auth.login')}</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    paddingVertical: 28,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#131118',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  serverErrorBox: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  serverErrorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  actionContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  loginPrompt: {
    fontSize: 14,
    color: '#555555',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ff6e61',
    textDecorationLine: 'underline',
  },
});

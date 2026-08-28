import { i18n } from '@/localization/i18n';

export const getLocalizedAuthError = (error: any): string => {
  if (!error) {
    return i18n.t('auth.errors.unknownError');
  }

  // Network / Connection Error
  if (
    error.message === 'Network Error' ||
    error.code === 'ECONNABORTED' ||
    (error.name === 'AxiosError' && !error.response)
  ) {
    return i18n.t('auth.errors.networkError');
  }

  const status = error.response?.status;
  const detail = (
    error.response?.data?.detail ||
    error.response?.data?.error ||
    error.response?.data?.title ||
    error.response?.data?.message ||
    error.message ||
    ''
  ).toLowerCase();

  // 401 / 400 Invalid Credentials
  if (
    status === 401 ||
    detail.includes('invalid') ||
    detail.includes('credentials') ||
    detail.includes('geçersiz') ||
    detail.includes('hatalı') ||
    detail.includes('şifre') ||
    detail.includes('bulunamadı') ||
    detail.includes('not found') ||
    detail.includes('password')
  ) {
    return i18n.t('auth.errors.invalidCredentials');
  }

  // 409 / 400 Already Exists
  if (
    status === 409 ||
    detail.includes('already exists') ||
    detail.includes('already taken') ||
    detail.includes('in use') ||
    detail.includes('kullanımda') ||
    detail.includes('mevcut') ||
    detail.includes('zaten')
  ) {
    return i18n.t('auth.errors.userAlreadyExists');
  }

  // 500+ Server Error
  if (status && status >= 500) {
    return i18n.t('auth.errors.serverError');
  }

  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message && typeof error.message === 'string' && error.message !== 'Error') {
    return error.message;
  }

  return i18n.t('auth.errors.unknownError');
};

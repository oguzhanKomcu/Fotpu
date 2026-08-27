import { i18n } from '@/localization/i18n';

export const getLocalizedAuthError = (error: any): string => {
  if (!error) {
    return i18n.t('auth.errors.unknownError');
  }

  // Network / Connection Error
  if (
    error.message === 'Network Error' ||
    error.code === 'ECONNABORTED' ||
    error.name === 'AxiosError' && !error.response
  ) {
    return i18n.t('auth.errors.networkError');
  }

  const status = error.response?.status;
  const detail = (
    error.response?.data?.detail ||
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
    detail.includes('password') && detail.includes('incorrect') ||
    detail.includes('not found') ||
    detail.includes('hatalı')
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
    detail.includes('mevcut')
  ) {
    return i18n.t('auth.errors.userAlreadyExists');
  }

  // 500+ Server Error
  if (status && status >= 500) {
    return i18n.t('auth.errors.serverError');
  }

  // Fallback to error message or unknown error
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }

  return i18n.t('auth.errors.unknownError');
};

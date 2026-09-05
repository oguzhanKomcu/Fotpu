export type SupportedLanguage = 'tr' | 'en' | string;

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface TranslationSchema {
  common: {
    save: string;
    savedSuccess: string;
    unsavedSuccess: string;
    cancel: string;
    delete: string;
    edit: string;
    loading: string;
    error: string;
    success: string;
    retry: string;
    share: string;
    search: string;
    or: string;
    yes: string;
    no: string;
    ok: string;
    comments: string;
    reply: string;
    follow: string;
    following: string;
  };
  auth: {
    appTitle: string;
    appTagline: string;
    continueWithGoogle: string;
    continueWithApple: string;
    signInWithEmail: string;
    signUpWithEmail: string;
    login: string;
    register: string;
    username: string;
    usernamePlaceholder: string;
    fullName: string;
    fullNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    gender: string;
    female: string;
    male: string;
    unisex: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    termsNotice: string;
    loginSuccess: string;
    registerSuccess: string;
    errors: {
      fillRequiredFields: string;
      fullNameRequired: string;
      usernameRequired: string;
      emailRequired: string;
      invalidEmail: string;
      passwordRequired: string;
      passwordTooShort: string;
      confirmPasswordRequired: string;
      passwordsDoNotMatch: string;
      invalidCredentials: string;
      userAlreadyExists: string;
      networkError: string;
      serverError: string;
      unknownError: string;
    };
  };
  home: {
    headerTitle: string;
    followingFeed: string;
    uploadItemCta: string;
    womenswear: string;
    menswear: string;
    all: string;
    spring: string;
    summer: string;
    autumn: string;
    winter: string;
    aiGeneratedLooks: string;
    trendyStyle: string;
  };
  discover: {
    title: string;
    searchPlaceholder: string;
    noResults: string;
    noResultsDesc: string;
    clearFilters: string;
    rateLook: string;
    rateOutfitTitle: string;
    rateButtonText: string;
    ratedButtonText: string;
    yourRating: string;
    likesCount: string;
    ratingsCount: string;
    firstToRate: string;
    chooseRating: string;
    fineTuneScore: string;
    sliderHint: string;
    submitRating: string;
    viewAllComments: string;
    firstCommentPrompt: string;
    addCommentPlaceholder: string;
    postButton: string;
    shareMessage: string;
  };
  upload: {
    title: string;
    cancel: string;
    publish: string;
    camera: string;
    gallery: string;
    pickFromGallery: string;
    photoReady: string;
    changePhoto: string;
    postTitle: string;
    postTitlePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    tags: string;
    tagsPlaceholder: string;
    category: string;
    season: string;
    successMessage: string;
    errorMessage: string;
    missingInfo: string;
    permissionNeeded: string;
    cameraPermissionDesc: string;
    galleryPermissionDesc: string;
  };
  profile: {
    title: string;
    totalStyleScore: string;
    editProfile: string;
    aiCombos: string;
    myOutfits: string;
    noOutfitsYet: string;
    followers: string;
    following: string;
  };
  settings: {
    title: string;
    preferences: string;
    notifications: string;
    notificationsDesc: string;
    darkMode: string;
    darkModeDesc: string;
    language: string;
    languageDesc: string;
    selectLanguage: string;
    accountSecurity: string;
    changePassword: string;
    privacyPolicy: string;
    termsOfService: string;
    logout: string;
    logoutConfirmTitle: string;
    logoutConfirmMessage: string;
  };
}

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<TranslationSchema>;

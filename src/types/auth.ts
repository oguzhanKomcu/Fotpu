export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface LoginUserCommand {
  emailOrUsername?: string | null;
  password?: string | null;
}

export interface RegisterUserCommand {
  email?: string | null;
  username?: string | null;
  password?: string | null;
  fullName?: string | null;
}

export interface LoginResponse {
  accessToken?: string | null;
  refreshToken?: string | null;
  refreshTokenExpiresAt?: string;
}

export interface RefreshTokenUserCommand {
  expiredAccessToken?: string | null;
  refreshToken?: string | null;
}

export interface LogoutUserCommand {
  accessToken?: string | null;
  refreshToken?: string | null;
  logoutAllDevices?: boolean;
  userId?: string;
}

export interface UpdatePasswordCommand {
  currentPassword?: string | null;
  newPassword?: string | null;
  userId?: string;
}

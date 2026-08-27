export interface UserProfileDto {
  id: string;
  email?: string | null;
  username?: string | null;
  fullName?: string | null;
  bio?: string | null;
  profilePictureUrl?: string | null;
  createdAt: string;
  isActive: boolean;
  followersCount: number;
  followingCount: number;
  userScore: number;
}

export interface UpdateProfileCommand {
  fullName?: string | null;
  bio?: string | null;
  profilePictureUrl?: string | null;
  userId?: string;
}

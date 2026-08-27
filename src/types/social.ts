export interface FollowUserCommand {
  followerId: string;
  followingId: string;
}

export interface UnfollowUserCommand {
  followerId: string;
  followingId: string;
}

export interface UserFollowDto {
  userId: string;
  username: string;
  fullName?: string | null;
  profilePictureUrl?: string | null;
}

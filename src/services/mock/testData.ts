import { PostDto } from '@/types/post';
import { CommentDto } from '@/types/comment';

export interface ExtendedCommentDto extends CommentDto {
  timeAgo?: string;
  likesCount?: number;
  isLiked?: boolean;
  replyToUsername?: string;
}

export interface ExtendedPostDto extends PostDto {
  likesCount?: number;
  commentsCount?: number;
  topComments?: ExtendedCommentDto[];
  comments?: ExtendedCommentDto[];
}

export const MOCK_CURRENT_USER = {
  id: 'current_user_1',
  username: 'stylemaven',
  fullName: 'Alex Stylist',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
};

export const MOCK_POSTS: ExtendedPostDto[] = [
  {
    id: 'post_sarah_yellow_dress',
    userId: 'user_sarah_style',
    username: 'SarahStyle',
    userAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    mediaUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1000',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
    description: 'Absolutely adore this sunny day look from CombiAI! ☀️ #OOTD #AIFashion',
    isVideo: false,
    tags: ['OOTD', 'AIFashion', 'SummerVibes', 'YellowDress'],
    averageRating: 7.9,
    totalVotes: 128,
    likesCount: 1482,
    commentsCount: 42,
    isLiked: false,
    isSaved: false,
    createdAt: '2026-09-02T10:30:00.000Z',
    topComments: [
      {
        commentId: 'c_preview_1',
        userId: 'user_stylesavvy',
        username: 'StyleSavvy',
        content: 'Love the colors! So vibrant.',
        createdAt: '2026-09-02T11:00:00.000Z',
      },
      {
        commentId: 'c_preview_2',
        userId: 'user_fashionista_jane',
        username: 'Fashionista_Jane',
        content: 'That dress is a dream! 💛',
        createdAt: '2026-09-02T11:15:00.000Z',
      },
    ],
    comments: [
      {
        commentId: 'c1',
        userId: 'user_alex_m',
        username: 'Alex_M',
        userAvatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
        content: 'That yellow dress is stunning on you! 💛',
        timeAgo: '12m',
        likesCount: 4,
        isLiked: false,
        createdAt: '2026-09-02T14:48:00.000Z',
      },
      {
        commentId: 'c2',
        userId: 'user_fashionistajane',
        username: 'FashionistaJane',
        userAvatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
        content: 'Where did you get it? I need it!',
        timeAgo: '10m',
        likesCount: 12,
        isLiked: true,
        createdAt: '2026-09-02T14:50:00.000Z',
      },
      {
        commentId: 'c3',
        userId: 'user_sarah_style',
        username: 'SarahStyle',
        userAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        content: '@FashionistaJane It was an AI suggestion! So cool, right?',
        replyToUsername: 'FashionistaJane',
        timeAgo: '5m',
        likesCount: 3,
        isLiked: false,
        createdAt: '2026-09-02T14:55:00.000Z',
      },
      {
        commentId: 'c4',
        userId: 'user_stylesavvy',
        username: 'StyleSavvy',
        userAvatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        content: 'Love the colors! So vibrant.',
        timeAgo: '3m',
        likesCount: 1,
        isLiked: false,
        createdAt: '2026-09-02T14:57:00.000Z',
      },
      {
        commentId: 'c5',
        userId: 'user_fashionista_jane',
        username: 'Fashionista_Jane',
        userAvatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
        content: 'That dress is a dream! 💛',
        timeAgo: '2m',
        likesCount: 2,
        isLiked: false,
        createdAt: '2026-09-02T14:58:00.000Z',
      },
    ],
  },
  {
    id: 'post_alex_beige_look',
    userId: 'user_alex_m',
    username: 'Alex_M',
    userAvatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
    mediaUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1000',
    thumbnailUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400',
    description: 'Night out vibes. The AI nailed this one for me!',
    isVideo: false,
    tags: ['NightOut', 'LuxuryBag', 'Elegance', 'Heels'],
    averageRating: 9.2,
    totalVotes: 254,
    likesCount: 2105,
    commentsCount: 117,
    isLiked: false,
    isSaved: false,
    createdAt: '2026-09-02T09:15:00.000Z',
    topComments: [
      {
        commentId: 'c_alex_preview_1',
        userId: 'user_elena_chic',
        username: 'Elena_Chic',
        content: 'The handbag matches so well! 🔥',
        createdAt: '2026-09-02T09:30:00.000Z',
      },
      {
        commentId: 'c_alex_preview_2',
        userId: 'user_marcus_v',
        username: 'Marcus_V',
        content: 'Classy and modern look!',
        createdAt: '2026-09-02T09:45:00.000Z',
      },
    ],
    comments: [
      {
        commentId: 'c_alex_1',
        userId: 'user_elena_chic',
        username: 'Elena_Chic',
        userAvatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200',
        content: 'The handbag matches so well! 🔥',
        timeAgo: '20m',
        likesCount: 9,
        isLiked: true,
        createdAt: '2026-09-02T14:40:00.000Z',
      },
      {
        commentId: 'c_alex_2',
        userId: 'user_marcus_v',
        username: 'Marcus_V',
        userAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        content: 'Classy and modern look!',
        timeAgo: '15m',
        likesCount: 5,
        isLiked: false,
        createdAt: '2026-09-02T14:45:00.000Z',
      },
      {
        commentId: 'c_alex_3',
        userId: 'user_sarah_style',
        username: 'SarahStyle',
        userAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        content: 'Love the styling of this outfit! ✨',
        timeAgo: '8m',
        likesCount: 2,
        isLiked: false,
        createdAt: '2026-09-02T14:52:00.000Z',
      },
    ],
  },
  {
    id: 'post_elena_casual_street',
    userId: 'user_elena_chic',
    username: 'Elena_Chic',
    userAvatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200',
    mediaUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000',
    thumbnailUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
    description: 'Autumn shopping spree essentials! 🍂☕ #StreetChic #AutumnLook',
    isVideo: false,
    tags: ['StreetChic', 'AutumnLook', 'Shopping'],
    averageRating: 8.8,
    totalVotes: 189,
    likesCount: 1840,
    commentsCount: 38,
    isLiked: true,
    isSaved: true,
    createdAt: '2026-09-01T16:20:00.000Z',
    topComments: [
      {
        commentId: 'c_elena_preview_1',
        userId: 'user_alex_m',
        username: 'Alex_M',
        content: 'Perfect autumnal tones!',
        createdAt: '2026-09-01T17:00:00.000Z',
      },
    ],
    comments: [
      {
        commentId: 'c_elena_1',
        userId: 'user_alex_m',
        username: 'Alex_M',
        userAvatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
        content: 'Perfect autumnal tones!',
        timeAgo: '1h',
        likesCount: 8,
        isLiked: false,
        createdAt: '2026-09-01T17:00:00.000Z',
      },
    ],
  },
];

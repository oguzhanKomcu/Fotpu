import apiClient from './client';
import { RatePostRequest } from '@/types/rating';

export const ratingService = {
  ratePost: async (request: RatePostRequest): Promise<void> => {
    await apiClient.post('/api/ratings', request);
  },

  // Alias for compatibility
  rateOutfit: async (payload: { outfitId: string; rating: number }): Promise<void> => {
    // Map 1.0-10.0 or 1-5 to int score
    await apiClient.post('/api/ratings', {
      postId: payload.outfitId,
      score: Math.round(payload.rating),
    });
  },
};

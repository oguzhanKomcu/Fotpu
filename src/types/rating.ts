export interface RatePostRequest {
  postId: string;
  score: number; // int32: e.g. 1 to 5 (or 1 to 10 depending on scale)
}

export type RateOutfitPayload = RatePostRequest;

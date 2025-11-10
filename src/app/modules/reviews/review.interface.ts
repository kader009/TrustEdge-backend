import { Types } from 'mongoose';

export interface IReview {
  _id?: Types.ObjectId;
  product: Types.ObjectId;
  user: Types.ObjectId;

  // Basic Review Info
  title: string;
  description: string;
  rating: number;
  comment?: string;
  images?: string[];
  purchaseSource?: string;

  // Status & Moderation
  status: 'pending' | 'published' | 'unpublished';
  moderationReason?: string;

  // Premium Features
  isPremium: boolean;
  price?: number;

  // Counts
  upvoteCount?: number;
  downvoteCount?: number;
  commentCount?: number;

  createdAt?: Date;
  updatedAt?: Date;
}

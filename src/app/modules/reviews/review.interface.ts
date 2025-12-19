import { Types } from 'mongoose';

export interface IReview {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  title: string;
  description: string;
  category: string;
  rating: number;
  comment?: string;
  images?: string[];
  purchaseSource?: string;
  status: 'pending' | 'published' | 'unpublished';
  moderationReason?: string;
  isPremium: boolean;
  price?: number;
  upvoteCount?: number;
  downvoteCount?: number;
  commentCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

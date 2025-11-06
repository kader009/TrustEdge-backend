import { Types } from 'mongoose';

export interface IReview {
  _id?: Types.ObjectId;
  product: Types.ObjectId; // Relation with Product
  user: Types.ObjectId; // Relation with User
  rating: number; // 1-5 scale
  comment?: string;
  upvoteCount?: number; // Total upvotes
  downvoteCount?: number; // Total downvotes
  createdAt?: Date;
  updatedAt?: Date;
}

import { Types } from 'mongoose';

export interface IComment {
  _id?: Types.ObjectId;
  review: Types.ObjectId;
  user: Types.ObjectId;
  text: string;
  parentComment?: Types.ObjectId;
  status: 'pending' | 'published';
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

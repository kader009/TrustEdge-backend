import { Types } from 'mongoose';

export interface IVote {
  _id?: Types.ObjectId;
  review: Types.ObjectId;
  user: Types.ObjectId;
  voteType: 'upvote' | 'downvote';
  createdAt?: Date;
  updatedAt?: Date;
}

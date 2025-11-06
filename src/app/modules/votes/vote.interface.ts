import { Types } from 'mongoose';

export interface IVote {
  _id?: Types.ObjectId;
  review: Types.ObjectId; // Which review this vote belongs to
  user: Types.ObjectId; // Who voted
  voteType: 'upvote' | 'downvote'; // Type of vote
  createdAt?: Date;
  updatedAt?: Date;
}

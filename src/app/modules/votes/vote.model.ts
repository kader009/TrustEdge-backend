import { Schema, model } from 'mongoose';
import { IVote } from './vote.interface';

const voteSchema = new Schema<IVote>(
  {
    review: {
      type: Schema.Types.ObjectId,
      ref: 'Review',
      required: [true, 'Review reference is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    voteType: {
      type: String,
      enum: {
        values: ['upvote', 'downvote'],
        message: 'Vote type must be either upvote or downvote',
      },
      required: [true, 'Vote type is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate votes - one user can only vote once per review
voteSchema.index({ review: 1, user: 1 }, { unique: true });

// Index for faster queries
voteSchema.index({ review: 1, voteType: 1 });

export const Vote = model<IVote>('Vote', voteSchema);

import { Schema, model } from 'mongoose';
import { IComment } from './comment.interface';

const commentSchema = new Schema<IComment>(
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
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      minlength: [1, 'Comment must not be empty'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null, // null means it's a top-level comment
    },
    status: {
      type: String,
      enum: ['pending', 'published'],
      default: 'pending',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
commentSchema.index({ review: 1, createdAt: -1 }); // Get comments by review, sorted by date
commentSchema.index({ parentComment: 1 }); // Get replies to a comment
commentSchema.index({ user: 1 }); // Get comments by user

export const Comment = model<IComment>('Comment', commentSchema);

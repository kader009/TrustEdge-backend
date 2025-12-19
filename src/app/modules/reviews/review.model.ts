import { Schema, model } from 'mongoose';
import { IReview } from './review.interface';

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },

    // Basic Review Info
    title: {
      type: String,
      required: [true, 'Review title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Review description is required'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    images: {
      type: [String],
      default: [],
    },
    purchaseSource: {
      type: String,
      trim: true,
      maxlength: [500, 'Purchase source cannot exceed 500 characters'],
    },

    // Status & Moderation
    status: {
      type: String,
      enum: {
        values: ['pending', 'published', 'unpublished'],
        message: 'Status must be pending, published, or unpublished',
      },
      default: 'pending',
    },
    moderationReason: {
      type: String,
      trim: true,
      maxlength: [500, 'Moderation reason cannot exceed 500 characters'],
    },

    // Premium Features
    isPremium: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      min: [0, 'Price must be non-negative'],
      validate: {
        validator: function (this: IReview, value: number | undefined) {
          // If isPremium is true, price must be provided
          if (this.isPremium && (!value || value <= 0)) {
            return false;
          }
          return true;
        },
        message: 'Premium reviews must have a valid price',
      },
    },

    // Counts
    upvoteCount: {
      type: Number,
      default: 0,
      min: [0, 'Upvote count cannot be negative'],
    },
    downvoteCount: {
      type: Number,
      default: 0,
      min: [0, 'Downvote count cannot be negative'],
    },
    commentCount: {
      type: Number,
      default: 0,
      min: [0, 'Comment count cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for filtering and searching
reviewSchema.index({ category: 1 });
reviewSchema.index({ status: 1, createdAt: -1 }); // Filter by status
reviewSchema.index({ isPremium: 1 }); // Filter premium reviews
reviewSchema.index({ rating: 1 }); // Filter by rating
reviewSchema.index({ title: 'text', description: 'text' }); // Text search

export const Review = model<IReview>('Review', reviewSchema);

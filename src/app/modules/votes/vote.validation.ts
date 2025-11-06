import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Upvote/Downvote review validation
export const voteReviewSchema = z.object({
  params: z.object({
    reviewId: z
      .string({ required_error: 'Review ID is required' })
      .regex(objectIdRegex, 'Invalid review ID format'),
  }),
});

// Remove vote validation
export const removeVoteSchema = z.object({
  params: z.object({
    reviewId: z
      .string({ required_error: 'Review ID is required' })
      .regex(objectIdRegex, 'Invalid review ID format'),
  }),
});

// Get vote counts validation
export const getVoteCountsSchema = z.object({
  params: z.object({
    reviewId: z
      .string({ required_error: 'Review ID is required' })
      .regex(objectIdRegex, 'Invalid review ID format'),
  }),
});

// Get user vote validation
export const getUserVoteSchema = z.object({
  params: z.object({
    reviewId: z
      .string({ required_error: 'Review ID is required' })
      .regex(objectIdRegex, 'Invalid review ID format'),
  }),
});

// Get review votes validation
export const getReviewVotesSchema = z.object({
  params: z.object({
    reviewId: z
      .string({ required_error: 'Review ID is required' })
      .regex(objectIdRegex, 'Invalid review ID format'),
  }),
});

export const VoteValidation = {
  voteReviewSchema,
  removeVoteSchema,
  getVoteCountsSchema,
  getUserVoteSchema,
  getReviewVotesSchema,
};

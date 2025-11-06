import { Vote } from './vote.model';
import { Review } from '../reviews/review.model';
import { Types } from 'mongoose';

// Upvote a review
const upvoteReview = async (reviewId: string, userId: string) => {
  // Check if review exists
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error('Review not found');
  }

  // Check if user already voted
  const existingVote = await Vote.findOne({ review: reviewId, user: userId });

  if (existingVote) {
    // If already upvoted, do nothing (or throw error)
    if (existingVote.voteType === 'upvote') {
      throw new Error('You have already upvoted this review');
    }

    // If previously downvoted, change to upvote
    existingVote.voteType = 'upvote';
    await existingVote.save();

    // Update review vote counts
    await updateReviewVoteCounts(reviewId);

    return {
      message: 'Vote changed to upvote',
      vote: existingVote,
    };
  }

  // Create new upvote
  const vote = await Vote.create({
    review: reviewId,
    user: userId,
    voteType: 'upvote',
  });

  // Update review vote counts
  await updateReviewVoteCounts(reviewId);

  return {
    message: 'Review upvoted successfully',
    vote,
  };
};

// Downvote a review
const downvoteReview = async (reviewId: string, userId: string) => {
  // Check if review exists
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error('Review not found');
  }

  // Check if user already voted
  const existingVote = await Vote.findOne({ review: reviewId, user: userId });

  if (existingVote) {
    // If already downvoted, do nothing (or throw error)
    if (existingVote.voteType === 'downvote') {
      throw new Error('You have already downvoted this review');
    }

    // If previously upvoted, change to downvote
    existingVote.voteType = 'downvote';
    await existingVote.save();

    // Update review vote counts
    await updateReviewVoteCounts(reviewId);

    return {
      message: 'Vote changed to downvote',
      vote: existingVote,
    };
  }

  // Create new downvote
  const vote = await Vote.create({
    review: reviewId,
    user: userId,
    voteType: 'downvote',
  });

  // Update review vote counts
  await updateReviewVoteCounts(reviewId);

  return {
    message: 'Review downvoted successfully',
    vote,
  };
};

// Remove vote from a review
const removeVote = async (reviewId: string, userId: string) => {
  const vote = await Vote.findOneAndDelete({
    review: reviewId,
    user: userId,
  });

  if (!vote) {
    throw new Error('No vote found to remove');
  }

  // Update review vote counts
  await updateReviewVoteCounts(reviewId);

  return {
    message: 'Vote removed successfully',
  };
};

// Get vote counts for a review
const getVoteCounts = async (reviewId: string) => {
  const upvotes = await Vote.countDocuments({
    review: reviewId,
    voteType: 'upvote',
  });

  const downvotes = await Vote.countDocuments({
    review: reviewId,
    voteType: 'downvote',
  });

  return {
    upvotes,
    downvotes,
    totalVotes: upvotes + downvotes,
    score: upvotes - downvotes, // Net score
  };
};

// Get user's vote on a specific review
const getUserVote = async (reviewId: string, userId: string) => {
  const vote = await Vote.findOne({ review: reviewId, user: userId });
  return vote;
};

// Get all votes for a review with user details
const getReviewVotes = async (reviewId: string) => {
  const votes = await Vote.find({ review: reviewId })
    .populate('user', 'name email image')
    .sort({ createdAt: -1 });

  return votes;
};

// Helper function to update review vote counts
const updateReviewVoteCounts = async (reviewId: string) => {
  const reviewObjectId =
    typeof reviewId === 'string' ? new Types.ObjectId(reviewId) : reviewId;

  const voteCounts = await Vote.aggregate([
    { $match: { review: reviewObjectId } },
    {
      $group: {
        _id: '$voteType',
        count: { $sum: 1 },
      },
    },
  ]);

  let upvotes = 0;
  let downvotes = 0;

  voteCounts.forEach((item) => {
    if (item._id === 'upvote') {
      upvotes = item.count;
    } else if (item._id === 'downvote') {
      downvotes = item.count;
    }
  });

  // Update review model with vote counts (if you add these fields to Review model)
  await Review.findByIdAndUpdate(reviewId, {
    upvoteCount: upvotes,
    downvoteCount: downvotes,
  });

  return { upvotes, downvotes };
};

export const VoteService = {
  upvoteReview,
  downvoteReview,
  removeVote,
  getVoteCounts,
  getUserVote,
  getReviewVotes,
};

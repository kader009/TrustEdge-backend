import { Comment } from './comment.model';
import { Review } from '../reviews/review.model';
import { IComment } from './comment.interface';

// Create a new comment on a review
const createComment = async (payload: IComment) => {
  const review = await Review.findById(payload.review);
  if (!review) {
    throw new Error('Review not found');
  }

  // If it's a reply, check if parent comment exists
  if (payload.parentComment) {
    const parentComment = await Comment.findById(payload.parentComment);
    if (!parentComment) {
      throw new Error('Parent comment not found');
    }
    // Ensure parent comment belongs to the same review
    if (parentComment.review.toString() !== payload.review.toString()) {
      throw new Error('Parent comment does not belong to this review');
    }
  }

  const comment = await Comment.create(payload);

  // Update review comment count
  await updateReviewCommentCount(payload.review.toString());

  return await Comment.findById(comment._id)
    .populate('user', 'name email image')
    .populate('parentComment', 'text user');
};

// Get all comments for a review
const getReviewComments = async (reviewId: string) => {
  // Get top-level comments (no parent)
  const topLevelComments = await Comment.find({
    review: reviewId,
    parentComment: null,
    isDeleted: false,
  })
    .populate('user', 'name email image')
    .sort({ createdAt: -1 });

  // For each top-level comment, get its replies
  const commentsWithReplies = await Promise.all(
    topLevelComments.map(async (comment) => {
      const replies = await Comment.find({
        parentComment: comment._id,
        isDeleted: false,
      })
        .populate('user', 'name email image')
        .sort({ createdAt: 1 }); // Replies sorted oldest first

      return {
        ...comment.toObject(),
        replies,
        replyCount: replies.length,
      };
    })
  );

  return commentsWithReplies;
};

// Get a single comment by ID
const getSingleComment = async (id: string) => {
  const comment = await Comment.findById(id)
    .populate('user', 'name email image')
    .populate('parentComment', 'text user')
    .populate('review', 'rating comment');

  if (!comment) {
    throw new Error('Comment not found');
  }

  return comment;
};

// Get replies to a specific comment
const getCommentReplies = async (commentId: string) => {
  const replies = await Comment.find({
    parentComment: commentId,
    isDeleted: false,
  })
    .populate('user', 'name email image')
    .sort({ createdAt: 1 });

  return replies;
};

// Update a comment (only by the comment owner)
const updateComment = async (id: string, userId: string, text: string) => {
  const comment = await Comment.findById(id);

  if (!comment) {
    throw new Error('Comment not found');
  }

  if (comment.isDeleted) {
    throw new Error('This comment has been deleted');
  }

  if (comment.user.toString() !== userId) {
    throw new Error('You can only edit your own comments');
  }

  comment.text = text;
  await comment.save();

  return await Comment.findById(id)
    .populate('user', 'name email image')
    .populate('parentComment', 'text user');
};

// Delete a comment (by owner or admin)
const deleteComment = async (id: string, userId: string, isAdmin = false) => {
  const comment = await Comment.findById(id);

  if (!comment) {
    throw new Error('Comment not found');
  }

  // Check authorization
  if (!isAdmin && comment.user.toString() !== userId) {
    throw new Error('You can only delete your own comments');
  }

  // Soft delete
  comment.isDeleted = true;
  await comment.save();

  // Also soft delete all replies to this comment
  await Comment.updateMany({ parentComment: id }, { isDeleted: true });

  // Update review comment count
  await updateReviewCommentCount(comment.review.toString());

  return { message: 'Comment deleted successfully' };
};

// Hard delete a comment (admin only - for inappropriate content)
const hardDeleteComment = async (id: string) => {
  const comment = await Comment.findById(id);

  if (!comment) {
    throw new Error('Comment not found');
  }

  const reviewId = comment.review.toString();

  // Delete all replies first
  await Comment.deleteMany({ parentComment: id });

  // Delete the comment
  await Comment.findByIdAndDelete(id);

  // Update review comment count
  await updateReviewCommentCount(reviewId);

  return { message: 'Comment permanently deleted' };
};

// Get comment count for a review
const getCommentCount = async (reviewId: string) => {
  const count = await Comment.countDocuments({
    review: reviewId,
    isDeleted: false,
  });

  return { count };
};

// Get all comments by a user
const getUserComments = async (userId: string) => {
  const comments = await Comment.find({
    user: userId,
    isDeleted: false,
  })
    .populate('review', 'title rating description category images')
    .sort({ createdAt: -1 });

  return comments;
};

// Helper function to update review comment count
const updateReviewCommentCount = async (reviewId: string) => {
  const count = await Comment.countDocuments({
    review: reviewId,
    isDeleted: false,
  });

  await Review.findByIdAndUpdate(reviewId, {
    commentCount: count,
  });

  return count;
};

// Get all comments across all reviews (admin only)
const getAllComments = async () => {
  const comments = await Comment.find({ isDeleted: false })
    .populate('user', 'name email image')
    .populate('review', 'title rating description category')
    .populate('parentComment', 'text user')
    .sort({ createdAt: -1 });

  return comments;
};

export const CommentService = {
  createComment,
  getReviewComments,
  getSingleComment,
  getCommentReplies,
  updateComment,
  deleteComment,
  hardDeleteComment,
  getCommentCount,
  getUserComments,
  getAllComments,
};

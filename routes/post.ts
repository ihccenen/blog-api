import express from 'express';
import {
  getAllPosts,
  getSinglePost,
  createPost,
  updatePostPublishedStatus,
  deletePost,
} from '../controllers/postController';
import {
  createComment,
  deleteComment,
  getAllComments,
} from '../controllers/commentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(getAllPosts).post(protect, createPost);

router
  .route('/:postId')
  .get(getSinglePost)
  .put(protect, updatePostPublishedStatus)
  .delete(protect, deletePost);

// router.route('/:postId/comments').get(getAllComments).post(createComment);

// router.delete('/:postId/comments/:commentId', protect, deleteComment);

export default router;

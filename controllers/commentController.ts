import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Comment from '../models/comment';
import { body, validationResult } from 'express-validator';

const getAllPostComments = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;
  const allPostComments = await Comment.find({ post: postId });

  res.json(allPostComments);
});

const createComment = [
  body('username').trim().escape().isLength({ min: 1 }),
  body('text').trim().escape().isLength({ min: 1 }),
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400);

      throw new Error('Invalid comment data');
    }

    const { postId } = req.params;
    const { username, text } = req.body;
    const comment = new Comment({ username, text, post: postId });

    comment.save();

    res.status(201).json({ message: 'Comment created' });
  }),
];

const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    res.status(404);

    throw new Error('Comment not found');
  }

  const result = await comment.deleteOne();

  const message = `Comment with ID ${result._id} deleted`;

  res.status(201).json({ message });
});

export { getAllPostComments, createComment, deleteComment };

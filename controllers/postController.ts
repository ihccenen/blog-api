import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import Post from '../models/post';
import Comment from '../models/comment';

const getAllPosts = asyncHandler(async (req: any, res: Response) => {
  const token = req.cookies.jwt;
  let allPosts = await Post.find()
    .populate('user', 'username')
    .sort('-updatedAt');
  let user;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    user = await User.findById(decoded.userId);
  } catch (error) {
    user = null;
  }

  allPosts = user ? allPosts : allPosts.filter((post) => post.published);

  res.status(200).json(allPosts);
});

const getSinglePost = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;

  const post = await Post.findById(postId).populate('user', 'username');

  if (!post) {
    res.status(404);

    throw new Error('Post not found');
  }

  res.status(200).json(post);
});

const createPost = [
  body('title').trim().escape().isLength({ min: 1 }),
  body('text').trim().escape().isLength({ min: 1 }),
  body('published').trim().escape(),
  asyncHandler(async (req: any, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400);

      throw new Error('Invalid post data');
    }

    const { title, text, published = false } = req.body;
    const { _id } = req.user;
    const post = new Post({ title, text, published, user: _id });

    post.save();

    res.status(200).json({ message: 'Post created' });
  }),
];

const updatePostPublishedStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { published } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      res.status(404);

      throw new Error('Post not found');
    }

    post.published = published;

    const updatedPost = await post.save();

    res.status(201).json(updatedPost);
  }
);

const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    res.status(404);

    throw new Error('Post not found');
  }

  const result = await post.deleteOne();

  await Comment.deleteMany({ post: postId });

  const message = `Post '${result.title}' with ID ${result._id} deleted`;

  res.status(201).json({ message });
});

export {
  getAllPosts,
  getSinglePost,
  updatePostPublishedStatus,
  createPost,
  deletePost,
};

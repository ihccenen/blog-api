import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken';
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/user';

const authUser = [
  body('username').trim().escape().isLength({ min: 1 }),
  body('password').trim().escape().isLength({ min: 1 }),
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400);

      throw new Error('Invalid user data');
    }

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id.toString());

      res.status(201).json({ username: user.username, _id: user._id });
    } else {
      res.status(401);

      throw new Error('Invalid username or password');
    }
  }),
];

const registerUser = [
  body('username').trim().escape().isLength({ min: 1 }),
  body('password').trim().escape().isLength({ min: 1 }),
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400);

      throw new Error('Invalid user data');
    }

    const { username, password } = req.body;

    const userExists = await User.findOne({ username });

    if (userExists) {
      res.status(400);

      throw new Error('User already exists');
    }

    const user = new User({ username, password });

    user.save();

    generateToken(res, user._id.toString());

    res.status(201).json({ username: user.username, _id: user._id });
  }),
];

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: 'User logged out' });
});

export { authUser, registerUser, logoutUser };

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user';

const protect = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          userId: string;
        };

        req.user = await User.findById(decoded.userId);

        next();
      } catch (error) {
        res.status(401);

        throw new Error('Not authorized, invalid token');
      }
    } else {
      res.status(401);

      throw new Error('Not authorized, no token');
    }
  }
);

export { protect };

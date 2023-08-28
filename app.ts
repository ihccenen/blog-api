import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import connectDB from './config/db';
import userRouter from './routes/user';
import postRouter from './routes/post'

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/v1/users', userRouter);

app.use('/api/v1/posts', postRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

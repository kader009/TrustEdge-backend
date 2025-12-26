import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRoutes } from './app/modules/auth/auth.route';
import { userRoutes } from './app/modules/user/user.route';
import { CategoryRoutes } from './app/modules/category/category.route';
import { reviewRoutes } from './app/modules/reviews/review.route';
import { voteRoutes } from './app/modules/votes/vote.route';
import { commentRoutes } from './app/modules/comments/comment.route';
import { paymentRoutes } from './app/modules/payment/payment.route';
import { healthRoutes } from './app/modules/health/health.route';

const app: Application = express();

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://trustedge.vercel.app',
      'https://sandbox.sslcommerz.com',
    ],
    credentials: true,
  })
);

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Application routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/category', CategoryRoutes);
app.use('/api/v1/review', reviewRoutes);
app.use('/api/v1/votes', voteRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/payment', paymentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Trustedge Backend!');
});

export default app;

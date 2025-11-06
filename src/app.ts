import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRoutes } from './app/modules/auth/auth.route';
import { userRoutes } from './app/modules/user/user.route';
import { productRoutes } from './app/modules/products/product.route';
import { CategoryRoutes } from './app/modules/category/category.route';
import { reviewRoutes } from './app/modules/reviews/review.route';
import { voteRoutes } from './app/modules/votes/vote.route';

const app: Application = express();

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://aronyo.vercel.app',
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
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/category', CategoryRoutes);
app.use('/api/v1/review', reviewRoutes);
app.use('/api/v1/votes', voteRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Trustedge Backend!');
});

export default app;

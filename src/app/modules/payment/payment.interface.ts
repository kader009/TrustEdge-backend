import { Types } from 'mongoose';

export type TPaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

export interface IPayment {
  _id?: Types.ObjectId;
  transactionId: string;
  user: Types.ObjectId;
  review: Types.ObjectId;
  amount: number;
  currency: string;
  status: TPaymentStatus;
  paymentGatewayData?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

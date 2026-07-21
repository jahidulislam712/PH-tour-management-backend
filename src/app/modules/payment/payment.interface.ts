/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export enum PAYMENT_STATUS {
  PAID = "PAID",
  UNPAID = "UNPAID",
  FAILD = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export interface IInvoice{
  url: string;
  publicId: string;
}

export interface IPayment {
  booking: Types.ObjectId;
  transactionId: string;
  amount: number;
  paymentGatewayData?: any;
  invoice?: IInvoice;
  status: PAYMENT_STATUS;
}

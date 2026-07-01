import { Types } from "mongoose";

export enum BOOKING_STATUS{
  PENDING = "PENDING",
  CANCEL = "CANCEL",
  COMPLETE = "COMPLETE",
  FAILD = "FAILD"
}

export interface IBooking{
  user: Types.ObjectId,
  tour: Types.ObjectId,
  payment?: Types.ObjectId,
  gestCount: number,
  status: BOOKING_STATUS,
  createdAt?: Date
}
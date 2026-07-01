import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { User } from "../user/user.model";


const initPayment = async (bookingId: string) => {

  const payment = await Payment.findOne({booking: bookingId})

  if( !payment ){
    throw new AppError(StatusCodes.BAD_REQUEST, "Payment not found. You haven't booked this tour.")
  }

  const booking = await Booking.findById(payment.booking)

  if( !booking ){
    throw new AppError(StatusCodes.BAD_REQUEST, "Booking not found!")
  }

  const user = await User.findById(booking.user)

  if( !user ){
    throw new AppError(StatusCodes.BAD_REQUEST, "User not found!")
  }

  const email = user.email
  const name = user.name
  const phone = user.phone ?? ""
  const address = [
    user.address?.village,
    user.address?.postOffice,
    user.address?.upazila,
    user.address?.district,
    user.address?.division
  ]
  .filter(Boolean)
  .join(",")

  const sslPayload: ISSLCommerz = {
    address,
    amount: payment.amount,
    email,
    name,
    phone,
    transactionId: payment.transactionId
  }
  
  const sslPayment = await SSLService.sslPaymentInit(sslPayload)

  return {
    paymentUrl: sslPayment.GatewayPageURL
  }

}

const paymentSuccess = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // update payment status
    const transactionId = query.transactionId as string;
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: transactionId },
      {
        status: PAYMENT_STATUS.PAID,
      },
    ).populate("booking");

    // update booking status
    await Booking.findOneAndUpdate(updatedPayment?.booking, {
      status: BOOKING_STATUS.COMPLETE,
    })
      .populate("tour")
      .populate("user");

    session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Payment completed successfully",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const paymentFail = async (query: Record<string, string>) => {
  const transactionId = query.transactionId as string;

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // update payment status
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: transactionId },
      { status: BOOKING_STATUS.FAILD },
      { returnDocument: "after" },
    ).populate("booking");

    // update booking status
    await Booking.findOneAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.FAILD },
      { returnDocument: "after" },
    )
      .populate("user")
      .populate("tour");

    session.commitTransaction();
    session.endSession();
    return {
      success: false,
      message: "Payment failed",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const paymentCancel = async (query: Record<string, string>) => {
  const transactionId = query.transactionId as string;
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: transactionId },
      {
        status: PAYMENT_STATUS.CANCELLED,
      },
      { runValidators: true, session: session },
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.CANCEL },
      { runValidators: true, session },
    );

    await session.commitTransaction(); //transaction
    session.endSession();
    return { success: false, message: "Payment Cancelled" };
  } catch (error) {
    await session.abortTransaction(); // rollback
    session.endSession();
    // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
    throw error;
  }
};

export const PaymentService = {
  initPayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
};

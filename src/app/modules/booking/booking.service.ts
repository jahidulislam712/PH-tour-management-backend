import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/appError";
import { StatusCodes } from "http-status-codes";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = `trans_${Date.now()}_${Math.floor(Math.random() * 9999)}`;

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);

    if (!user?.phone || !user?.address) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Update your profile first");
    }

    const tour = await Tour.findById(payload.tour);

    if (!tour) {
      throw new AppError(StatusCodes.BAD_REQUEST, "No Tour Cost Found!");
    }

    const [createBooking] = await Booking.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session },
    );

    if( !createBooking ){
      throw new AppError(StatusCodes.BAD_REQUEST, "Booking couldn't be created")
    }

    const amount = Number(payload?.gestCount) * Number(tour?.costFrom);

    const [createPayment] = await Payment.create(
      [
        {
          booking: createBooking._id,
          transactionId,
          amount,
          status: PAYMENT_STATUS.UNPAID,
        },
      ],
      { session },
    );

    if( !createPayment ){
      throw new AppError(StatusCodes.BAD_REQUEST, "Payment couldn't be created")
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      createBooking._id,
      { payment: createPayment._id },
      { returnDocument: "after", runValidators: true, session },
    )
      .populate("user", "name email address phone")
      .populate("tour", "title costFrom")
      .populate("payment");


    const address = user.address.district as string
    const name = user.name
    const email = user.email
    const phone = user.phone

    const sslPayload: ISSLCommerz = {
      address, name, email, phone, amount, transactionId
    }

    const sslPayment = await SSLService.sslPaymentInit(sslPayload)
    

    await session.commitTransaction(); // transaction
    session.endSession()

    return {
      paymentUrl: sslPayment.GatewayPageURL,
      booking: updatedBooking
    };

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const BookingService = {
  createBooking,
};

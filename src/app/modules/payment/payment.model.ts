import { model, Schema } from "mongoose";
import { IInvoice, IPayment, PAYMENT_STATUS } from "./payment.interface";

const invoiceSchema = new Schema<IInvoice>({
  url: String,
  publicId: String
}, {
  _id: false,
  versionKey: false
})

const paymentSchema = new Schema<IPayment>({
  booking: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Booking",
    unique: true
  },
  transactionId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentGatewayData: {
    type: Schema.Types.Mixed
  },
  invoice: {type: invoiceSchema},
  status: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.UNPAID
  }
})

export const Payment = model<IPayment>("Payment", paymentSchema)
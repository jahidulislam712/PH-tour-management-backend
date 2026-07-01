import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { envVars } from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const initPayment = catchAsync( async(req: Request, res: Response) => {

  const bookingId = req.params.bookingId as string

  const result = await PaymentService.initPayment(bookingId)

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Payment done successfully",
    data: result
  })
} )

const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const result = await PaymentService.paymentSuccess(query);

  if (result.success) {
    res.redirect(
      `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&message=${result.message}&status=${query.status}`,
    );
  }
});

const paymentFail = catchAsync( async (req: Request, res: Response) => {

  const query = req.query as Record<string, string>

  const result = await PaymentService.paymentFail(query)

  if( ! result.success ){
    res.redirect(
      `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&message=${result.message}&status=${query.status}`,
    )
  }

})

const paymentCancel = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await PaymentService.paymentCancel(query as Record<string, string>)

    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
});

export const paymentController = {
  initPayment,
  paymentSuccess,
  paymentFail,
  paymentCancel
}
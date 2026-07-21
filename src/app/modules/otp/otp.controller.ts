import { Request, Response } from "express"
import { sendResponse } from "../../utils/sendResponse"
import { StatusCodes } from "http-status-codes"
import { OTPServices } from "./otp.service"
import { catchAsync } from "../../utils/catchAsync"

const sendOTP = catchAsync( async (req: Request, res: Response) => {

  OTPServices.sendOTP(req.body)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "OTP sent to your email successfully",
    data: null
  })
})

const verifyOTP = catchAsync( async (req: Request, res: Response) => {

  const {email, otp} = req.body

  await OTPServices.verifyOTP(email, otp)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User verified successfully",
    data: null
  })
})

export const OTPController = {
  sendOTP,
  verifyOTP
}
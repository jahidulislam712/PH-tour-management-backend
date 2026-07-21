import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { statsServices } from "./stats.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const getUserStats = catchAsync( async(req: Request, res: Response) => {
  const userStats = await statsServices.getUserStats()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Retrived user stats successfully",
    data: userStats
  })
} )

const getTourStats = catchAsync( async(req: Request, res: Response) => {
  const tourStats = await statsServices.getTourStats()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Retrived Tour stats successfully",
    data: tourStats
  })
} )

const getBookingStats = catchAsync( async(req: Request, res: Response) => {
  const booking = await statsServices.getBookingStats()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Retrived Booking stats successfully",
    data: booking
  })
} )

const getPaymentStats = catchAsync( async(req: Request, res: Response) => {
  const payment = await statsServices.getPaymentStats()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Retrived payment stats successfully",
    data: payment
  })
} )

export const statsController = {
  getUserStats,
  getTourStats,
  getBookingStats,
  getPaymentStats
}
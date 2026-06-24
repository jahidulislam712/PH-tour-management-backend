import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { tourServices } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

// create tour-type
const createTourType = catchAsync( async (req: Request, res: Response) => {
  
  const tourType = await tourServices.createTourType(req.body)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Tour created successfully",
    data: tourType
  })

} )

// get all tour-types
const getAllTourType = catchAsync( async(req: Request, res: Response) => {
  const result = await tourServices.getAllTourType()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All tour-types",
    data: result
  })
} )

const createTour = catchAsync( async (req: Request, res: Response) => {

  const tour = await tourServices.createTour(req.body)

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Tour created successfully",
    data: tour
  })

} )

export const tourControllers = {
  createTourType,
  createTour,
  getAllTourType
}
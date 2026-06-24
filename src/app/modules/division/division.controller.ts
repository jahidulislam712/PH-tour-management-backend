import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { divisionServices } from "./division.services";

// create division controller
const createDivision = catchAsync( async (req: Request, res: Response) => {

  const division = await divisionServices.createDivision(req.body)

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Division created successfully",
    success: true,
    data: division
  })
})


// get all divisions
const getAllDivisions = catchAsync( async (req: Request, res: Response) => {

  const allDivisions = await divisionServices.getAllDivisions()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All divisions",
    data: allDivisions
  })
} )


// update division controller
const updateDivision = catchAsync( async (req: Request, res: Response) => {

  const id = req.params.id as string
  
  const updatedDevision = await divisionServices.updateDivision(id, req.body)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Division udpated successfully",
    data: updatedDevision
  })

} )

export const divisionController = {
  createDivision,
  updateDivision,
  getAllDivisions
}
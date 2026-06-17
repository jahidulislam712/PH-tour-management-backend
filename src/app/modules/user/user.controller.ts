import { Request, Response } from "express";
import httpStatus, { StatusCodes } from "http-status-codes"
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/appError";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync( async (req: Request, res: Response) => {
  const user = await userServices.createUser(req.body)
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully",
    data: user,
  })
})


const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id as string;
  const payload = req.body;
  const verifiedToken = req.user

  const user = await userServices.updateUser(userId, payload, verifiedToken as JwtPayload)

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "User updated successfully",
    data: user
  })
})


const getAllUsers = catchAsync( async (req: Request, res: Response) => {
  const users = await userServices.getAllUsers()

  if( users.meta.total <= 0 ){
    throw new AppError(StatusCodes.NOT_FOUND, "Users not found!")
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Users found.",
    success: true,
    data: users.data,
    meta: users.meta
  })

})


export const userControllers = {
  createUser,
  updateUser,
  getAllUsers
}